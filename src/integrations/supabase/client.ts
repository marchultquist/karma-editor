// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://erbyyinyumozxnwopwwt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYnl5aW55dW1venhud29wd3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MDM5MzIsImV4cCI6MjA2MTQ3OTkzMn0.T356ms2yB_b3gnBczH04CVehxxDhOs24TUUzVSBYtT4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);