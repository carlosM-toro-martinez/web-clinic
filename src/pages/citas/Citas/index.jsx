import React from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import { useQuery } from "@tanstack/react-query";
import appointmentsService from "../../../async/services/get/appointmentsService";
import doctorsService from "../../../async/services/get/doctorsService";
import specialtiesService from "../../../async/services/get/specialtiesService";
import CalendarAppointments from "../../../components/calendar";

function Citas() {
  const {
    data: appointmentsResponse,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
    error: errorAppointments,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ["pacientes"],
    queryFn: appointmentsService,
  });

  const {
    data: doctorsResponse,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
    error: errorDoctors,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorsService,
  });

  const {
    data: specialtiesResponse,
    isLoading: isLoadingSpecialties,
    isError: isErrorSpecialties,
    error: errorSpecialties,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: specialtiesService,
  });

  const isLoading =
    isLoadingAppointments || isLoadingDoctors || isLoadingSpecialties;
  const isError = isErrorAppointments || isErrorDoctors || isErrorSpecialties;

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-[var(--color-text-secondary)]">
          Cargando datos para la cita...
        </div>
      </LayoutComponent>
    );
  }

  if (isError) {
    const errorMessage =
      errorPacientes?.message ||
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

  const appointments = appointmentsResponse?.data || [];
  const doctors = doctorsResponse?.data || [];
  const specialties = specialtiesResponse?.data || [];

  return (
    <LayoutComponent>
      <CalendarAppointments
        appointments={appointments}
        doctors={doctors}
        specialties={specialties}
        refetchAppointments={refetchAppointments}
      />
    </LayoutComponent>
  );
}

export default Citas;
