import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  User,
  Stethoscope,
  Clock,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { MainContext } from "../../context/MainContext";

export default function AppointmentsList({
  appointments = [],
  onCancelAppointment,
  isCancelling = false,
  cancellingAppointmentId = null,
}) {
  const navigate = useNavigate();
  const { patientHistory, setPatientHistory } = useContext(MainContext);

  useEffect(() => {
    if (patientHistory) {
      setPatientHistory(null);
    }
  }, []);

  // Función para verificar si una fecha es hoy
  const isToday = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  };

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status !== "CANCELLED",
  );

  // Separar citas de hoy y otras fechas
  const todayAppointments = pendingAppointments
    .filter((appointment) => isToday(appointment.scheduledStart))
    .sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart)); // Ordenar por hora

  const otherAppointments = pendingAppointments
    .filter((appointment) => !isToday(appointment.scheduledStart))
    .sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart)); // Ordenar por fecha

  if (pendingAppointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No hay consultas pendientes.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Citas de Hoy */}
      {todayAppointments.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Citas para Hoy</h2>
            <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
              {todayAppointments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                navigate={navigate}
                isToday={true}
                onCancelAppointment={onCancelAppointment}
                isCancelling={isCancelling}
                cancellingAppointmentId={cancellingAppointmentId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Otras Citas */}
      {otherAppointments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Próximas Citas</h2>
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {otherAppointments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                navigate={navigate}
                isToday={false}
                onCancelAppointment={onCancelAppointment}
                isCancelling={isCancelling}
                cancellingAppointmentId={cancellingAppointmentId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente separado para la tarjeta de cita
const AppointmentCard = ({
  appointment,
  navigate,
  isToday,
  onCancelAppointment,
  isCancelling,
  cancellingAppointmentId,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Verificar si es hoy, mañana o otra fecha
    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana";
    } else {
      return date.toLocaleDateString("es-BO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Completada",
        };
      case "CONFIRMED":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: <ClockIcon className="w-4 h-4" />,
          label: "Confirmada",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: <ClockIcon className="w-4 h-4" />,
          label: "Cancelada",
        };
      default: // PENDING
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <ClockIcon className="w-4 h-4" />,
          label: "Pendiente",
        };
    }
  };

  const handleOpenConsulta = (viewOnly = false) => {
    if (appointment.status === "CANCELLED") {
      window.alert("No se puede iniciar una consulta de una cita cancelada.");
      return;
    }

    // 1. Abrir nueva pestaña con /consultas/crear
    const state = {
      specialtyId: appointment.specialtyId,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      patient: appointment.patient,
      specialty: appointment.specialty,
      doctor: appointment.doctor,
      appointmentsId: appointment.id,
      ...(viewOnly ? { viewOnly: true } : {}),
    };

    // Abrir nueva pestaña
    window.open(`/pacientes/${appointment.patient.id}/historia`);

    // 2. En la ventana actual, navegar a historia del paciente
    if (appointment.patient?.id) {
      navigate(`/consultas/crear`, { state });
    } else if (appointment.patientId) {
      navigate(`/consultas/crear`, { state });
    }
  };

  const handleCancelAppointment = () => {
    if (!onCancelAppointment) return;

    if (appointment.status === "CANCELLED") {
      window.alert("Esta cita ya fue cancelada.");
      return;
    }

    if (appointment.status === "COMPLETED") {
      window.alert("No se puede cancelar una cita completada.");
      return;
    }

    const reasonInput = window.prompt(
      "Motivo de cancelación (opcional):",
      "",
    );

    if (reasonInput === null) return;

    const reason = reasonInput.trim();

    onCancelAppointment({
      appointmentId: appointment.id,
      reason: reason || undefined,
    });
  };

  const statusStyles = getStatusStyles(appointment.status);
  const isCancellingCurrent =
    isCancelling && cancellingAppointmentId === appointment.id;

  return (
    <div
      className={`bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 ${
        isToday ? "ring-2 ring-green-200" : ""
      }`}
    >
      {/* Header con especialidad y estado */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          {appointment.specialty?.name || "Sin especialidad"}
        </h2>
        <div
          className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${statusStyles.bg} ${statusStyles.text}`}
        >
          {statusStyles.icon}
          <span>{statusStyles.label}</span>
        </div>
      </div>

      {/* Indicador de hoy */}
      {isToday && (
        <div className="mb-3">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            ⭐ Cita de Hoy
          </span>
        </div>
      )}

      {/* Información del paciente */}
      <div className="flex items-center text-gray-700 mb-2">
        <User className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm">
          <strong>Paciente:</strong> {appointment.patient?.firstName}{" "}
          {appointment.patient?.lastName}
        </span>
      </div>

      {/* Información del doctor */}
      <div className="flex items-center text-gray-700 mb-2">
        <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm">
          <strong>Doctor:</strong> {appointment.doctor?.firstName}{" "}
          {appointment.doctor?.lastName}
        </span>
      </div>

      {/* Fecha */}
      <div className="flex items-center text-gray-700 mb-2">
        <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm font-medium">
          {formatDate(appointment.scheduledStart)}
        </span>
      </div>

      {/* Horario */}
      <div className="flex items-center text-gray-700 mb-4">
        <Clock className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm">
          {formatTime(appointment.scheduledStart)} -{" "}
          {formatTime(appointment.scheduledEnd)}
        </span>
      </div>

      {/* Información de pago si existe */}
      {(appointment.totalAmount || appointment.remainingAmount) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            {appointment.totalAmount && (
              <div>
                Total: <strong>{appointment.totalAmount} BOB</strong>
              </div>
            )}
            {appointment.remainingAmount > 0 && (
              <div className="text-orange-600">
                Pendiente: <strong>{appointment.remainingAmount} BOB</strong>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3">
        {appointment.status === "COMPLETED" ? (
          <div className="text-center">
            <div className="text-green-600 text-sm font-medium mb-1">
              ✅ Consulta Realizada
            </div>
            <button
              onClick={() => handleOpenConsulta(true)}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 transition cursor-pointer"
            >
              Ver detalles de consulta
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleOpenConsulta(false)}
            className={`px-6 py-3 text-lg font-semibold rounded-xl cursor-pointer transition ${
              isToday
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "btn-primary"
            }`}
          >
            {isToday ? "🎯 Iniciar Consulta" : "Iniciar Consulta"}
          </button>
        )}

        {appointment.status !== "COMPLETED" &&
          appointment.status !== "CANCELLED" && (
            <button
              type="button"
              onClick={handleCancelAppointment}
              disabled={isCancellingCurrent}
              className="px-4 py-3 text-sm font-semibold rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCancellingCurrent ? "Cancelando..." : "Cancelar cita"}
            </button>
          )}
      </div>
    </div>
  );
};
