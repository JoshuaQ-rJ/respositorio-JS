import ReservationCard from "@/components/ReservationCard";
import { getReservations } from "@/services/reservation.service";
import { getSession } from "@/utils";
import { qs } from "@/utils/dom";
import { navigateTo } from "@/router/router";

export const homeController = async () => {
  try {
    const container = qs("#reservationsContainer");
    if (!container) return;

    const user = getSession();
    if (!user) {
      navigateTo("/");
      return;
    }

    const reservations = await getReservations();

    const filteredReservations =
      user.role === "admin"
        ? reservations
        : reservations.filter((reservation) => reservation.userId === user.id);

    container.innerHTML = filteredReservations?.length
      ? filteredReservations
          .map((reservation) => ReservationCard(reservation))
          .join("")
      : `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-600">
            No hay reservas disponibles
          </p>
        </div>
      `;

    const btnGestionarReservas = document.getElementById("btn-gestionar-reservas");
    const btnNuevaReservaHome = document.getElementById("btn-nueva-reserva-home");

    if (btnGestionarReservas) {
      btnGestionarReservas.addEventListener("click", () => {
        navigateTo("/reservas");
      });
    }

    if (btnNuevaReservaHome) {
      btnNuevaReservaHome.addEventListener("click", () => {
        navigateTo("/reservas/nueva");
      });
    }
  } catch (error) {
    console.error("Error en homeController:", error);
    const container = qs("#reservationsContainer");
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-red-600 font-semibold">Error al cargar reservas</p>
        </div>
      `;
    }
  }
};
