-- Spelling Bee v2 Migration
-- Adds tables for expanded spelling app with star tracking, sessions, and freemium

-- ============================================================================
-- 1. ALTER existing child_profiles table
-- ============================================================================

ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS has_paid_spelling BOOLEAN DEFAULT false;
ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS placement_tier INTEGER;

-- ============================================================================
-- 2. spelling_progress — per-word progress for each child
-- ============================================================================

CREATE TABLE IF NOT EXISTS spelling_progress (
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  sm2_ease_factor REAL NOT NULL DEFAULT 2.5,
  sm2_interval INTEGER NOT NULL DEFAULT 0,
  sm2_repetitions INTEGER NOT NULL DEFAULT 0,
  sm2_next_review_date TEXT,
  sm2_mastery_score INTEGER NOT NULL DEFAULT 0,
  times_attempted INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  stars INTEGER NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  correct_sessions INTEGER NOT NULL DEFAULT 0,
  last_session_id TEXT,
  last_seen_date TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (child_id, word_id)
);

ALTER TABLE spelling_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their children's spelling progress"
  ON spelling_progress FOR SELECT
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can insert their children's spelling progress"
  ON spelling_progress FOR INSERT
  WITH CHECK (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can update their children's spelling progress"
  ON spelling_progress FOR UPDATE
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

-- ============================================================================
-- 3. spelling_sessions — session records
-- ============================================================================

CREATE TABLE IF NOT EXISTS spelling_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('study', 'test', 'drill', 'placement')),
  words_studied TEXT[] NOT NULL DEFAULT '{}',
  correct INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE spelling_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their children's spelling sessions"
  ON spelling_sessions FOR SELECT
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can insert their children's spelling sessions"
  ON spelling_sessions FOR INSERT
  WITH CHECK (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can update their children's spelling sessions"
  ON spelling_sessions FOR UPDATE
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

-- ============================================================================
-- 4. spelling_results — individual word results within sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS spelling_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES spelling_sessions(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  typed_answer TEXT,
  time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE spelling_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their children's spelling results"
  ON spelling_results FOR SELECT
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can insert their children's spelling results"
  ON spelling_results FOR INSERT
  WITH CHECK (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

-- ============================================================================
-- 5. spelling_custom_lists — homework word lists
-- ============================================================================

CREATE TABLE IF NOT EXISTS spelling_custom_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  word_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE spelling_custom_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their children's custom lists"
  ON spelling_custom_lists FOR SELECT
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can insert their children's custom lists"
  ON spelling_custom_lists FOR INSERT
  WITH CHECK (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can update their children's custom lists"
  ON spelling_custom_lists FOR UPDATE
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

CREATE POLICY "Users can delete their children's custom lists"
  ON spelling_custom_lists FOR DELETE
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE id = child_id));

-- ============================================================================
-- 6. email_leads — email capture for freemium
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'spelling-bee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit their email (anon insert)
CREATE POLICY "Anyone can submit email lead"
  ON email_leads FOR INSERT
  WITH CHECK (true);

-- Only service role can read leads (no user-facing SELECT policy)

-- ============================================================================
-- 7. Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_spelling_progress_child ON spelling_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_spelling_sessions_child ON spelling_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_spelling_results_session ON spelling_results(session_id);
CREATE INDEX IF NOT EXISTS idx_spelling_results_child ON spelling_results(child_id);
CREATE INDEX IF NOT EXISTS idx_spelling_custom_lists_child ON spelling_custom_lists(child_id);
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);
