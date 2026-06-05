import { getSession } from "@/utils";
import { navigateTo } from "@/router/router";

const API_URL = "http://localhost:3001";

async function validarConflictoHorario(espacio, fecha, horaInicio, horaFin) {
    const response = await fetch(`${API_URL}/reservas`);
    if (!response.ok) throw new Error("Error al validar disponibilidad.");

    const reservas = await response.json();
    const startMin = convertirHoraAMinutos(horaInicio);
    const endMin = convertirHoraAMinutos(horaFin);

    const conflicto = reservas.some(res => {
        if (res.espacio !== espacio || res.fecha !== fecha) return false;
        if (res.estado === 'rejected') return false;

        const resStartMin = convertirHoraAMinutos(res.horaInicio);
        const resEndMin = convertirHoraAMinutos(res.horaFin);

        return !(endMin <= resStartMin || startMin >= resEndMin);
    });

    return conflicto;
}

function convertirHoraAMinutos(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

function obtenerEspaciosDisponibles() {
    return [
        "Sala A",
        "Sala B",
        "Sala C",
        "Oficina Ejecutiva",
        "Auditorium Principal",
        "Coworking Zone 1",
        "Coworking Zone 2",
        "Sala de Capacitación"
    ];
}

export async function renderNuevoFormView() {
    const session = getSession();
    if (!session) {
        navigateTo("/");
        return;
    }

    const espacios = obtenerEspaciosDisponibles();
    const hoy = new Date().toISOString().split('T')[0];
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="flex min-h-screen bg-gray-50">
            <aside class="w-64 bg-gray-900 text-white p-6 fixed h-screen overflow-y-auto hidden md:block">
                <div class="mb-8">
                    <h2 class="text-xl font-bold">Reservas</h2>
                    <p class="text-xs text-gray-400 mt-1">Sistema de espacios</p>
                </div>
                <nav class="space-y-2 mb-8">
                    <a href="/home" data-link class="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors">📊 Inicio</a>
                    <a href="/reservas" data-link class="block px-4 py-2 rounded-lg text-sm text-white bg-gray-800 font-semibold">📅 Reservas</a>
                </nav>
                <button id="logout-btn" class="w-full px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-red-900 transition-colors text-left font-semibold">🚪 Cerrar sesión</button>
            </aside>

            <main class="flex-1 md:ml-64 p-6 md:p-8">
                <div class="max-w-2xl">
                    <div class="mb-8">
                        <a href="/reservas" data-link class="inline-block mb-4 text-sm font-semibold text-gray-600 hover:text-gray-900">← Volver</a>
                        <h1 class="text-3xl font-bold text-gray-900 mb-1">Nueva Reserva</h1>
                        <p class="text-sm text-gray-600">Completa el formulario para reservar un espacio</p>
                    </div>

                    <form id="nuevoReservaForm" class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
                        <div>
                            <label class="label-base">Espacio de Trabajo</label>
                            <select id="espacio" name="espacio" required class="input-base">
                                <option value="">-- Selecciona un espacio --</option>
                                ${espacios.map(esp => `<option value="${esp}">${esp}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="label-base">Fecha de Reserva</label>
                            <input type="date" id="fecha" name="fecha" min="${hoy}" required class="input-base">
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="label-base">Hora Inicio</label>
                                <input type="time" id="horaInicio" name="horaInicio" required class="input-base">
                            </div>
                            <div>
                                <label class="label-base">Hora Fin</label>
                                <input type="time" id="horaFin" name="horaFin" required class="input-base">
                            </div>
                        </div>

                        <div>
                            <label class="label-base">Motivo</label>
                            <textarea id="motivo" name="motivo" rows="3" placeholder="Describe el propósito..." required class="input-base"></textarea>
                        </div>

                        <div id="alertaError" class="hidden bg-red-50 border border-red-200 rounded-lg p-4">
                            <p class="text-sm text-red-700 font-semibold" id="mensajeError"></p>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" class="btn-primary flex-1">✓ Crear Reserva</button>
                            <a href="/reservas" data-link class="btn-secondary flex-1 text-center">Cancelar</a>
                        </div>
                    </form>

                    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-xs text-blue-900"><strong>💡 Nota:</strong> Tu reserva quedará en estado pendiente hasta ser aprobada por un administrador.</p>
                    </div>
                </div>
            </main>
        </div>
    `;

    setupFormListeners();
}

function setupFormListeners() {
    const form = document.getElementById("nuevoReservaForm");
    const alertaError = document.getElementById("alertaError");
    const mensajeError = document.getElementById("mensajeError");
    const session = getSession();
    const submitBtn = form.querySelector('button[type="submit"]');

    document.getElementById("logout-btn").addEventListener("click", () => {
        if (confirm("¿Deseas cerrar sesión?")) {
            localStorage.removeItem("user");
            navigateTo("/");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const espacio = document.getElementById("espacio").value;
        const fecha = document.getElementById("fecha").value;
        const horaInicio = document.getElementById("horaInicio").value;
        const horaFin = document.getElementById("horaFin").value;
        const motivo = document.getElementById("motivo").value;

        alertaError.classList.add("hidden");
        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ Creando...";

        try {
            if (horaInicio >= horaFin) {
                throw new Error("❌ La hora de fin debe ser posterior a la hora de inicio.");
            }

            const hayConflicto = await validarConflictoHorario(espacio, fecha, horaInicio, horaFin);

            if (hayConflicto) {
                throw new Error(`❌ Ya existe una reserva en "${espacio}" en ese horario.`);
            }

            const response = await fetch(`${API_URL}/reservas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.id,
                    espacio,
                    fecha,
                    horaInicio,
                    horaFin,
                    motivo,
                    estado: "pending"
                })
            });

            if (!response.ok) throw new Error("Error al crear la reserva.");

            alert("✅ Reserva creada. Espera aprobación.");
            navigateTo("/reservas");

        } catch (error) {
            mensajeError.textContent = error.message;
            alertaError.classList.remove("hidden");
            submitBtn.disabled = false;
            submitBtn.textContent = "✓ Crear Reserva";
        }
    });
}
