import { removeSession } from "@/utils";
import { navigateTo } from "@/router/router";

export default function Sidebar() {
  setTimeout(() => {
    document
      .querySelector("#logoutBtn")
      ?.addEventListener("click", () => {
        removeSession();
        navigateTo("/");
      });
  });

  return `
    <aside
      class="w-64 bg-gray-900 text-white h-screen p-6 fixed md:relative overflow-y-auto hidden md:block"
    >
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-1">
          Reservas
        </h2>
        <p class="text-xs text-gray-400">
          Sistema de espacios
        </p>
      </div>

      <nav class="flex flex-col gap-2 mb-8">
        <a
          href="/home"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          data-link
        >
          📊 Inicio
        </a>

        <a
          href="/reservas"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          data-link
        >
          📅 Reservas
        </a>
      </nav>

      <button
        id="logoutBtn"
        class="w-full px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-red-900 hover:text-white transition-colors mt-auto text-left"
      >
        🚪 Cerrar sesión
      </button>
    </aside>
  `;
}