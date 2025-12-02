import React from "react";
import { Plus } from "lucide-react";

const CalendarHeader = ({ onCreateAppointment }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Calendario de Citas
        </h1>
        <p className="text-[color:var(--color-text-subtle)]">
          Visualiza y gestiona las citas médicas de los especialistas.
        </p>
      </div>

      <button
        className="btn-primary cursor-pointer"
        onClick={onCreateAppointment}
      >
        <Plus size={18} /> Agendar cita
      </button>
    </div>
  );
};

export default CalendarHeader;
