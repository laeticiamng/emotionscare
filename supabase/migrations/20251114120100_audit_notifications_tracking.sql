-- Migration: Add email tracking to audit notifications
-- Created: 2025-11-14
-- Description: Add message_id and error_message columns for better email tracking

-- Add message_id column for tracking sent emails
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audit_notifications'
    AND column_name = 'message_id'
  ) THEN
    ALTER TABLE audit_notifications ADD COLUMN message_id TEXT;
  END IF;
END $$;

-- Add error_message column for tracking failed emails
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audit_notifications'
    AND column_name = 'error_message'
  ) THEN
    ALTER TABLE audit_notifications ADD COLUMN error_message TEXT;
  END IF;
END $$;

-- Add comments to document the columns
COMMENT ON COLUMN audit_notifications.message_id IS 'Email provider message ID for tracking (from Resend, SendGrid, etc.)';
COMMENT ON COLUMN audit_notifications.error_message IS 'Error message if email sending failed';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_notifications_status ON audit_notifications(status);
CREATE INDEX IF NOT EXISTS idx_audit_notifications_alert_id ON audit_notifications(alert_id);
