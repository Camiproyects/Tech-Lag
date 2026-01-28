/* ============================= */
/* SUPABASE CONFIG */
/* ============================= */

const SUPABASE_URL = "https://nhiqjzjdztoyqsvnrkai.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable__pjEInzOogtdZ-m2INqFug_ZMulzlsm";

/* Validación básica */
if (typeof supabase === "undefined") {
  throw new Error("Supabase SDK no cargado");
}

/* Cliente Supabase */
const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);