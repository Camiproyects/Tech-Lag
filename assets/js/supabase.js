/* ============================= */
/* SUPABASE CONFIG */
/* ============================= */

const SUPABASE_URL = "https://nhiqjzjdztoyqsvnrkai.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oaXFqempkenRveXFzdm5ya2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MDEyMzcsImV4cCI6MjA4NDI3NzIzN30.SlFOQvYJAiOTZvX-Da8bUmASvZ8PSfUe30pQTip4bUc";

/* Validación del SDK */
if (typeof window.supabase === "undefined") {
  throw new Error("Supabase SDK no cargado");
}

/* Cliente Supabase */
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);