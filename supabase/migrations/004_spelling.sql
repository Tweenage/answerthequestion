-- ATQ Spelling: new tables on the shared ATQ Supabase project
-- Run via the Supabase SQL editor (not the CLI migration flow)

create table if not exists spelling_progress (
  id              uuid primary key default gen_random_uuid(),
  child_id        uuid not null references child_profiles(id) on delete cascade,
  word_id         text not null,
  interval        int not null default 0,
  repetitions     int not null default 0,
  ease_factor     real not null default 2.5,
  next_review_date text not null,
  mastery_score   smallint not null default 0 check (mastery_score between 0 and 5),
  times_attempted int not null default 0,
  times_correct   int not null default 0,
  last_seen_date  text,
  updated_at      timestamptz not null default now(),
  constraint uq_spelling_progress unique (child_id, word_id)
);

create index if not exists idx_spelling_progress_child
  on spelling_progress (child_id);
create index if not exists idx_spelling_progress_review_date
  on spelling_progress (child_id, next_review_date);

create table if not exists spelling_sessions (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references child_profiles(id) on delete cascade,
  date         text not null,
  words_studied jsonb not null default '[]',
  correct      int not null default 0,
  total        int not null default 0,
  completed    boolean not null default false,
  duration_ms  int not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_spelling_sessions_child_date
  on spelling_sessions (child_id, date);

alter table spelling_progress enable row level security;
alter table spelling_sessions enable row level security;

create policy "parent_owns_spelling_progress" on spelling_progress
  using (
    exists (
      select 1 from child_profiles cp
      where cp.id = spelling_progress.child_id
        and cp.parent_id = auth.uid()
    )
  );

create policy "parent_owns_spelling_sessions" on spelling_sessions
  using (
    exists (
      select 1 from child_profiles cp
      where cp.id = spelling_sessions.child_id
        and cp.parent_id = auth.uid()
    )
  );
