// assets/js/cotizador.js

const supabase = window.supabaseClient;

const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const servicioSelect = document.getElementById("servicio");
const calidadSelect = document.getElementById("calidad");
const precioEl = document.getElementById("precio");
const whatsappBtn = document.getElementById("whatsapp-btn");

let precioActual = 0;

// 🔹 Cargar modelos según marca
marcaSelect.addEventListener("change", async () => {
  modeloSelect.innerHTML = `<option value="">Cargando...</option>`;

  const { data, error } = await supabase
    .from("repuestos")
    .select("modelo")
    .eq("marca", marcaSelect.value);

  if (error) {
    console.error(error);
    return;
  }

  const modelosUnicos = [...new Set(data.map(r => r.modelo))];

  modeloSelect.innerHTML = `<option value="">Selecciona modelo</option>`;
  modelosUnicos.forEach(modelo => {
    modeloSelect.innerHTML += `<option value="${modelo}">${modelo}</option>`;
  });
});

// 🔹 Calcular precio
async function calcularPrecio() {
  if (!marcaSelect.value || !modeloSelect.value || !servicioSelect.value || !calidadSelect.value) {
    precioEl.textContent = "$0 COP";
    return;
  }

  const { data, error } = await supabase
    .from("repuestos")
    .select("precio")
    .eq("marca", marcaSelect.value)
    .eq("modelo", modeloSelect.value)
    .eq("servicio", servicioSelect.value)
    .eq("calidad", calidadSelect.value)
    .limit(1)
    .single();

  if (error || !data) {
    precioEl.textContent = "No disponible";
    return;
  }

  precioActual = data.precio;
  precioEl.textContent = `$${precioActual.toLocaleString("es-CO")} COP`;

  generarWhatsApp();
}

servicioSelect.addEventListener("change", calcularPrecio);
calidadSelect.addEventListener("change", calcularPrecio);
modeloSelect.addEventListener("change", calcularPrecio);

// 🔹 WhatsApp
function generarWhatsApp() {
  if (!precioActual) return;

  const mensaje = `
Hola 👋, TECH-LAG

Quiero una cotización con estos datos:

📱 *Marca:* ${marcaSelect.value}
📦 *Modelo:* ${modeloSelect.value}
🛠️ *Servicio:* ${servicioSelect.options[servicioSelect.selectedIndex].text}
⭐ *Calidad:* ${calidadSelect.options[calidadSelect.selectedIndex].text}
💰 *Precio estimado:* $${precioActual.toLocaleString("es-CO")} COP

Quedo atento(a). Gracias 🙌
  `.trim();

  const numeroWhatsApp = "573224494595"; // 👈 CAMBIA ESTO

  whatsappBtn.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
}
