/*
  Add social media usernames to users table

  This migration adds:
  - `linkedin_username` - LinkedIn username for profile linking
  - `x_username` - X (Twitter) username for profile linking
*/

-- Add new columns to the users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS linkedin_username TEXT,
ADD COLUMN IF NOT EXISTS x_username TEXT;
