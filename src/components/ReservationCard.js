export default function ReservationCard(reservation) {
  const { espacio, fecha, horaInicio, horaFin, motivo, estado } = reservation;

  const statusStyles = {
    approved: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  };

  return `
    <article
      class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div class="flex justify-between items-start gap-3 mb-4">
        <div>
          <h3 class="font-bold text-gray-900">
            ${espacio}
          </h3>
          <p class="text-xs text-gray-500 mt-1">
            ${fecha}
          </p>
        </div>
        <span class="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${statusStyles[estado] || statusStyles.pending}">
          ${estado.toUpperCase()}
        </span>
      </div>

      <div class="space-y-2 mb-4 text-sm text-gray-700">
        <p>
          <span class="font-semibold">Horario:</span> ${horaInicio} - ${horaFin}
        </p>
        <p>
          <span class="font-semibold">Motivo:</span> ${motivo}
        </p>
      </div>
    </article>
  `;
}
