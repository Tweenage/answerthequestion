-- ReadTheQuestion Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database

-- ============================================
-- 1. CHILD PROFILES
-- ============================================
create table if not exists child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 30),
  avatar jsonb not null default '{}',
  programme_start_date text not null default to_char(now(), 'YYYY-MM-DD'),
  has_seen_onboarding boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- 2. USER PROGRESS
-- ============================================
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  current_week int not null default 1,
  streak jsonb not null default '{"currentStreak":0,"longestStreak":0,"lastPracticeDate":null,"freezesAvailable":3,"freezesUsed":[]}',
  total_questions_answered int not null default 0,
  total_correct int not null default 0,
  average_technique_score real not null default 0,
  subject_scores jsonb not null default '{"english":{"questionsAttempted":0,"questionsCorrect":0,"averageTechniqueScore":0,"averageTimeMs":0},"maths":{"questionsAttempted":0,"questionsCorrect":0,"averageTechniqueScore":0,"averageTimeMs":0},"verbal-reasoning":{"questionsAttempted":0,"questionsCorrect":0,"averageTechniqueScore":0,"averageTimeMs":0},"non-verbal-reasoning":{"questionsAttempted":0,"questionsCorrect":0,"averageTechniqueScore":0,"averageTimeMs":0}}',
  level int not null default 1,
  xp int not null default 0,
  xp_to_next_level int not null default 100,
  updated_at timestamptz not null default now(),
  constraint unique_child_progress unique (child_id)
);

-- ============================================
-- 3. DAILY SESSIONS
-- ============================================
create table if not exists daily_sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  date text not null,
  average_technique_score real not null default 0,
  average_correctness real not null default 0,
  total_time_ms int not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- 4. QUESTION RESULTS
-- ============================================
create table if not exists question_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references daily_sessions(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  question_id text not null,
  subject text not null,
  correct boolean not null,
  technique_score jsonb not null default '{}',
  reading_time_ms int not null default 0,
  total_time_ms int not null default 0,
  highlighted_word_indices jsonb not null default '[]',
  eliminated_option_indices jsonb not null default '[]',
  selected_option_index int not null default -1,
  timestamp timestamptz not null default now()
);

-- ============================================
-- 5. EARNED BADGES
-- ============================================
create table if not exists earned_badges (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  seen boolean not null default false,
  constraint unique_child_badge unique (child_id, badge_id)
);

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table child_profiles enable row level security;
alter table user_progress enable row level security;
alter table daily_sessions enable row level security;
alter table question_results enable row level security;
alter table earned_badges enable row level security;

-- child_profiles: parents can only access their own children
create policy "Parents manage own children"
  on child_profiles for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

-- user_progress: access via child ownership
create policy "Parents manage child progress"
  on user_progress for all
  using (child_id in (select id from child_profiles where parent_id = auth.uid()))
  with check (child_id in (select id from child_profiles where parent_id = auth.uid()));

-- daily_sessions: access via child ownership
create policy "Parents manage child sessions"
  on daily_sessions for all
  using (child_id in (select id from child_profiles where parent_id = auth.uid()))
  with check (child_id in (select id from child_profiles where parent_id = auth.uid()));

-- question_results: access via child ownership
create policy "Parents manage child results"
  on question_results for all
  using (child_id in (select id from child_profiles where parent_id = auth.uid()))
  with check (child_id in (select id from child_profiles where parent_id = auth.uid()));

-- earned_badges: access via child ownership
create policy "Parents manage child badges"
  on earned_badges for all
  using (child_id in (select id from child_profiles where parent_id = auth.uid()))
  with check (child_id in (select id from child_profiles where parent_id = auth.uid()));

-- ============================================
-- 7. INDEXES
-- ============================================
create index if not exists idx_child_profiles_parent on child_profiles(parent_id);
create index if not exists idx_user_progress_child on user_progress(child_id);
create index if not exists idx_daily_sessions_child on daily_sessions(child_id);
create index if not exists idx_daily_sessions_date on daily_sessions(child_id, date);
create index if not exists idx_question_results_session on question_results(session_id);
create index if not exists idx_earned_badges_child on earned_badges(child_id);

-- ============================================
-- 8. FEATURE ADDITIONS (Sound, Exam Countdown, Mistakes, Daily Challenge, Mock Exams)
-- ============================================

-- Exam date on child profiles
alter table child_profiles add column if not exists exam_date text;

-- Mistake queue for spaced repetition
alter table user_progress add column if not exists mistake_queue jsonb default '[]';

-- Daily challenge tracking
alter table user_progress add column if not exists daily_challenge jsonb default '{"lastCompletedDate":null,"streak":0,"totalCompleted":0,"totalCorrect":0}';

-- Mock exam tracking
alter table user_progress add column if not exists mock_exams jsonb default '{"totalAttempted":0,"bestScore":0,"lastAttemptDate":null}';
