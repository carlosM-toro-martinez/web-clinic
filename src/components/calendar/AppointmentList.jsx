import React, { useState } from "react";
import ModalPayment from "./ModalPayment";
import PaymentForm from "./PaymentForm";
import appointmentUpdateService from "../../async/services/put/appointmentUpdateService";
import useApiMutation from "../../hocks/useApiMutation";

const AppointmentList = ({
  filteredAppointments,
  formattedDate,
  refetchAppointments,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [appointments, setAppointments] = useState(filteredAppointments);

  const handleCardClick = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const { mutate, isPending, message, type, reset } = useApiMutation(
    appointmentUpdateService
  );

  const updateAppointment = (payload) => {
    mutate(payload);
  };

  return (
    <div className="bg-[var(--color-surface-variant)] rounded-[var(--radius-xl)] p-4 border border-[var(--color-border)]">
      <h3 className="text-[color:var(--color-text-primary)] font-semibold mb-3">
        Citas del día - {formattedDate}
      </h3>
      <div className="space-y-2">
        {filteredAppointments.length === 0 ? (
          <p className="text-[color:var(--color-text-subtle)] text-center py-6">
            No hay citas programadas para esta fecha.
          </p>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onClick={() => handleCardClick(appointment)}
            />
          ))
        )}
      </div>
      <ModalPayment open={modalOpen} onClose={handleCloseModal}>
        {selectedAppointment && (
          <PaymentForm
            appointment={selectedAppointment}
            onSubmit={updateAppointment}
            onCancel={handleCloseModal}
            refetchAppointments={refetchAppointments}
          />
        )}
      </ModalPayment>
    </div>
  );
};

const AppointmentCard = ({ appointment, onClick }) => {
  const start = new Date(appointment.scheduledStart);
  const end = new Date(appointment.scheduledEnd);

  const formattedTime = `${start.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/La_Paz",
  })} - ${end.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/La_Paz",
  })}`;

  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          label: "✅ Completada",
        };
      case "CONFIRMED":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          label: "✅ Confirmada",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          label: "❌ Cancelada",
        };
      case "PENDING":
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          label: "⏳ Pendiente",
        };
    }
  };

  const statusStyles = getStatusStyles(appointment.status);

  return (
    <div
      className={`p-3 rounded-lg border ${statusStyles.border} ${statusStyles.bg} hover:shadow-sm transition-all cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt={appointment.doctor?.firstName}
            className="w-8 h-8 rounded-full object-cover border border-white"
          />
          <div>
            <h4 className="text-[color:var(--color-text-primary)] font-medium text-sm">
              {appointment.specialty?.name}
            </h4>
            <p className="text-[color:var(--color-text-subtle)] text-xs">
              Dr(a). {appointment.doctor?.firstName}{" "}
              {appointment.doctor?.lastName}
            </p>
          </div>
        </div>

        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles.text} ${statusStyles.bg}`}
        >
          {statusStyles.label}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-sm font-medium">
            {appointment.patient?.firstName} {appointment.patient?.lastName}
          </span>
        </div>

        {appointment.patient?.phone && (
          <div className="flex items-center gap-1 text-xs text-[color:var(--color-text-subtle)]">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {appointment.patient.phone}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[color:var(--color-text-subtle)]">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formattedTime}
        </div>

        {(appointment.totalAmount || appointment.remainingAmount > 0) && (
          <div className="flex items-center gap-1 text-xs">
            {appointment.remainingAmount > 0 ? (
              <span className="text-orange-600 font-medium">
                Pendiente: {appointment.remainingAmount} Bs
              </span>
            ) : appointment.totalAmount ? (
              <span className="text-green-600 font-medium">
                Pagado: {appointment.totalAmount} Bs
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
