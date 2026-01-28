/* ============================= */
/* SUPABASE CLIENT */
/* ============================= */

const SUPABASE_URL = "https://nhiqjzjdztoyqsvnrkai.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oaXFqempkenRveXFzdm5ya2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MDEyMzcsImV4cCI6MjA4NDI3NzIzN30.SlFOQvYJAiOTZvX-Da8bUmASvZ8PSfUe30pQTip4bUc";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ============================= */
/* ELEMENTOS */
/* ============================= */

const marcaEl    = document.getElementById("marca");
const modeloEl   = document.getElementById("modelo");
const servicioEl = document.getElementById("servicio");
const calidadEl  = document.getElementById("calidad");
const precioEl   = document.getElementById("precio");

/* ============================= */
/* UTIL */
/* ============================= */

function reset(select, text) {
  select.innerHTML = `<option value="">${text}</option>`;
}

/* ============================= */
/* CARGAR MARCAS */
/* ============================= */

async function cargarMarcas() {
  const { data, error } = await client
    .from("Servicios")
    .select("marca")
    .eq("activo", true);

  if (error) {
    console.error(error);
    return;
  }

  const marcas = [...new Set(data.map(d => d.marca))];

  reset(marcaEl, "Selecciona marca");

  marcas.forEach(m => {
    marcaEl.innerHTML += `<option value="${m}">${m}</option>`;
  });
}

/* ============================= */
/* CARGAR MODELOS */
/* ============================= */

async function cargarModelos() {
  reset(modeloEl, "Selecciona modelo");

  const marca = marcaEl.value;
  if (!marca) return;

  const { data, error } = await client
    .from("Servicios")
    .select("modelo")
    .eq("marca", marca)
    .eq("activo", true);

  if (error) {
    console.error(error);
    return;
  }

  const modelos = [...new Set(data.map(d => d.modelo))];

  modelos.forEach(m => {
    modeloEl.innerHTML += `<option value="${m}">${m}</option>`;
  });
}

/* ============================= */
/* CALCULAR PRECIO */
/* ============================= */

async function calcularPrecio() {
  const marca    = marcaEl.value;
  const modelo   = modeloEl.value;
  const servicio = servicioEl.value;
  const calidad  = calidadEl.value;

  if (!marca || !modelo || !servicio || !calidad) {
    precioEl.textContent = "$0 COP";
    return;
  }

  const { data, error } = await client
    .from("Servicios")
    .select("precio")
    .eq("marca", marca)
    .eq("modelo", modelo)
    .eq("servicio", servicio)
    .eq("calidad", calidad)
    .eq("activo", true)
    .single();

  if (error || !data) {
    precioEl.textContent = "$0 COP";
    return;
  }

  precioEl.textContent =
    `$${data.precio.toLocaleString("es-CO")} COP`;
}

/* ============================= */
/* EVENTOS */
/* ============================= */

marcaEl.addEventListener("change", () => {
  reset(modeloEl, "Selecciona modelo");
  calcularPrecio();
  cargarModelos();
});

modeloEl.addEventListener("change", calcularPrecio);
servicioEl.addEventListener("change", calcularPrecio);
calidadEl.addEventListener("change", calcularPrecio);

/* ============================= */
/* INIT */
/* ============================= */

document.addEventListener("DOMContentLoaded", cargarMarcas);