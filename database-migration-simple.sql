-- Simple Database Migration: Add avatar seeds support
-- Run this in your Supabase SQL Editor

-- Add new columns for avatar seeds (if they don't exist)
ALTER TABLE waitlist_entries 
ADD COLUMN IF NOT EXISTS avatar_seed TEXT,
ADD COLUMN IF NOT EXISTS avatar_style VARCHAR(50) DEFAULT 'adventurer';

-- Update the avatar_type constraint to include 'avatar_seed'
ALTER TABLE waitlist_entries 
DROP CONSTRAINT IF EXISTS waitlist_entries_avatar_type_check;

ALTER TABLE waitlist_entries
ADD CONSTRAINT waitlist_entries_avatar_type_check
CHECK (avatar_type IN ('upload', 'avatar_seed'));
