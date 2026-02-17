const { createClient } = require('@supabase/supabase-js');

// Load environment variables (ensure .env has these)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY; // Service Role Key for backend access

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️  Supabase URL or Key missing in .env. Falling back to local db.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
