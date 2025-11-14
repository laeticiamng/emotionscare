-- Migration: Add error tracking to invitations
-- Created: 2025-11-14
-- Description: Add error_message column for tracking failed invitation emails

-- Add error_message column to invitations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invitations'
    AND column_name = 'error_message'
  ) THEN
    ALTER TABLE invitations ADD COLUMN error_message TEXT;
  END IF;
END $$;

-- Add comment to document the column
COMMENT ON COLUMN invitations.error_message IS 'Error message if invitation email sending failed';

-- Update status enum if 'failed' status doesn't exist
-- Note: This assumes the status column uses a CHECK constraint or text type
-- If it's an enum type, you may need to alter the type definition
