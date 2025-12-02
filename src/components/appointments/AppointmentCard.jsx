// src/components/dashboard/appointments/AppointmentCard.jsx
import React from "react";
import { formatAppointmentTime, getStatusStyles } from "../../utils/formatters";

const AppointmentCard = ({ appointment }) => {
  const { patient, doctor, specialty, scheduledStart, status } = appointment;
  const { label, bg, text } = getStatusStyles(status);
  const timeInfo = formatAppointmentTime(scheduledStart);

  return (
    <div className="p-4 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-colors bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-[var(--color-accent-blue-light)] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--color-primary)] text-sm">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[color:var(--color-text-primary)] truncate">
              {patient.firstName} {patient.lastName}
            </h4>
            <p className="text-sm text-[color:var(--color-text-subtle)] truncate">
              {specialty.name} - Dr. {doctor.firstName}
            </p>
          </div>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
        >
          {label}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-[color:var(--color-text-secondary)]">
          <span>🕐</span>
          <span>{timeInfo.time}</span>
        </div>
        <div className="text-[color:var(--color-text-subtle)]">
          {timeInfo.remaining}
        </div>
      </div>

      {/* Información de pago si existe */}
      {appointment.totalAmount && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <div className="flex justify-between text-sm">
            <span className="text-[color:var(--color-text-secondary)]">
              Total:
            </span>
            <span className="font-semibold text-green-600">
              {appointment.totalAmount} BOB
            </span>
          </div>
          {appointment.remainingAmount > 0 && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[color:var(--color-text-secondary)]">
                Pendiente:
              </span>
              <span className="font-semibold text-orange-600">
                {appointment.remainingAmount} BOB
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
