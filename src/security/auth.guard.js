/**
 * @file auth.guard.js
 * @description Capa de seguridad independiente para el manejo de sesiones, roles y guards.
 */

/**
 * Guarda la sesión del usuario en el almacenamiento local.
 * @param {Object} user - Objeto con id, name, email y role.
 */
export function loginUser(user) {
    localStorage.setItem("workspace_session", JSON.stringify(user));
}

/**
 * Retorna la sesión activa o null si no está autenticado.
 * @returns {Object|null}
 */
export function getSession() {
    const session = localStorage.getItem("workspace_session");
    return session ? JSON.parse(session) : null;
}

/**
 * Cierra la sesión limpiando por completo los datos del almacenamiento.
 */
export function logoutUser() {
    localStorage.removeItem("workspace_session");
}

/**
 * Guard de Protección de Rutas e Intercepción de Roles
 * @param {Object} route - Objeto de la ruta actual ({ path, requiresAuth, requiredRole })
 * @param {Function} renderCallback - Función de renderizado original de la vista
 * @returns {boolean} - True si el acceso es permitido, False si es denegado o redirigido
 */
export function authGuard(route, renderCallback) {
    const session = getSession();

    // 1. Protección por autenticación: Si requiere auth y no hay sesión
    if (route.requiresAuth && !session) {
        alert("Acceso denegado. Debes iniciar sesión primero.");
        window.location.hash = "#/login";
        return false;
    }

    // 2. Protección por roles: Si la ruta es exclusiva de Administrador
    if (route.requiredRole && (!session || session.role !== route.requiredRole)) {
        // Renderiza dinámicamente un mensaje elegante de acceso denegado sin romper el DOM
        document.getElementById("app").innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
                <div class="text-center bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md shadow-xl">
                    <span class="text-5xl">🛑</span>
                    <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-4">Acceso Restringido</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        Tu rol de <strong>${session ? session.role : 'invitado'}</strong> no cuenta con los permisos administrativos de infraestructura necesarios.
                    </p>
                    <a href="#/dashboard" class="mt-6 inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all">
                        Regresar al Dashboard
                    </a>
                </div>
            </div>
        `;
        return false;
    }

    // Si pasa todos los filtros de seguridad, permite ejecutar el renderizado original
    if (renderCallback) renderCallback();
    return true;
}