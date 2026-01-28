/* ============================= */
/* ELEMENTOS */
/* ============================= */

const marcaInput = document.getElementById("marca");
const modeloInput = document.getElementById("modelo");
const servicioSelect = document.getElementById("servicio");
const calidadSelect = document.getElementById("calidad");
const precioEl = document.getElementById("precio");
const whatsappBtn = document.getElementById("whatsapp-btn");

/* ============================= */
/* ESTADO */
/* ============================= */

let marcaId = null;
let modeloId = null;
let precioActual = 0;

/* ============================= */
/* HELPERS */
/* ============================= */

const formatCOP = (v) => `$${v.toLocaleString("es-CO")} COP`;

const resetPrecio = () => {
  precioActual = 0;
  precioEl.textContent = "$0 COP";
};

/* ============================= */
/* BUSCAR MARCA */
/* ============================= */

marcaInput.addEventListener("blur", async () => {
  resetPrecio();
  modeloInput.value = "";
  modeloId = null;

  const nombre = marcaInput.value.trim();
  if (!nombre) return;

  const { data, error } = await supabaseClient
    .from("marcas")
    .select("id, nombre")
    .ilike("nombre", nombre)
    .single();

  if (error || !data) {
    marcaId = null;
    console.warn("Marca no encontrada");
    return;
  }

  marcaId = data.id;
  marcaInput.value = data.nombre;
});

/* ============================= */
/* BUSCAR MODELO */
/* ============================= */

modeloInput.addEventListener("blur", async () => {
  resetPrecio();
  modeloId = null;

  if (!marcaId) return;

  const nombre = modeloInput.value.trim();
  if (!nombre) return;

  const { data, error } = await supabaseClient
    .from("modelos")
    .select("id, nombre")
    .eq("marca_id", marcaId)
    .ilike("nombre", nombre)
    .single();

  if (error || !data) {
    console.warn("Modelo no encontrado");
    return;
  }

  modeloId = data.id;
  modeloInput.value = data.nombre;
});

/* ============================= */
/* CALCULAR PRECIO */
/* ============================= */

async function calcularPrecio() {
  resetPrecio();

  if (!modeloId) return;
  if (!servicioSelect.value) return;
  if (!calidadSelect.value) return;

  const { data, error } = await supabaseClient
    .from("servicios")
    .select("precio")
    .eq("modelo_id", modeloId)
    .eq("tipo", servicioSelect.value)
    .eq("calidad", calidadSelect.value)
    .eq("activo", true)
    .single();

  if (error || !data) {
    precioEl.textContent = "No disponible";
    return;
  }

  precioActual = data.precio;
  precioEl.textContent = formatCOP(precioActual);
  actualizarWhatsApp();
}

/* ============================= */
/* EVENTOS */
/* ============================= */

servicioSelect.addEventListener("change", calcularPrecio);
calidadSelect.addEventListener("change", calcularPrecio);

/* ============================= */
/* WHATSAPP */
/* ============================= */

function actualizarWhatsApp() {
  const mensaje = `
Hola TECH-LAG 👋
Quiero cotizar:

📱 Equipo: ${marcaInput.value} ${modeloInput.value}
🛠 Servicio: ${servicioSelect.options[servicioSelect.selectedIndex].text}
⭐ Calidad: ${calidadSelect.options[calidadSelect.selectedIndex].text}
💰 Precio estimado: ${formatCOP(precioActual)}
`.trim();

  whatsappBtn.href =
    "https://wa.me/573224494595?text=" +
    encodeURIComponent(mensaje);
}