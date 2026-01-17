export const formatDate = (dateString) => {
  if (!dateString) return "No especificado";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "No especificado";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatBoolean = (value) => {
  if (value === null || value === undefined) return "No especificado";
  return value ? "Sí" : "No";
};
