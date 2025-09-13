# 🎭 Random Avatar Generator Setup Guide

Simple and clean random avatar generator for your 3D globe waitlist system.

## 🚀 Quick Overview

This system provides users with randomly generated avatars using the DiceBear API. Users can:

- Choose from 4 different avatar styles (Adventurer, Personas, Fantasy, Minimal)
- Generate 6 random avatar options with a refresh button
- Have consistent avatars based on unique seeds
- Enjoy privacy-friendly profile creation without needing photos

## 📋 Prerequisites

- Supabase project set up and running
- Next.js application with the existing waitlist system

## 🗄️ Step 1: Update Database Schema

Run this SQL command in your Supabase SQL Editor:

```sql
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
```

## 🎨 Step 2: Available Avatar Styles

The system supports 4 clean avatar styles:

- **Adventurer**: Character-based avatars
- **Personas**: People-style avatars
- **Fantasy**: Fantasy-themed avatars
- **Minimal**: Clean, simple avatars

## 🧪 Step 3: Testing

1. **Start your development server**: `pnpm run dev`
2. **Navigate to your globe**: Go to your main page
3. **Click on an empty circle**: Opens the waitlist popup
4. **Test the Random Avatars tab**:
   - Verify 6 avatar options are generated
   - Test the refresh button
   - Try different styles
   - Select an avatar and submit

## ✅ Success!

Your clean avatar generator is now ready! Users can generate unique avatars without uploading photos or dealing with complex theming.

Happy coding! 🚀
