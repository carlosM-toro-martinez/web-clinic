import { useMemo } from "react";

export const useDateUtils = () => {
  // Función para obtener la fecha actual en formato YYYY-MM-DD sin problemas de zona horaria
  const getTodayDateString = () => {
    const now = new Date();
    // Usamos getUTCFullYear, getUTCMonth, etc. para evitar problemas de zona horaria
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Formatear fecha (corregido para manejar zona horaria)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Ajustar a zona horaria local
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );

    return adjustedDate.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Formatear fecha corta (sin día de la semana)
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );

    return adjustedDate.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calcular número de semana ISO
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  // Obtener rango de la semana para una fecha
  const getWeekRange = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
    };
  };

  return {
    getTodayDateString,
    formatCurrency,
    formatDate,
    formatShortDate,
    getWeekNumber,
    getWeekRange,
  };
};
