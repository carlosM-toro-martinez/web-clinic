import React from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import "react-day-picker/style.css";

const CalendarView = ({ selectedDate, onSelectDate, daysWithAppointments }) => {
  // Obtener la fecha de hoy
  const today = new Date();

  return (
    <div className="flex justify-center">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        locale={es}
        defaultMonth={today} // Mostrar el mes actual por defecto
        modifiers={{
          hasAppointment: daysWithAppointments,
          today: today, // Modificador para el día de hoy
        }}
        modifiersClassNames={{
          selected: "bg-[var(--color-primary)] text-white font-bold relative",
          hasAppointment:
            "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[var(--color-success)] after:rounded-full",
          today:
            "bg-[var(--color-accent-blue-light)] text-[var(--color-primary)] font-bold border border-[var(--color-primary)] relative",
        }}
        styles={{
          caption: {
            color: "var(--color-text-primary)",
            fontWeight: "bold",
            fontSize: "1.1rem",
          },
          head: {
            color: "var(--color-text-secondary)",
            fontWeight: "600",
          },
          day: {
            transition: "all 0.2s ease-in-out",
            borderRadius: "8px",
            margin: "2px",
            fontSize: "0.9rem",
          },
        }}
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      />
    </div>
  );
};

export default CalendarView;
