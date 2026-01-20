// CONFIGURACIÓN SUPABASE
const SUPABASE_URL = "https://nhiqjzjdztoyqsvnrkai.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__pjEInzOogtdZ-m2INqFug_ZMulzlsm";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
