-- 006_spelling_schema_fix.sql
-- Fixes the spelling schema mismatch between v1 (004_spelling.sql) and v2 store code.
-- The v2 migration (005) used CREATE TABLE IF NOT EXISTS, so if v1 tables existed
-- they kept the old column names. This migration ALTERs the v1 tables to match
-- what useSpellingProgressStore expects.
--
-- Also creates the spelling_payments table (referenced by edge functions but
-- never created in any prior migration).
--
-- Safe to run multiple times — all operations are idempotent.

-- ════════════════════════════════════════════════════════════════════
-- 1. Fix spelling_progress column names (v1 → v2)
-- ════════════════════════════════════════════════════════════════════

-- Rename SM2 columns from v1 names to v2 sm2_ prefixed names.
-- Uses DO blocks to check column existence first (safe if already renamed).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spelling_progress' AND column_name = 'ease_factor'
  ) THEN
    ALTER TABLE spelling_progress RENAME COLUMN ease_factor TO sm2_ease_factor;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spelling_progress' AND column_name = 'interval'
  ) THEN
    ALTER TABLE spelling_progress RENAME COLUMN "interval" TO sm2_interval;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spelling_progress' AND column_name = 'repetitions'
  ) THEN
    ALTER TABLE spelling_progress RENAME COLUMN repetitions TO sm2_repetitions;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spelling_progress' AND column_name = 'next_review_date'
  ) THEN
    ALTER TABLE spelling_progress RENAME COLUMN next_review_date TO sm2_next_review_date;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spelling_progress' AND column_name = 'mastery_score'
  ) THEN
    ALTER TABLE spelling_progress RENAME COLUMN mastery_score TO sm2_mastery_score;
  END IF;
END $$;

-- Add new columns that v2 store expects but v1 schema doesn't have
ALTER TABLE spelling_progress ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0;
ALTER TABLE spelling_progress ADD COLUMN IF NOT EXISTS correct_sessions INTEGER DEFAULT 0;
ALTER TABLE spelling_progress ADD COLUMN IF NOT EXISTS last_session_id TEXT;

-- ════════════════════════════════════════════════════════════════════
-- 2. Ensure spelling_sessions has the columns the store needs
-- ════════════════════════════════════════════════════════════════════

-- The v1 schema already has 'date TEXT' which the store uses.
-- Add session_type as NULLABLE so existing inserts (which omit it) still work.
ALTER TABLE spelling_sessions ADD COLUMN IF NOT EXISTS session_type TEXT;

-- ════════════════════════════════════════════════════════════════════
-- 3. Ensure child_profiles has spelling columns
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS has_paid_spelling BOOLEAN DEFAULT false;
ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS placement_tier INTEGER;

-- ════════════════════════════════════════════════════════════════════
-- 4. Create spelling_payments table
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS spelling_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lemonsqueezy_order_id TEXT UNIQUE,
  parent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE spelling_payments ENABLE ROW LEVEL SECURITY;

-- Service role key bypasses RLS. These policies are for the client SDK:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'spelling_payments' AND policyname = 'Spelling: parent can read own payments'
  ) THEN
    CREATE POLICY "Spelling: parent can read own payments"
      ON spelling_payments FOR SELECT
      USING (parent_id = auth.uid());
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════
-- 5. Create spelling_results table (if not already from 005)
-- ════════════════════════════════════════════════════════════════════

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'spelling_results' AND policyname = 'Spelling: parent can read own results'
  ) THEN
    CREATE POLICY "Spelling: parent can read own results"
      ON spelling_results FOR SELECT
      USING (
        child_id IN (SELECT id FROM child_profiles WHERE parent_id = auth.uid())
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'spelling_results' AND policyname = 'Spelling: parent can insert own results'
  ) THEN
    CREATE POLICY "Spelling: parent can insert own results"
      ON spelling_results FOR INSERT
      WITH CHECK (
        child_id IN (SELECT id FROM child_profiles WHERE parent_id = auth.uid())
      );
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════
-- 6. Create email_leads table (if not already from 005)
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'spelling-bee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'email_leads' AND policyname = 'Anyone can insert email leads'
  ) THEN
    CREATE POLICY "Anyone can insert email leads"
      ON email_leads FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════
-- 7. Indexes for performance
-- ════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_spelling_payments_email ON spelling_payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_spelling_payments_parent ON spelling_payments(parent_id);
CREATE INDEX IF NOT EXISTS idx_spelling_results_session ON spelling_results(session_id);
CREATE INDEX IF NOT EXISTS idx_spelling_results_child ON spelling_results(child_id);
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);
