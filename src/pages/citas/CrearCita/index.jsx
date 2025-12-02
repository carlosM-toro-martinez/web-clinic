import React from "react";
import { useQuery } from "@tanstack/react-query";
import LayoutComponent from "../../../components/LayoutComponent";
import BackArrow from "../../../components/common/BackArrow";
import pacientesService from "../../../async/services/get/pacientesService";
import doctorsService from "../../../async/services/get/doctorsService";
import specialtiesService from "../../../async/services/get/specialtiesService";
import FormAppointments from "../../../components/appointments/FormAppointments";

function CrearCita() {
  const {
    data: pacientesResponse,
    isLoading: isLoadingPacientes,
    isError: isErrorPacientes,
    error: errorPacientes,
  } = useQuery({
    queryKey: ["pacientes"],
    queryFn: pacientesService,
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
    isLoadingPacientes || isLoadingDoctors || isLoadingSpecialties;
  const isError = isErrorPacientes || isErrorDoctors || isErrorSpecialties;

  if (isLoading) {
    return (
      <LayoutComponent>
        <BackArrow />
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
        <BackArrow />
        <div className="flex justify-center items-center h-64 text-red-500">
          Error: {errorMessage}
        </div>
      </LayoutComponent>
    );
  }

  const patients = pacientesResponse?.data || [];
  const doctors = doctorsResponse?.data || [];
  const specialties = specialtiesResponse?.data || [];

  return (
    <LayoutComponent>
      <BackArrow />
      <FormAppointments
        patients={patients}
        doctors={doctors}
        specialties={specialties}
      />
    </LayoutComponent>
  );
}

export default CrearCita;
