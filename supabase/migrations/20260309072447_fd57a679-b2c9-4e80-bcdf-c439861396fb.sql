-- Add missing role values to app_role enum for B2B support
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'b2b_user';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'b2b_admin';