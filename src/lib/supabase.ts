import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are properly configured (non-placeholder)
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('YOUR_SUPABASE_') && 
  !supabaseAnonKey.includes('YOUR_SUPABASE_');

// Initialize client with configured credentials or fallback placeholders
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project-url-pravix.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);
