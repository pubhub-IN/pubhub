/*
  # Create users table for PubHub

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `github_id` (bigint, unique) - GitHub user ID
      - `github_username` (text) - GitHub username
      - `avatar_url` (text) - GitHub avatar URL
      - `email` (text) - User email from GitHub
      - `name` (text) - User's display name
      - `total_commits` (integer) - Total commits in past year
      - `languages` (jsonb) - Languages with percentages
      - `technologies` (text[]) - Selected technologies during onboarding
      - `github_data` (jsonb) - Additional GitHub data
      - `access_token` (text) - GitHub access token (encrypted)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id BIGINT UNIQUE NOT NULL,
  github_username TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT,
  name TEXT,
  total_commits INTEGER DEFAULT 0,
  languages JSONB DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  github_data JSONB DEFAULT '{}',
  access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();