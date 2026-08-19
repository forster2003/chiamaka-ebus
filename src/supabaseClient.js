import { createClient } from "@supabase/supabase-js";

// ==========================================
// PASTE YOUR SUPABASE CREDENTIALS HERE 👇
// ==========================================

// 1. Paste your Supabase Project URL here:
const SUPABASE_URL = "https://ckrvirolddmjwhuxgtge.supabase.co/rest/v1/";

// 2. Paste your Supabase Anon Public API Key (anon key) here:
const SUPABASE_PUBLIC_KEY = "sb_publishable_HDZVey1EWgXIOVR2pKbxxQ_v5wm8HvC";

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
