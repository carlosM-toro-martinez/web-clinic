export const formatDate = (dateString) => {
  if (!dateString) return "No especificado";

  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "No especificado";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

export const formatBoolean = (value) => {
  if (value === null || value === undefined) return "No especificado";
  return value ? "Sí" : "No";
};
