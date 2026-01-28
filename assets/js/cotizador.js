/* ============================= */
/* ELEMENTOS */
/* ============================= */

const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const servicioSelect = document.getElementById("servicio");
const calidadSelect = document.getElementById("calidad");
const precioEl = document.getElementById("precio");

/* ============================= */
/* MAPEO DE SERVICIOS (HTML -> BD) */
/* ============================= */

const SERVICIO_MAP = {
  pantalla: "cambio_pantalla",
  bateria: "bateria",
  puerto: "puerto",
  software: "software",
  diagnostico: "diagnostico"
};

/* ============================= */
/* CARGAR MODELOS */
/* ============================= */

marcaSelect.addEventListener("change", async () => {
  modeloSelect.innerHTML = `<option value="">Selecciona modelo</option>`;
  resetPrecio();

  if (!marcaSelect.value) return;

  const { data, error } = await supabase
    .from("modelos")
    .select("id, nombre, marcas!inner(nombre)")
    .eq("marcas.nombre", marcaSelect.value);

  if (error) {
    console.error(error);
    return;
  }

  data.forEach((modelo) => {
    const option = document.createElement("option");
    option.value = modelo.id;
    option.textContent = modelo.nombre;
    modeloSelect.appendChild(option);
  });
});

/* ============================= */
/* EVENTOS DE CÁLCULO */
/* ============================= */

[modeloSelect, servicioSelect, calidadSelect].forEach((el) => {
  el.addEventListener("change", calcularPrecio);
});

/* ============================= */
/* CALCULAR PRECIO */
/* ============================= */

async function calcularPrecio() {
  resetPrecio();

  if (
    !modeloSelect.value ||
    !servicioSelect.value ||
    !calidadSelect.value
  ) {
    return;
  }

  const servicioBD = SERVICIO_MAP[servicioSelect.value];

  if (!servicioBD) {
    console.error("Servicio no mapeado");
    return;
  }

  const { data, error } = await supabase
    .from("servicios")
    .select("precio")
    .eq("modelo_id", modeloSelect.value)
    .eq("tipo", servicioBD)
    .eq("calidad", calidadSelect.value)
    .eq("activo", true)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    precioEl.textContent = "No disponible";
    return;
  }

  precioEl.dataset.valor = data.precio;
  precioEl.textContent = `$${data.precio.toLocaleString("es-CO")} COP`;
}

/* ============================= */
/* UTILIDADES */
/* ============================= */

function resetPrecio() {
  precioEl.dataset.valor = 0;
  precioEl.textContent = "$0 COP";
}