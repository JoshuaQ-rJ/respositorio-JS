import { loginController } from "@/controllers/login.controller";

export default function loginView() {
  setTimeout(() => {
    loginController();
  });

  return `
    <div class="min-h-screen flex justify-center items-center bg-[#1A1A1A]">
      <div class="w-full max-w-sm">
        <div class="bg-[#f1eadbec] rounded-xl border-4 border-[#e7c37bd8] p-8 shadow-sm">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-[#7E1616] mb-2">
              Sistema de Reservas
            </h1>
            <p class="text-sm text-[#7E1616]">
              Inicia sesión para continuar
            </p>
          </div>

          <form id="loginForm" class="space-y-4 text-[#7E1616]">
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

          <div class="mt-6 pt-6 border-t border-[#FCC252]">
            <p class="text-xs text-[#7E1616] mb-3 font-semibold">
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