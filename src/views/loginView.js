import { loginController } from "@/controllers/login.controller";

export default function loginView() {
  setTimeout(() => {
    loginController();
  });

  return `
    <div class="min-h-screen flex justify-center items-center bg-gray-50">
      <div class="w-full max-w-sm">
        <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Sistema de Reservas
            </h1>
            <p class="text-sm text-gray-600">
              Inicia sesión para continuar
            </p>
          </div>

          <form id="loginForm" class="space-y-4">
            <div>
              <label class="label-base">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="correo@empresa.com"
                class="input-base"
                required
              />
            </div>

            <div>
              <label class="label-base">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                class="input-base"
                required
              />
            </div>

            <button
              type="submit"
              class="btn-primary w-full mt-6"
            >
              Ingresar
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-xs text-gray-600 mb-3 font-semibold">
              CREDENCIALES DE PRUEBA
            </p>
            <div class="space-y-2 text-xs text-gray-700">
              <p><strong>Admin:</strong> admin@test.com / admin123</p>
              <p><strong>Usuario:</strong> user1@test.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}