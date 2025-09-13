import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if environment variables are properly set
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type WaitlistEntry = {
  id: string;
  profile_id: number;
  name: string;
  wallet_address: string;
  avatar: string;
  avatar_type: "upload" | "avatar_seed";
  avatar_seed?: string; // Seed for generating anime avatars
  avatar_style?: string; // DiceBear style (adventurer, lorelei, etc.)
  created_at: string;
  updated_at: string;
};
