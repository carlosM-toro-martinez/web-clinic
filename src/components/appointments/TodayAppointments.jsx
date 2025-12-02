// src/components/dashboard/appointments/TodayAppointments.jsx
import React from "react";
import AppointmentCard from "./AppointmentCard";

const TodayAppointments = ({ appointments = [] }) => {
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart)
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          📅 Citas del Día
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {appointments.length} citas
        </span>
      </div>

      <div className="space-y-3">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-8 text-[color:var(--color-text-subtle)]">
            <div className="text-4xl mb-2">📋</div>
            <p>No hay citas programadas para hoy</p>
          </div>
        ) : (
          sortedAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;
