import React, { useContext } from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import doctorsAppointmentsService from "../../../async/services/get/doctorsAppointmentsService";
import { useQuery } from "@tanstack/react-query";
import { MainContext } from "../../../context/MainContext";
import AppointmentsList from "../../../components/AppointmentsList";
import { useNavigate } from "react-router-dom";

function Consultas() {
  const { user } = useContext(MainContext);
  const navigate = useNavigate();

  const {
    data: appointmentsResponse,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
    error: errorAppointments,
  } = useQuery({
    queryKey: ["doctorsAppointments"],
    queryFn: () =>
      doctorsAppointmentsService(
        user.role === "DOCTOR" || user.role === "ADMIN"
          ? user.id
          : "fb40d811-5d0b-4865-9fe9-e9b57c786174",
      ),

    //queryFn: () => doctorsAppointmentsService(user.id),
  });

  const isLoading = isLoadingAppointments;
  const isError = isErrorAppointments;

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-[var(--color-text-secondary)]">
          Cargando datos para las consultas...
        </div>
      </LayoutComponent>
    );
  }

  if (isError) {
    const errorMessage =
      errorDoctors?.message ||
      errorSpecialties?.message ||
      "Error al cargar los datos necesarios";

    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-red-500">
          Error: {errorMessage}
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 pt-6">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Consultas pendientes
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => navigate("/consultas/rapida")}
              className="btn-primary px-5 py-3 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Consulta rápida
            </button>
            <button
              type="button"
              onClick={() => navigate("/consultas/rapida-gratis")}
              className="btn-secondary px-5 py-3 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Consulta rápida sin cita
            </button>
          </div>
        </div>
        <AppointmentsList appointments={appointmentsResponse.data} />
      </div>
    </LayoutComponent>
  );
}

export default Consultas;
