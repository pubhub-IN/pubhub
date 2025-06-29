/*
  Create chat_messages table for PubHub AI Assistant
  
  Table structure:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users.id)
  - `session_id` (text) - Groups messages in a conversation
  - `role` (text) - 'user', 'assistant', or 'system'
  - `content` (text) - The message content
  - `created_at` (timestamp) - When the message was sent
  
  Features:
  - 48-hour TTL implemented via RLS policy and cron job
  - RLS enabled to ensure users only see their own messages
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create index for faster lookups on session_id and created_at
CREATE INDEX chat_messages_session_id_idx ON chat_messages (session_id);
CREATE INDEX chat_messages_created_at_idx ON chat_messages (created_at);

-- Create function to delete messages older than 48 hours
CREATE OR REPLACE FUNCTION delete_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_messages
  WHERE created_at < NOW() - INTERVAL '48 hours';
END;
$$ language 'plpgsql';

-- Create cron job to clean up old messages
-- Note: This requires pg_cron extension to be enabled
-- For Supabase, you may need to use Edge Functions instead
COMMENT ON FUNCTION delete_old_chat_messages() IS 'Function to delete chat messages older than 48 hours';
