# 🚀 Supabase Implementation Guide

## 🏗️ Step 1: Create Supabase Project (2 minutes)

### 1.1 Sign Up & Create Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub** (recommended)
4. **Click "New Project"**
5. **Fill in project details:**
   - **Organization**: Choose your organization
   - **Name**: `axios-waitlist`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
6. **Click "Create new project"** (takes ~2 minutes)

### 1.2 Get Your Credentials

1. **In your Supabase dashboard**, click **"Settings"** → **"API"**
2. **Copy these values:**
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbG...` (long string)
   - **service_role key**: `eyJhbG...` (different long string)

## 🔧 Step 2: Configure Environment Variables

### 2.1 Create .env.local File

```bash
# In your project root
cp env.template .env.local
```

### 2.2 Update .env.local

Open `.env.local` and add your Supabase credentials:

```env
# NextAuth Configuration (existing)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# Twitter OAuth 2.0 Configuration (existing)
TWITTER_CLIENT_ID=your_twitter_oauth2_client_id
TWITTER_CLIENT_SECRET=your_twitter_oauth2_client_secret

# Supabase Configuration (NEW - Add these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Environment
NODE_ENV=development
```

**⚠️ Replace the placeholder values with your actual Supabase credentials!**

## 🗄️ Step 3: Create Database Table

### 3.1 Open SQL Editor

1. **In Supabase dashboard**, go to **"SQL Editor"**
2. **Click "New Query"**

### 3.2 Run This SQL

Copy and paste this SQL, then click **"Run"**:

```sql
-- Create waitlist_entries table
CREATE TABLE waitlist_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(42) NOT NULL UNIQUE,
  avatar TEXT NOT NULL,
  avatar_type VARCHAR(10) CHECK (avatar_type IN ('emoji', 'upload')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_waitlist_profile_id ON waitlist_entries(profile_id);
CREATE INDEX idx_waitlist_wallet ON waitlist_entries(wallet_address);
CREATE INDEX idx_waitlist_created ON waitlist_entries(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow public read access" ON waitlist_entries
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON waitlist_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON waitlist_entries
  FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_entries_updated_at
    BEFORE UPDATE ON waitlist_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 🧪 Step 4: Test the Setup

### 4.1 Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart
pnpm run dev
```

### 4.2 Check Console

You should now see:

```
🗄️ Waitlist Storage: DATABASE (Supabase)
```

### 4.3 Test Waitlist

1. **Go to** `http://localhost:3000/waitlist`
2. **Click "Check Storage" button**
3. **Console should show**: `DATABASE (Supabase)`
4. **Join the waitlist** - pick a circle and fill the form
5. **Console should show**: `🗄️ Using database for new entry: [Your Name]`

### 4.4 Verify in Supabase

1. **Go to Supabase dashboard**
2. **Click "Table Editor"** → **"waitlist_entries"**
3. **You should see your entry!** 🎉

## 🔍 Troubleshooting

### Problem: Still shows "LOCALSTORAGE"

- **Check**: Environment variables are set correctly
- **Restart**: Development server
- **Verify**: No typos in .env.local

### Problem: Database connection errors

- **Check**: Internet connection
- **Verify**: Supabase project is running
- **Note**: System will automatically fallback to localStorage

### Problem: Environment variables not loading

- **File location**: `.env.local` must be in project root
- **Restart**: Development server after changes
- **Check**: No extra spaces in variable names

## 🎉 Success Indicators

✅ **Console shows**: `🗄️ Waitlist Storage: DATABASE (Supabase)`  
✅ **New entries show**: `🗄️ Using database for new entry: [Name]`  
✅ **Supabase Table Editor**: Shows your waitlist entries  
✅ **Fallback works**: If database fails, uses localStorage

Your waitlist is now powered by a real database! 🚀
