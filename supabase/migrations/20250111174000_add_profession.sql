/*
  # Add profession column to users table

  1. Changes
    - Add `profession` (text) column to `users` table for storing user's profession
    - This allows personalized technology recommendations during onboarding
*/

ALTER TABLE users ADD COLUMN profession TEXT;