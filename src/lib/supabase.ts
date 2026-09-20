import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sybyqbugpjuoakzvyljd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kyHHUwcLMh01Qg_Zpjt7pg_f0_lweNp';

// We only initialize the client if the keys are provided, otherwise we leave it null.
// This prevents the app from crashing entirely if the user hasn't set up Supabase yet.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
