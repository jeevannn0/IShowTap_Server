import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL or Anon Key is missing from environment variables'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
