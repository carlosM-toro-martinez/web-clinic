import React, { useContext } from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import doctorsAppointmentsService from "../../../async/services/get/doctorsAppointmentsService";
import { useQuery } from "@tanstack/react-query";
import { MainContext } from "../../../context/MainContext";
import AppointmentsList from "../../../components/AppointmentsList";

function Consultas() {
  const { user } = useContext(MainContext);

  const {
    data: appointmentsResponse,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
    error: errorAppointments,
  } = useQuery({
    queryKey: ["doctorsAppointments"],
    queryFn: () =>
      doctorsAppointmentsService("fb40d811-5d0b-4865-9fe9-e9b57c786174"),

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
        <h2 className="text-2xl font-bold px-6 pt-6 text-center">
          Consultas pendientes
        </h2>
        <AppointmentsList appointments={appointmentsResponse.data} />
      </div>
    </LayoutComponent>
  );
}

export default Consultas;
