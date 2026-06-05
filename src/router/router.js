import loginView from "@/views/loginView";
import homeView from "@/views/homeView";
import {qs} from "@/utils/dom";
import {renderReservasView} from "@/modules/reservas.module";
import {renderNuevoFormView} from "@/modules/nuevoForm.module";
import { getSession } from "@/utils";

const routes = {
    "/": {
        render: loginView,
        requiresAuth: false,
    },
    "/home": {
        render: homeView,
        requiresAuth: true,
    },
    "/reservas": {
        render: renderReservasView,
        requiresAuth: true
    },
    "/reservas/nueva": {
        render: renderNuevoFormView,
        requiresAuth: true
    }
};

export const navigateTo = (path) => {
  history.pushState({}, "", path);
  router();
};

export function router () {
    const app = qs('#app')
    if(!app) {
        return
    }

    const currentPath = window.location.pathname;
    const session = getSession();

    let route = routes[currentPath];

    if (!route) {
        app.innerHTML = `
            <div class="flex items-center justify-center min-h-screen">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p class="text-gray-600 mb-6">Página no encontrada</p>
                    <a href="/" data-link class="btn-primary">Volver al inicio</a>
                </div>
            </div>
        `;
        return;
    }

    if (route.requiresAuth && !session) {
        navigateTo("/");
        return;
    }

    if (currentPath === "/" && session) {
        navigateTo("/home");
        return;
    }

    const render = route.render;
    if (!render) {
        return;
    }

    app.innerHTML = render();

    if (route.setup) {
        route.setup();
    }
}

window.addEventListener("popstate", router);
