import { apiRequest, getSession } from "@/security/auth";
import { bindShellEvents, layout, ui } from "@/modules/home.module";

export const formControlClass =
  "w-full rounded-lg border border-[#FCC252] bg-[#FDFCFA] px-3 py-2.5 text-sm text-[#7E1616] outline-none transition focus:border-[#FCC252 focus:ring-4 focus:ring-[#FCC252] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
export const labelClass = "mb-1.5 block text-sm font-bold text-[#fff3dc] dark:text-[#fff3dc]";
const dangerButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg border-red-700 px-4 py-2 text-sm font-extrabold text-white transition hover: bg-red-500 disabled:cursor-not-allowed disabled:opacity-60";
const successButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";
const warningButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60";
const statusPillClass = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black uppercase";

export const espacios = [
  { nombre: "Backrooms", tipo: "sala 4DX" },
  { nombre: "El Afinador", tipo: "sala 3" },
  { nombre: "Scary movie", tipo: "sala 4DX" },
  { nombre: "Amos del universo", tipo: "Sala 5" },
  { nombre: "Toy story 5", tipo: "sala 6" },
  { nombre: "Michael", tipo: "sala 7" },
  { nombre: "El diablo viste a la moda", tipo: "sala 8" },
  { nombre: "Super mario galaxy movi", tipo: "sala 9" },
];

const estadoTexto = {
  pending: "en funcion",
  approved: "libre",
  rejected: "terminada",
  cancelled: "Cancelada",
};

const estadoClase = {
  pending: "bg-amber-100 text-amber-800 dark: dark:text-[#7E1616]",
  approved: "bg-emerald-100 text-emerald-800 dark:dark:text-emerald-600",
  rejected: "bg-rose-100 text-rose-800 dark: dark:text-rose-600",
  cancelled: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

let state = {
  reservas: [],
  filtroTexto: "",
  filtroEstado: "all",
  editingId: null,
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function hasOverlap(aStart, aEnd, bStart, bEnd) {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(aEnd) > toMinutes(bStart);
}

async function fetchReservasByRole() {
  const session = getSession();
  const endpoint = session.role === "admin" ? "/reservas" : `/reservas?userId=${session.id}`;
  const reservas = await apiRequest(endpoint);
  return reservas.sort((a, b) => `${b.fecha} ${b.horaInicio}`.localeCompare(`${a.fecha} ${a.horaInicio}`));
}

async function validateScheduleConflict(payload, ignoreId = null) {
  const reservas = await apiRequest(
    `/reservas?espacio=${encodeURIComponent(payload.espacio)}&fecha=${encodeURIComponent(payload.fecha)}`,
  );

  return reservas.some((reserva) => {
    if (String(reserva.id) === String(ignoreId)) return false;
    if (["rejected", "cancelled"].includes(reserva.estado)) return false;
    return hasOverlap(payload.horaInicio, payload.horaFin, reserva.horaInicio, reserva.horaFin);
  });
}

function filteredReservas() {
  const text = state.filtroTexto.trim().toLowerCase();

  return state.reservas.filter((reserva) => {
    const matchesText =
      !text ||
      [reserva.espacio, reserva.tipoEspacio, reserva.motivo, reserva.userName, reserva.fecha]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(text));

    const matchesStatus = state.filtroEstado === "all" || reserva.estado === state.filtroEstado;
    return matchesText && matchesStatus;
  });
}

function canUserEdit(reserva, session) {
  return session.role === "admin" || (reserva.userId === session.id && reserva.estado === "pending");
}

function canUserCancel(reserva, session) {
  return session.role === "admin" || (reserva.userId === session.id && ["pending", "approved"].includes(reserva.estado));
}

function renderForm() {
  const session = getSession();
  const editing = state.reservas.find((reserva) => String(reserva.id) === String(state.editingId));
  const today = new Date().toISOString().slice(0, 10);

  return `
    <section class="${ui.surface} p-5">
      <div class="mb-5">
        <p class="text-sm font-bold text-[#7E1616] dark:text-[#FCC252]">${editing ? "Edicion" : "Nueva reserva"}</p>
        <h3 class="mt-1 text-xl font-black text-slate-950 dark:text-white">${editing ? "Actualizar reserva" : "Reservar un espacio"}</h3>
      </div>
      <form id="reservaForm" class="grid gap-4">
        <input type="hidden" id="reservaId" value="${editing?.id ?? ""}">
        <div>
          <label class="${labelClass}" for="espacio">Espacio</label>
          <select id="espacio" class="${formControlClass}" required>
            <option value="">Selecciona un espacio</option>
            ${espacios
              .map(
                (espacio) => `
                  <option value="${espacio.nombre}" data-tipo="${espacio.tipo}" ${editing?.espacio === espacio.nombre ? "selected" : ""}>
                    ${espacio.nombre} - ${espacio.tipo}
                  </option>
                `,
              )
              .join("")}
          </select>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="${labelClass}" for="fecha">Fecha</label>
            <input id="fecha" class="${formControlClass}" type="date" min="${today}" value="${editing?.fecha ?? ""}" required>
          </div>
          <div>
            <label class="${labelClass}" for="horaInicio">Inicio</label>
            <input id="horaInicio" class="${formControlClass}" type="time" value="${editing?.horaInicio ?? ""}" required>
          </div>
          <div>
            <label class="${labelClass}" for="horaFin">Fin</label>
            <input id="horaFin" class="${formControlClass}" type="time" value="${editing?.horaFin ?? ""}" required>
          </div>
        </div>
        <div>
          <label class="${labelClass}" for="motivo">Motivo</label>
          <textarea id="motivo" class="${formControlClass} min-h-24 resize-y" required placeholder="Describe el proposito de la reserva">${escapeHtml(editing?.motivo ?? "")}</textarea>
        </div>
        ${
          session.role === "admin"
            ? `
              <div>
                <label class="${labelClass}" for="userId">Asignar a usuario</label>
                <select id="userId" class="${formControlClass}" required></select>
              </div>
            `
            : ""
        }
        <div id="formAlert" class="hidden rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"></div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <button id="submitReserva" type="submit" class="${ui.primary} flex-1">${editing ? "Guardar cambios" : "Crear reserva"}</button>
          ${editing ? `<button id="cancelEdit" type="button" class="${ui.secondary} flex-1">Cancelar edicion</button>` : ""}
        </div>
      </form>
    </section>
  `;
}

function renderFilters() {
  return `
    <section class="${ui.surface} p-4">
      <div class="grid gap-3 md:grid-cols-[1fr_220px]">
        <input id="searchReservas" class="${formControlClass}" type="search" placeholder="Buscar por espacio, usuario, fecha o nombre" value="${escapeHtml(state.filtroTexto)}">
        <select id="statusFilter" class="${formControlClass}">
          <option value="all" ${state.filtroEstado === "all" ? "selected" : ""}>Todos los estados</option>
          <option value="pending" ${state.filtroEstado === "pending" ? "selected" : ""}>En funcion</option>
          <option value="approved" ${state.filtroEstado === "approved" ? "selected" : ""}>Disponibles</option>
          <option value="rejected" ${state.filtroEstado === "rejected" ? "selected" : ""}>Finalizadas</option>
          <option value="cancelled" ${state.filtroEstado === "cancelled" ? "selected" : ""}>Canceladas</option>
        </select>
      </div>
    </section>
  `;
}

function renderActions(reserva, session) {
  if (session.role === "admin") {
    return `
      <button class="${successButtonClass}" data-action="approve" data-id="${reserva.id}" ${reserva.estado === "approved" ? "disabled" : ""}>Aprobar</button>
      <button class="${warningButtonClass}" data-action="reject" data-id="${reserva.id}" ${reserva.estado === "rejected" ? "disabled" : ""}>Rechazar</button>
      <button class="${ui.secondary}" data-action="edit" data-id="${reserva.id}">Editar</button>
      <button class="${dangerButtonClass}" data-action="delete" data-id="${reserva.id}">Eliminar</button>
    `;
  }

  return `
    ${canUserEdit(reserva, session) ? `<button class="${ui.secondary}" data-action="edit" data-id="${reserva.id}">Editar</button>` : ""}
    ${canUserCancel(reserva, session) ? `<button class="${dangerButtonClass}" data-action="cancel" data-id="${reserva.id}">Cancelar</button>` : ""}
    ${reserva.estado === "approved" ? `<span class="text-xs font-bold text-slate-500 dark:text-slate-400">Aprobada: solo puedes cancelarla.</span>` : ""}
    ${reserva.estado === "rejected" ? `<span class="text-xs font-bold text-slate-500 dark:text-slate-400">Reserva rechazada y bloqueada.</span>` : ""}
  `;
}

function renderReservaCard(reserva) {
  const session = getSession();

  return `
    <article class="${ui.surface} p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-black text-slate-950 dark:text-white">${escapeHtml(reserva.espacio)}</h3>
          <p class="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">${escapeHtml(reserva.tipoEspacio)}</p>
        </div>
        <span class="${statusPillClass} ${estadoClase[reserva.estado] ?? estadoClase.pending}">${estadoTexto[reserva.estado] ?? reserva.estado}</span>
      </div>
      <dl class="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div class="flex justify-between gap-4"><dt class="font-bold">Fecha</dt><dd>${escapeHtml(reserva.fecha)}</dd></div>
        <div class="flex justify-between gap-4"><dt class="font-bold">Horario</dt><dd>${escapeHtml(reserva.horaInicio)} - ${escapeHtml(reserva.horaFin)}</dd></div>
        <div class="flex justify-between gap-4"><dt class="font-bold">Usuario</dt><dd>${escapeHtml(reserva.userName ?? "Sin asignar")}</dd></div>
      </dl>
      <p class="mt-4 rounded-lg bg-slate-100 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">${escapeHtml(reserva.motivo)}</p>
      <div class="mt-5 flex flex-wrap gap-2">
        ${renderActions(reserva, session)}
      </div>
    </article>
  `;
}

function renderList() {
  const reservas = filteredReservas();

  if (!reservas.length) {
    return `
      <section class="${ui.surface} p-8 text-center">
        <h3 class="text-xl font-black text-slate-950 dark:text-white">No hay reservas para mostrar</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Ajusta los filtros o crea una nueva reserva.</p>
      </section>
    `;
  }

  return `<section id="reservasList" class="grid gap-4 xl:grid-cols-2">${reservas.map(renderReservaCard).join("")}</section>`;
}

async function loadAdminUsers(selectedUserId = "") {
  const session = getSession();
  if (session.role !== "admin") return;

  const select = document.getElementById("userId");
  if (!select) return;

  const users = await apiRequest("/users");
  select.innerHTML = users
    .filter((user) => user.role === "user")
    .map((user) => `<option value="${user.id}" ${String(user.id) === String(selectedUserId) ? "selected" : ""}>${escapeHtml(user.name)} - ${escapeHtml(user.email)}</option>`)
    .join("");
}

function refreshContent() {
  document.getElementById("reservaFormPanel").innerHTML = renderForm();
  document.getElementById("filtersPanel").innerHTML = renderFilters();
  document.getElementById("reservasPanel").innerHTML = renderList();
  bindReservasEvents();
}

function showFormError(message) {
  const alert = document.getElementById("formAlert");
  alert.textContent = message;
  alert.classList.remove("hidden");
}

async function handleSubmit(event) {
  event.preventDefault();

  const session = getSession();
  const form = event.currentTarget;
  const button = document.getElementById("submitReserva");
  const id = document.getElementById("reservaId").value;
  const selectedOption = document.getElementById("espacio").selectedOptions[0];
  const userId = session.role === "admin" ? document.getElementById("userId").value : session.id;
  const userName =
    session.role === "admin"
      ? document.getElementById("userId").selectedOptions[0]?.textContent.split(" - ")[0]
      : session.name;

  const payload = {
    userId,
    userName,
    espacio: document.getElementById("espacio").value,
    tipoEspacio: selectedOption?.dataset.tipo ?? "",
    fecha: document.getElementById("fecha").value,
    horaInicio: document.getElementById("horaInicio").value,
    horaFin: document.getElementById("horaFin").value,
    motivo: document.getElementById("motivo").value.trim(),
  };

  if (payload.horaInicio >= payload.horaFin) {
    showFormError("La hora de fin debe ser posterior a la hora de inicio.");
    return;
  }

  button.disabled = true;
  button.textContent = id ? "Guardando..." : "Creando...";

  try {
    const conflict = await validateScheduleConflict(payload, id || null);
    if (conflict) {
      throw new Error("Ya existe una reserva activa para ese espacio, fecha y rango horario.");
    }

    if (id) {
      const current = state.reservas.find((reserva) => String(reserva.id) === String(id));
      await apiRequest(`/reservas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...payload,
          estado: current.estado,
          updatedAt: new Date().toISOString(),
        }),
      });
    } else {
      await apiRequest("/reservas", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          estado: "pending",
          createdAt: new Date().toISOString(),
        }),
      });
    }

    state.editingId = null;
    form.reset();
    state.reservas = await fetchReservasByRole();
    refreshContent();
  } catch (error) {
    showFormError(error.message);
    button.disabled = false;
    button.textContent = id ? "Guardar cambios" : "Crear reserva";
  }
}

async function handleListAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const session = getSession();
  const reserva = state.reservas.find((item) => String(item.id) === String(id));
  if (!reserva) return;

  try {
    if (action === "edit") {
      if (!canUserEdit(reserva, session)) {
        alert("Solo puedes editar reservas pendientes propias.");
        return;
      }
      state.editingId = id;
      refreshContent();
      await loadAdminUsers(reserva.userId);
      document.getElementById("reservaFormPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "approve") {
      await apiRequest(`/reservas/${id}`, { method: "PATCH", body: JSON.stringify({ estado: "approved" }) });
    }

    if (action === "reject") {
      await apiRequest(`/reservas/${id}`, { method: "PATCH", body: JSON.stringify({ estado: "rejected" }) });
    }

    if (action === "cancel") {
      if (!canUserCancel(reserva, session)) {
        alert("No tienes permisos para cancelar esta reserva.");
        return;
      }
      await apiRequest(`/reservas/${id}`, { method: "PATCH", body: JSON.stringify({ estado: "cancelled" }) });
    }

    if (action === "delete") {
      if (!confirm("Deseas eliminar definitivamente esta reserva?")) return;
      await apiRequest(`/reservas/${id}`, { method: "DELETE" });
    }

    state.reservas = await fetchReservasByRole();
    refreshContent();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

function bindReservasEvents() {
  bindShellEvents();

  document.getElementById("reservaForm")?.addEventListener("submit", handleSubmit);
  document.getElementById("cancelEdit")?.addEventListener("click", () => {
    state.editingId = null;
    refreshContent();
    loadAdminUsers();
  });

  document.getElementById("searchReservas")?.addEventListener("input", (event) => {
    state.filtroTexto = event.target.value;
    document.getElementById("reservasPanel").innerHTML = renderList();
  });

  document.getElementById("statusFilter")?.addEventListener("change", (event) => {
    state.filtroEstado = event.target.value;
    document.getElementById("reservasPanel").innerHTML = renderList();
  });

  document.getElementById("reservasPanel")?.addEventListener("click", handleListAction);
  loadAdminUsers(state.reservas.find((reserva) => String(reserva.id) === String(state.editingId))?.userId);
}

export async function renderReservas({ adminView = false } = {}) {
  const session = getSession();
  state.reservas = await fetchReservasByRole();

  const content = `
    <main class="px-4 py-8 md:px-8">
      <section class="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-[#FCC252]">${session.role === "admin" ? "Vista global" : "Vista personal"}</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">${adminView ? "Administracion de Peliculas" : "Peliculas"}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            ${session.role === "admin" ? "Puedes aprobar, rechazar, editar y eliminar cualquier pelicula." : "Solo las peliculas disponibles. ."}
          </p>
        </div>
      </section>

      <div class="grid gap-5 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <div id="reservaFormPanel">${renderForm()}</div>
        <div class="grid content-start gap-4">
          <div id="filtersPanel">${renderFilters()}</div>
          <div id="reservasPanel">${renderList()}</div>
        </div>
      </div>
    </main>
  `;

  return {
    html: layout(content, adminView ? "admin" : "reservas"),
    afterRender: bindReservasEvents,
  };
}
