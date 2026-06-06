import { login, canAccessRoute, getSession, renderAccessDenied } from "@/security/auth";
import { renderHome } from "@/modules/home.module";
import { renderReservas } from "@/modules/reservas.module";

const ui = {
  shell: "min-h-screen bg-slate-50 text-slate-950 dark:bg-[#2B1818] dark:text-slate-100",
  surface: "rounded-lg border border-slate-200 bg-[#FDFCFA] shadow-sm dark:border-[#7E1616] dark:bg-slate-900/90",
  label: "mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200",
  input: "w-full rounded-lg border border-[#FCC252] bg-[#FDFCFA] px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100",
  primary: "inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-extrabold text-[#FDFCFA] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#FDFCFA] dark:text-[#E50914] dark:hover:bg-[#a7030c]",
  secondary: "inline-flex min-h-10 items-center justify-center rounded-lg border border-[#FCC252] bg-white px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800",
};

const routes = {
  "/login": {
    requiresAuth: false,
    render: renderLogin,
  },
  "/home": {
    requiresAuth: true,
    render: renderHome,
  },
  "/reservas": {
    requiresAuth: true,
    render: () => renderReservas(),
  },
  "/admin": {
    requiresAuth: true,
    adminOnly: true,
    render: () => renderReservas({ adminView: true }),
  },
};

function getPath() {
  const hash = window.location.hash.replace("#", "");
  return hash || "/login";
}

export function navigateTo(path) {
  const nextPath = path.startsWith("#") ? path : `#${path}`;
  if (window.location.hash === nextPath) {
    router();
    return;
  }
  window.location.hash = nextPath;
}

function applySavedTheme() {
  const theme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", theme ? theme === "dark" : prefersDark);
}

function renderLogin() {
  return {
    html: `
      <main class="${ui.shell} grid place-items-center p-5">
        <section class="${ui.surface} w-full max-w-md p-7">
          <div class="mb-7">
            <p class="text-xs font-bold uppercase tracking-widest text-[#7E1616] dark:text-[#7E1616]">Sistema de Reservas</p>
            <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Iniciar sesion</h1>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Accede para gestionar espacios de trabajo.</p>
          </div>
          <form id="loginForm" class="grid gap-4">
            <div>
              <label class="${ui.label}" for="email">Correo electronico</label>
              <input id="email" name="email" class="${ui.input}" type="email" autocomplete="email" placeholder="admin@test.com" required>
            </div>
            <div>
              <label class="${ui.label}" for="password">Contrasena</label>
              <input id="password" name="password" class="${ui.input}" type="password" autocomplete="current-password" placeholder="admin123" required>
            </div>
            <div id="loginError" class="hidden rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"></div>
            <button id="loginButton" class="${ui.primary} w-full" type="submit">Ingresar</button>
          </form>
          <div class="mt-6 rounded-lg bg-slate-100 p-4 text-xs leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p class="font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Credenciales</p>
            <p class="mt-2"><strong>Admin:</strong> admin@test.com / admin123</p>
            <p><strong>User 1:</strong> user1@test.com / user123</p>
          </div>
        </section>
      </main>
    `,
    afterRender() {
      const form = document.getElementById("loginForm");
      const errorBox = document.getElementById("loginError");
      const button = document.getElementById("loginButton");

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorBox.classList.add("hidden");
        button.disabled = true;
        button.textContent = "Validando...";

        try {
          await login(form.email.value, form.password.value);
          navigateTo("#/home");
        } catch (error) {
          errorBox.textContent = error.message;
          errorBox.classList.remove("hidden");
          button.disabled = false;
          button.textContent = "Ingresar";
        }
      });
    },
  };
}

async function renderRoute(route) {
  const app = document.getElementById("app");
  const view = await route.render();
  app.innerHTML = view.html;
  view.afterRender?.();
}

export async function router() {
  applySavedTheme();

  const path = getPath();
  const session = getSession();

  if ((path === "/" || path === "/login") && session) {
    navigateTo("#/home");
    return;
  }

  const route = routes[path];
  const app = document.getElementById("app");

  if (!route) {
    app.innerHTML = `
      <main class="${ui.shell} grid place-items-center p-6">
        <section class="${ui.surface} max-w-lg p-8 text-center">
          <h1 class="text-4xl font-black text-slate-950 dark:text-white">404</h1>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">La ruta solicitada no existe.</p>
          <a href="#/home" class="${ui.primary} mt-6">Volver</a>
        </section>
      </main>
    `;
    return;
  }

  const access = canAccessRoute(route);

  if (access.redirectTo) {
    navigateTo(access.redirectTo);
    return;
  }

  if (access.denied) {
    app.innerHTML = renderAccessDenied();
    return;
  }

  try {
    await renderRoute(route);
  } catch (error) {
    app.innerHTML = `
      <main class="${ui.shell} grid place-items-center p-6">
        <section class="${ui.surface} max-w-lg p-8 text-center">
          <h1 class="text-2xl font-black text-rose-700 dark:text-rose-300">No se pudo cargar la vista</h1>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${error.message}</p>
          <a href="#/login" class="${ui.secondary} mt-6">Ir al login</a>
        </section>
      </main>
    `;
  }
}
