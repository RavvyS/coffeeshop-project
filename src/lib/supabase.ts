import { createClient } from '@supabase/supabase-js';

// Environment variables (these should be in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Supabase Client Configuration
 * Configured with auth settings and global options
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Set custom auth flow (optional)
    flowType: 'pkce', // More secure for web apps
  },
  global: {
    headers: {
      'X-Client-Info': 'brew-bean-coffee-v1.0.0',
    },
  },
  // Real-time configuration
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});