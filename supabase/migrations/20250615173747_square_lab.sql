/*
  # Create submissions table

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `college` (text)
      - `language` (text)
      - `code` (text)
      - `question_index` (integer)
      - `timestamp` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `submissions` table
    - Add policies for users to insert and view their own submissions
    - Add policy for admins to view all submissions
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  college text NOT NULL,
  language text NOT NULL,
  code text NOT NULL,
  question_index integer NOT NULL,
  timestamp text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON submissions(user_id);
CREATE INDEX IF NOT EXISTS submissions_question_index_idx ON submissions(question_index);
CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON submissions(created_at DESC);

-- Add constraint to ensure valid question indices
ALTER TABLE submissions ADD CONSTRAINT valid_question_index CHECK (question_index >= 0 AND question_index <= 10);

-- Add constraint to ensure valid programming languages
ALTER TABLE submissions ADD CONSTRAINT valid_language CHECK (language IN ('C++', 'Java', 'Python', 'JavaScript'));