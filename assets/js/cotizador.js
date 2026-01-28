/* ============================= */
/* ELEMENTOS */
/* ============================= */

const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
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

const formatCOP = (valor) =>
  `$${valor.toLocaleString("es-CO")} COP`;

const resetPrecio = () => {
  precioActual = 0;
  precioEl.textContent = "$0 COP";
};

/* ============================= */
/* MARCA → MODELOS */
/* ============================= */

marcaSelect.addEventListener("change", async () => {
  resetPrecio();
  modeloSelect.innerHTML = `<option value="">Selecciona modelo</option>`;
  modeloId = null;

  const marcaNombre = marcaSelect.value;
  if (!marcaNombre) return;

  const { data: marca, error } = await supabaseClient
    .from("marcas")
    .select("id")
    .eq("nombre", marcaNombre)
    .single();

  if (error || !marca) {
    console.error("Marca no encontrada", error);
    return;
  }

  marcaId = marca.id;

  const { data: modelos, error: errModelos } = await supabaseClient
    .from("modelos")
    .select("id, nombre")
    .eq("marca_id", marcaId)
    .order("nombre");

  if (errModelos) {
    console.error("Error cargando modelos", errModelos);
    return;
  }

  modelos.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.nombre;
    modeloSelect.appendChild(opt);
  });
});

/* ============================= */
/* MODELO */
/* ============================= */

modeloSelect.addEventListener("change", () => {
  resetPrecio();
  modeloId = modeloSelect.value || null;
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
  const marca = marcaSelect.value;
  const modelo = modeloSelect.options[modeloSelect.selectedIndex].text;
  const servicio = servicioSelect.options[servicioSelect.selectedIndex].text;
  const calidad = calidadSelect.options[calidadSelect.selectedIndex].text;

  const mensaje = `
Hola TECH-LAG 👋
Quiero cotizar:

📱 Equipo: ${marca} ${modelo}
🛠 Servicio: ${servicio}
⭐ Calidad: ${calidad}
💰 Precio estimado: ${formatCOP(precioActual)}
  `.trim();

  const phone = "573224494595"; // <-- TU NÚMERO
  whatsappBtn.href =
    "https://wa.me/" +
    phone +
    "?text=" +
    encodeURIComponent(mensaje);
}