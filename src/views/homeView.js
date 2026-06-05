import Sidebar from "@/components/Sidebar";
import { getSession } from "@/utils";
import { homeController } from "@/controllers/home.controller";

export default function homeView() {
  const user = getSession();

  setTimeout(() => {
    homeController();
  });

  return `
    <div class="flex min-h-screen bg-gray-50">
      ${Sidebar()}

      <main class="flex-1 md:ml-64 p-6 md:p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-1">
            Bienvenido, ${user?.name}
          </h1>
          <p class="text-sm text-gray-600">
            ${user?.role === "admin" ? "Panel Administrador" : "Panel de Usuario"}
          </p>
        </div>

        ${
          user?.role === "admin"
            ? `
              <div class="card mb-8">
                <h2 class="text-lg font-bold text-gray-900 mb-3">
                  Gestión de Reservas
                </h2>
                <p class="text-sm text-gray-600 mb-4">
                  Revisa y aprueba todas las reservas del sistema.
                </p>
                <button
                  id="btn-gestionar-reservas"
                  class="btn-primary"
                >
                  Ver todas las reservas
                </button>
              </div>
            `
            : `
              <div class="card mb-8">
                <h2 class="text-lg font-bold text-gray-900 mb-3">
                  Nueva Reserva
                </h2>
                <p class="text-sm text-gray-600 mb-4">
                  Crea una nueva reserva de espacio de trabajo.
                </p>
                <button
                  id="btn-nueva-reserva-home"
                  class="btn-primary"
                >
                  Crear nueva reserva
                </button>
              </div>
            `
        }

        <div class="card">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h2 class="text-lg font-bold text-gray-900 mb-1">
                Tus Reservas
              </h2>
              <p class="text-xs text-gray-600">
                ${
                  user?.role === "admin"
                    ? "Total de reservas en el sistema"
                    : "Tus reservas personales"
                }
              </p>
            </div>
          </div>

          <div
            id="reservationsContainer"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div class="col-span-full flex items-center justify-center py-12">
              <div class="text-center">
                <div class="spinner mx-auto mb-2"></div>
                <p class="text-sm text-gray-600">
                  Cargando reservas...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}
