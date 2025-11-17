-- Migration to align user_goals table with useGoals hook interface
-- This adds missing columns and updates the schema to match the hook expectations

-- Add new columns
ALTER TABLE user_goals
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
ADD COLUMN IF NOT EXISTS current_value INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS deadline DATE;

-- Update status constraint to include 'archived'
ALTER TABLE user_goals DROP CONSTRAINT IF EXISTS user_goals_status_check;
ALTER TABLE user_goals ADD CONSTRAINT user_goals_status_check
  CHECK (status IN ('active', 'completed', 'archived', 'paused', 'abandoned'));

-- Migrate existing data
-- Copy current_progress to both progress and current_value
UPDATE user_goals
SET
  current_value = COALESCE(current_progress, 0),
  progress = CASE
    WHEN target_value > 0 THEN LEAST(100, (COALESCE(current_progress, 0)::FLOAT / target_value::FLOAT * 100)::INTEGER)
    ELSE 0
  END,
  deadline = COALESCE(end_date, start_date + INTERVAL '30 days')
WHERE progress IS NULL OR current_value IS NULL OR deadline IS NULL;

-- Make deadline NOT NULL after migration
ALTER TABLE user_goals ALTER COLUMN deadline SET NOT NULL;

-- Create comment for documentation
COMMENT ON TABLE user_goals IS 'User goals and objectives tracking table - aligned with useGoals hook';
COMMENT ON COLUMN user_goals.progress IS 'Progress percentage (0-100) - calculated or manually set';
COMMENT ON COLUMN user_goals.current_value IS 'Current value achieved towards the goal';
COMMENT ON COLUMN user_goals.target_value IS 'Target value to achieve';
COMMENT ON COLUMN user_goals.deadline IS 'Goal deadline date';
COMMENT ON COLUMN user_goals.status IS 'Goal status: active, completed, archived, paused, or abandoned';
COMMENT ON COLUMN user_goals.category IS 'Goal category: wellness, mindfulness, energy, emotions, etc.';

-- Update index to include deadline for sorting
CREATE INDEX IF NOT EXISTS idx_user_goals_deadline
ON user_goals(user_id, deadline DESC)
WHERE status = 'active';
