# Database Setup Guide for Waitlist System

## 🎯 Recommended: Supabase PostgreSQL

### Step 1: Setup Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Add to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Install Dependencies

```bash
pnpm add @supabase/supabase-js
```

### Step 3: Database Schema

Create this table in Supabase SQL Editor:

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

### Step 4: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WaitlistEntry = {
  id: string;
  profile_id: number;
  name: string;
  wallet_address: string;
  avatar: string;
  avatar_type: "emoji" | "upload";
  created_at: string;
  updated_at: string;
};
```

### Step 5: Update Waitlist Service

Replace `lib/waitlist-service.ts` with database version:

```typescript
import { supabase, WaitlistEntry } from "./supabase";

class WaitlistService {
  async addEntry(entry: {
    profile_id: number;
    name: string;
    wallet_address: string;
    avatar: string;
    avatar_type: "emoji" | "upload";
  }): Promise<WaitlistEntry> {
    // Check if wallet already exists
    const { data: existing } = await supabase
      .from("waitlist_entries")
      .select("*")
      .eq("wallet_address", entry.wallet_address)
      .single();

    if (existing) {
      // If same profile, return existing
      if (existing.profile_id === entry.profile_id) {
        return existing;
      }
      // If different profile, update to new position
      const { data, error } = await supabase
        .from("waitlist_entries")
        .update({
          profile_id: entry.profile_id,
          name: entry.name,
          avatar: entry.avatar,
          avatar_type: entry.avatar_type,
        })
        .eq("wallet_address", entry.wallet_address)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Check if profile position is taken
    const { data: profileTaken } = await supabase
      .from("waitlist_entries")
      .select("*")
      .eq("profile_id", entry.profile_id)
      .single();

    if (profileTaken) {
      throw new Error("This position is already taken");
    }

    // Create new entry
    const { data, error } = await supabase
      .from("waitlist_entries")
      .insert(entry)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getEntry(walletAddress: string): Promise<WaitlistEntry | null> {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async getEntryByProfileId(profileId: number): Promise<WaitlistEntry | null> {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async getAllEntries(): Promise<WaitlistEntry[]> {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async removeEntry(walletAddress: string): Promise<boolean> {
    const { error } = await supabase
      .from("waitlist_entries")
      .delete()
      .eq("wallet_address", walletAddress);

    return !error;
  }

  async getWaitlistSize(): Promise<number> {
    const { count, error } = await supabase
      .from("waitlist_entries")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  }

  async clearAllEntries(): Promise<void> {
    const { error } = await supabase
      .from("waitlist_entries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (error) throw error;
  }
}

const waitlistService = new WaitlistService();
export default waitlistService;
```

## 🥈 **Alternative Options**

### 2. PlanetScale (MySQL)

- Serverless MySQL
- Great performance
- Branching for schema changes

### 3. MongoDB Atlas

- NoSQL flexibility
- Good for rapid prototyping
- Built-in aggregation

### 4. Vercel Postgres

- Perfect integration with Vercel deployment
- PostgreSQL with connection pooling

## 🔥 **Supabase Benefits for Your Use Case**

1. **Real-time Updates**: Globe can update live when someone joins
2. **Built-in Auth Integration**: Works with your existing NextAuth
3. **Storage for Avatars**: Can store uploaded images
4. **Edge Functions**: For complex waitlist logic
5. **Dashboard**: Easy data management
6. **Automatic APIs**: REST and GraphQL endpoints
7. **Type Safety**: Auto-generated TypeScript types

## 📊 **Migration Plan**

1. **Phase 1**: Set up Supabase and test with dummy data
2. **Phase 2**: Update waitlist service to use Supabase
3. **Phase 3**: Migrate existing localStorage data
4. **Phase 4**: Add real-time features
5. **Phase 5**: Add avatar storage for uploads

Would you like me to help implement the Supabase integration?
