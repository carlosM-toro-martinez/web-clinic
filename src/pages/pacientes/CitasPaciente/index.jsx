import React from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import patientAppointmentsService from "../../../async/services/get/patientAppointmentsService";
import { useQuery } from "@tanstack/react-query";
import BackArrow from "../../../components/common/BackArrow";
import { useParams } from "react-router-dom";

function CitasPaciente() {
  const { id: patientId } = useParams();
  console.log(patientId);

  const {
    data: appointmentsPatientResponse,
    isLoading: isLoadingAppointmentsPatient,
    isError: isErrorAppointmentsPatient,
    error: errorAppointmentsPatient,
  } = useQuery({
    queryKey: ["patientAppointments", patientId],
    queryFn: () => patientAppointmentsService(patientId),
  });

  const appointments = appointmentsPatientResponse?.data || [];

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para formatear hora
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para obtener el color del estado
  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-[var(--color-success)]",
          text: "text-white",
          label: "Completada",
          icon: "✅",
        };
      case "CONFIRMED":
        return {
          bg: "bg-[var(--color-info)]",
          text: "text-white",
          label: "Confirmada",
          icon: "✅",
        };
      case "PENDING":
        return {
          bg: "bg-[var(--color-warning)]",
          text: "text-white",
          label: "Pendiente",
          icon: "⏳",
        };
      case "CANCELLED":
        return {
          bg: "bg-[var(--color-error)]",
          text: "text-white",
          label: "Cancelada",
          icon: "❌",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: status,
          icon: "📅",
        };
    }
  };

  // Obtener citas de hoy
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (appt) => appt.scheduledStart.split("T")[0] === today
  );

  if (isLoadingAppointmentsPatient) {
    return (
      <LayoutComponent>
        <div className="container py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-[var(--text-muted)]">Cargando citas...</div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  if (isErrorAppointmentsPatient) {
    return (
      <LayoutComponent>
        <div className="container py-10">
          <div className="text-center text-[var(--color-error)]">
            Error al cargar las citas: {errorAppointmentsPatient?.message}
          </div>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <BackArrow />
      <div className="container py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Mis Citas Médicas
          </h1>
          <p className="text-[var(--text-muted)]">
            Gestiona y revisa todas tus citas programadas
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal - Lista de Citas */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                  Todas mis citas
                </h2>
                <span className="px-3 py-1 bg-[var(--color-surface-variant)] text-[var(--color-text-secondary)] rounded-full text-sm font-medium">
                  {appointments.length} citas
                </span>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                    No hay citas programadas
                  </h3>
                  <p className="text-[var(--text-muted)]">
                    No tienes citas médicas programadas en este momento.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => {
                    const statusStyles = getStatusStyles(appointment.status);
                    return (
                      <div
                        key={appointment.id}
                        className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[var(--color-accent-blue-light)] rounded-xl flex items-center justify-center">
                              <span className="text-[var(--color-primary)] text-lg">
                                🏥
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-[var(--color-text-primary)]">
                                {appointment.specialty?.name}
                              </h3>
                              <p className="text-sm text-[var(--color-text-secondary)]">
                                Dr(a). {appointment.doctor?.firstName}{" "}
                                {appointment.doctor?.lastName}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}
                          >
                            {statusStyles.icon} {statusStyles.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                            <span>📅</span>
                            <span>
                              {formatDate(appointment.scheduledStart)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                            <span>⏰</span>
                            <span>
                              {formatTime(appointment.scheduledStart)} -{" "}
                              {formatTime(appointment.scheduledEnd)}
                            </span>
                          </div>
                        </div>

                        {/* Información de pago */}
                        <div className="p-3 bg-[var(--color-surface-variant)] rounded-lg">
                          <div className="flex justify-between items-center text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[var(--color-text-secondary)]">
                                  Total:
                                </span>
                                <span className="font-semibold text-[var(--color-text-primary)]">
                                  {appointment.totalAmount} BOB
                                </span>
                              </div>
                              {appointment.remainingAmount > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[var(--color-text-secondary)]">
                                    Pendiente:
                                  </span>
                                  <span className="font-semibold text-[var(--color-warning)]">
                                    {appointment.remainingAmount} BOB
                                  </span>
                                </div>
                              )}
                            </div>
                            {appointment.remainingAmount === 0 && (
                              <span className="px-2 py-1 bg-[var(--color-success)] text-white rounded-full text-xs">
                                💰 Pagado
                              </span>
                            )}
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                              {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Resumen y Citas de Hoy */}
          <div className="space-y-6">
            {/* Resumen Rápido */}
            <div className="card">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
                Resumen
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">
                    Total citas:
                  </span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {appointments.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">
                    Pendientes:
                  </span>
                  <span className="font-semibold text-[var(--color-warning)]">
                    {appointments.filter((a) => a.status === "PENDING").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">
                    Confirmadas:
                  </span>
                  <span className="font-semibold text-[var(--color-info)]">
                    {
                      appointments.filter((a) => a.status === "CONFIRMED")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">
                    Completadas:
                  </span>
                  <span className="font-semibold text-[var(--color-success)]">
                    {
                      appointments.filter((a) => a.status === "COMPLETED")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Citas de Hoy */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  Citas de hoy
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    todayAppointments.length > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {todayAppointments.length}
                </span>
              </div>

              {todayAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">😴</div>
                  <p className="text-sm text-[var(--text-muted)]">
                    No hay citas para hoy
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-accent-blue-light)] rounded-lg flex items-center justify-center">
                          <span className="text-[var(--color-primary)]">
                            👨‍⚕️
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[var(--color-text-primary)] text-sm">
                            {appointment.specialty?.name}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            {formatTime(appointment.scheduledStart)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Acciones Rápidas */}
            <div className="card">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
                Acciones
              </h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-variant)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 text-left">
                  📅 Solicitar nueva cita
                </button>
                <button className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-variant)] text-[var(--color-text-secondary)] font-medium hover:bg-[var(--color-surface)] transition-all duration-200 text-left">
                  🔄 Reprogramar cita
                </button>
                <button className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-variant)] text-[var(--color-error)] font-medium hover:bg-[var(--color-error)] hover:text-white transition-all duration-200 text-left">
                  ❌ Cancelar cita
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}

export default CitasPaciente;
