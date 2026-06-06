import { apiRequest, getSession, logout } from "@/security/auth";
import { navigateTo } from "@/router.js";
import{formControlClass,labelClass,espacios} from "./reservas.module"
export const ui = {
  shell: "min-h-screen bg-[#2B1818] text-[#7E1616] dark:bg-[#7E1616] dark:text-[]#FCC252",
  surface: "rounded-lg border border-[#FDFCFA] bg-[#FDFCFA] shadow-sm dark:border-[#FCC252] dark:bg-[#2B1818]",
  primary: "inline-flex min-h-10 items-center justify-center rounded-lg bg-[#7E1616] px-4 py-2 text-sm font-extrabold text-[#FDFCFA] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#FCC252] dark:text-teal-950 dark:hover:bg-[#FDFCFA] hover:text-[#FCC252] ",
  secondary: "inline-flex min-h-10 items-center justify-center rounded-lg border border-[#FCC252] bg-white px-4 py-2 text-sm font-extrabold text-[#f1eadbec] transition hover:hover:bg-[#FDFCFA] hover:text-[#FCC252]  disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#FCC252] dark:bg-[#FCC252] dark:text-slate-100 dark:hover:bg-[#FDFCFA] hover:text-[#FCC252] ",
  ghost: "inline-flex min-h-10 items-center justify-center rounded-lg border border-[#ecd3a0] px-4 py-2 text-sm font-extrabold text-slate-200 transition hover:bg-[#FDFCFA] hover:text-[#FCC252] disabled:cursor-not-allowed disabled:opacity-60",
};

const statusLabel = {
  pending: "Pendientes",
  approved: "Aprobadas",
  rejected: "Rechazadas",
};

function layout(content, active = "home") {
  const session = getSession();

  return `
    <div class="${ui.shell} flex">
      <aside class="hidden min-h-screen w-72 border-r border-slate-200 bg-slate-950 p-6 text-white md:block dark:border-slate-800">
        <div class="mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-teal-300">Cinepolis</p>
          <h1 class="mt-2 text-2xl font-black">Reservas</h1>
          <p class="mt-1 text-sm text-slate-400">${session.name}</p>
        </div>
        <nav class="space-y-2">
          <a href="#/home" class="block rounded-lg px-4 py-3 text-sm font-bold ${active === "home" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800"}">Dashboard</a>
          <a href="#/reservas" class="block rounded-lg px-4 py-3 text-sm font-bold ${active === "reservas" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800"}">Reservas</a>
          ${session.role === "admin" ? `<a href="#/admin" class="block rounded-lg px-4 py-3 text-sm font-bold ${active === "admin" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800"}">Administracion</a>` : ""}
        </nav>
        <div class="mt-8 border-t border-slate-800 pt-5">
          <p class="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Sesion</p>
          <button id="logoutButton" class="${ui.ghost} w-full">Cerrar sesion</button>
        </div>
      </aside>
      <div class="min-w-0 flex-1">
        <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 md:px-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">${session.role === "admin" ? "Administrador" : "Usuario estandar"}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">${session.email}</p>
            </div>
            <div class="flex gap-2">
              <button id="themeToggle" class="${ui.secondary}" title="Cambiar tema">Tema</button>
              <button id="mobileLogoutButton" class="${ui.secondary} md:hidden">Salir</button>
            </div>
          </div>
        </header>
        ${content}
      </div>
    </div>
  `;
}

function bindShellEvents() {
  document.querySelectorAll("#logoutButton, #mobileLogoutButton").forEach((button) => {
    button.addEventListener("click", () => {
      logout();
      navigateTo("#/login");
    });
  });

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

const metricAccentClass = {
  amber: "text-amber-700 dark:text-amber-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  rose: "text-rose-700 dark:text-rose-300",
};

function metricCard(title, value, detail, accent) {
  return `
    <article class="${ui.surface} p-5">
      <p class="text-sm font-bold text-slate-500 dark:text-slate-400">${title}</p>
      <strong class="mt-3 block text-4xl font-black text-slate-950 dark:text-slate-100">${value}</strong>
      <p class="mt-2 text-sm ${metricAccentClass[accent]}">${detail}</p>
    </article>
  `;
}

export async function renderHome() {
  const session = getSession();   
  const reservas = await apiRequest("/reservas");
  const counts = await reservas.reduce(
    (acc, reserva) => ({ ...acc, [reserva.estado]: acc[reserva.estado] + 1 }),
    { pending: 0, approved: 0, rejected: 0 }
    
  );

  const roleCards =
    session.role === "admin"
      ? `
        <a href="#/admin" class="${ui.surface} group p-5 transition hover:-translate-y-0.5 hover:border-teal-500">
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Revision administrativa</p>
          <h3 class="mt-3 text-xl font-black text-slate-950 dark:text-white">Aprobar o rechazar reservas</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Gestiona todas las solicitudes del sistema con permisos completos de edicion y eliminacion.</p>
        </a>
      `
      : `
        <a href="#/reservas" class="${ui.surface} group p-5 transition hover:-translate-y-0.5 hover:border-teal-500">
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Mis Reservas</p>
          <h3 class="mt-3 text-xl font-black text-slate-950 dark:text-white">Crear y seguir reservas</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Consulta el estado de tus reservas y crea nuevas solicitudes para ingresar a las peliculas.</p>
        </a>
      `;

  const content = `
    <main class="px-4 py-8 md:px-8">
      <section class="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 class="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Hola, ${session.name}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Bienvenido a cinepolis aqui le apareceran las peliculas disponibles.
          </p>
        </div>
        <a href="#/reservas" class="${ui.primary}">Realizar reserva</a>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        ${metricCard(statusLabel.pending, counts.pending, "Peliculas en funcion", "amber")}
        ${metricCard(statusLabel.approved, counts.approved, "Peliculas disponibles", "emerald")}
        ${metricCard(statusLabel.rejected, counts.rejected, "Peliculas finalizadas", "rose")}
      </section>

      <section class="mt-6 grid gap-4 lg:grid-cols-2">
        ${roleCards}
        <article class="${ui.surface} p-5">
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Reglas activas</p>
          <h3 class="mt-3 text-xl font-black text-slate-950 dark:text-white">Control de acceso por rol</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            La sesion persiste al recargar, las rutas privadas estan protegidas y los usuarios no pueden ver reservas ajenas.
          </p>
        </article>
        <article class="${ui.surface} p-5">
          <p class="text-sm  flex justify-center font-bold text-slate-500 dark:text-slate-400">Peliculas disponibles</p>
          <div>
          <label class="${labelClass}" for="espacio">Espacio</label>
          <select id="espacio" class="${formControlClass}" required>
            <option value="">Selecciona un Pelicula</option>
            ${espacios
              .map(
                (espacio) => `
                  <option value="${espacio.nombre}" data-tipo="${espacio.tipo}" ${espacio.nombre ? "selected" : ""}>
                    ${espacio.nombre} - ${espacio.tipo}
                  </option>
                `,
              )
              .join("")}
          </select>
        </div>
        </article>
      </section>
    </main>
  `;

  return {
    html: layout(content, "home"),
    afterRender: bindShellEvents,
  };
}

export { layout, bindShellEvents };
