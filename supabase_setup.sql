-- ========================================
-- QuickVid Database Setup for Supabase
-- ========================================
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wtphsmskjuouupldiaef/sql/new

-- 1. Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  video_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can read their own summaries" ON summaries;
DROP POLICY IF EXISTS "Users can insert their own summaries" ON summaries;
DROP POLICY IF EXISTS "Service role can do everything" ON summaries;

-- 4. Create policy for users to read their own summaries
CREATE POLICY "Users can read their own summaries"
  ON summaries
  FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Create policy for users to insert their own summaries  
CREATE POLICY "Users can insert their own summaries"
  ON summaries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Create policy for service role to bypass RLS
-- This is CRITICAL for the backend to work!
CREATE POLICY "Service role can do everything"
  ON summaries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries(created_at DESC);

-- 8. Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'summaries'
ORDER BY ordinal_position;

-- 9. Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'summaries';
