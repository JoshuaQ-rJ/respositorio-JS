const API_URL = "http://localhost:3000";
const SESSION_KEY = "workspaceReservationSession";
const shellClass = "min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100";
const surfaceClass = "rounded-lg border border-slate-200 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-900/90";
const primaryButtonClass = "inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300";
const secondaryButtonClass = "inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800";

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function login(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const users = await apiRequest(`/users?email=${encodeURIComponent(cleanEmail)}`);
  const user = users.find((item) => item.email.toLowerCase() === cleanEmail);

  if (!user || user.password !== password) {
    throw new Error("Correo o contrasena incorrectos.");
  }

  const { password: _password, ...session } = user;
  saveSession(session);
  return session;
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
}

export function getSession() {
  const rawSession = localStorage.getItem(SESSION_KEY) ?? localStorage.getItem("user");
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession);
  } catch {
    logout();
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("user");
  localStorage.removeItem("theme");
}

export function isAuthenticated() {
  return Boolean(getSession());
}

export function isAdmin() {
  return getSession()?.role === "admin";
}

export function canAccessRoute(route) {
  const session = getSession();

  if (route.requiresAuth && !session) {
    return { allowed: false, redirectTo: "#/login" };
  }

  if (route.adminOnly && session?.role !== "admin") {
    return { allowed: false, denied: true };
  }

  return { allowed: true };
}

export function renderAccessDenied() {
  return `
    <main class="${shellClass} grid place-items-center p-6">
      <section class="${surfaceClass} max-w-xl p-8 text-center">
        <div class="mx-auto mb-5 grid size-14 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200">
          <span class="text-2xl font-black">!</span>
        </div>
        <h1 class="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">Acceso denegado</h1>
        <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Tu rol actual no tiene permisos para entrar a este modulo administrativo.
        </p>
        <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#/home" class="${primaryButtonClass}">Volver al dashboard</a>
          <a href="#/reservas" class="${secondaryButtonClass}">Ver mis reservas</a>
        </div>
      </section>
    </main>
  `;
}
