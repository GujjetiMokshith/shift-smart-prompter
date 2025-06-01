import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vjptxzjqkepcgjoqshdc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcHR4empxa2VwY2dqb3FzaGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODg0NzQsImV4cCI6MjA2Mzc2NDQ3NH0.l38_fJCST7qHQkMVQ_AzX5rxxUl04Qq2dB7v5o7eCuc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);