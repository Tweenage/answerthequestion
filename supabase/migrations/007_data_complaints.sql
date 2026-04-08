-- Data protection complaints table (DUAA 2025 requirement)
-- Must have an electronic form for data protection complaints by 19 June 2026

CREATE TABLE IF NOT EXISTS data_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

ALTER TABLE data_complaints ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a complaint (anonymous insert)
CREATE POLICY "Anyone can submit a data complaint"
  ON data_complaints FOR INSERT
  WITH CHECK (true);

-- Only service role can read/update complaints (admin dashboard)
-- No SELECT policy for anon = complaints are private

CREATE INDEX idx_data_complaints_status ON data_complaints(status);
CREATE INDEX idx_data_complaints_created ON data_complaints(created_at DESC);
