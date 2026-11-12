// Normaliza texto para búsquedas: minúsculas y sin tildes (María -> maria)
const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default normalizeText;
