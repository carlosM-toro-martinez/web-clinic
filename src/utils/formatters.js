// src/utils/formatters.js
export const formatAppointmentTime = (scheduledStart) => {
  const now = new Date();
  const appointmentTime = new Date(scheduledStart);
  const timeString = appointmentTime.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const diffHours = (appointmentTime - now) / (1000 * 60 * 60);

  let remaining = "";
  if (diffHours > 0 && diffHours < 24) {
    if (diffHours < 1) {
      const minutes = Math.floor(diffHours * 60);
      remaining = `En ${minutes} min`;
    } else {
      remaining = `En ${Math.floor(diffHours)}h`;
    }
  }

  return { time: timeString, remaining };
};

export const getStatusStyles = (status) => {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Completada",
        bg: "bg-green-100",
        text: "text-green-800",
      };
    case "CONFIRMED":
      return {
        label: "Confirmada",
        bg: "bg-blue-100",
        text: "text-blue-800",
      };
    case "CANCELLED":
      return {
        label: "Cancelada",
        bg: "bg-red-100",
        text: "text-red-800",
      };
    case "PENDING":
    default:
      return {
        label: "Pendiente",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
      };
  }
};
