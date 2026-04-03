-- Migration 004: Add lemonsqueezy_order_id column and unique constraint
-- Ensures duplicate webhook deliveries for the same order are safely ignored.
-- The column may already exist (added manually after migration) — IF NOT EXISTS guards both operations.

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS lemonsqueezy_order_id TEXT;

-- Unique constraint on non-null values only (partial index).
-- Multiple NULL values are allowed (pending/guest payments before order completion).
CREATE UNIQUE INDEX IF NOT EXISTS payments_lemonsqueezy_order_id_unique
  ON payments (lemonsqueezy_order_id)
  WHERE lemonsqueezy_order_id IS NOT NULL;
