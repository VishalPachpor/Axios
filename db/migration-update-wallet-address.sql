-- Migration script to update wallet_address column to support Fuel addresses
-- Run this in Supabase SQL Editor to update existing database

-- Update the wallet_address column to support longer addresses (Fuel = 63 chars, Ethereum = 42 chars)
-- Using varchar(70) to provide some buffer for future address formats
ALTER TABLE waitlist_entries 
ALTER COLUMN wallet_address TYPE varchar(70);

-- Verify the change
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'waitlist_entries' 
AND column_name = 'wallet_address';
