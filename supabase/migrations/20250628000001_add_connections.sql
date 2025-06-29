/*
  Add LinkedIn-like connection system

  This migration adds:
  - `connections` table for managing user connections
  - `connection_requests` table for pending connection requests
  - Proper indexing and RLS policies
*/

-- Create connections table for mutual connections
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Create connection requests table for pending requests
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT, -- Optional message with the request
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(requester_id, recipient_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user_id ON connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_requester_id ON connection_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_recipient_id ON connection_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON connection_requests(status);

-- Enable RLS on both tables
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for connections table
CREATE POLICY "Users can view their own connections"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text OR auth.uid()::text = connected_user_id::text);

CREATE POLICY "Users can create connections"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own connections"
  ON connections
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text OR auth.uid()::text = connected_user_id::text);

-- RLS Policies for connection_requests table
CREATE POLICY "Users can view requests they sent or received"
  ON connection_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = requester_id::text OR auth.uid()::text = recipient_id::text);

CREATE POLICY "Users can create connection requests"
  ON connection_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = requester_id::text);

CREATE POLICY "Recipients can update connection requests"
  ON connection_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = recipient_id::text);

CREATE POLICY "Users can delete their own requests"
  ON connection_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = requester_id::text OR auth.uid()::text = recipient_id::text);

-- Create updated_at trigger for connection_requests
CREATE TRIGGER update_connection_requests_updated_at
  BEFORE UPDATE ON connection_requests
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
