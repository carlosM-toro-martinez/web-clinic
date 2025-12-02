import React from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import { useQuery } from "@tanstack/react-query";
import doctorsService from "../../../async/services/get/doctorsService";
import specialtiesService from "../../../async/services/get/specialtiesService";
import SpecialtiesComponent from "../../../components/SpecialtiesComponent";

function Especialidades() {
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

  const isLoading = isLoadingDoctors || isLoadingSpecialties;
  const isError = isErrorDoctors || isErrorSpecialties;

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-[var(--color-text-secondary)]">
          Cargando datos para las especialidades...
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

  const doctors = doctorsResponse?.data || [];
  const specialties = specialtiesResponse?.data || [];
  return (
    <LayoutComponent>
      <SpecialtiesComponent doctors={doctors} specialties={specialties} />
    </LayoutComponent>
  );
}

export default Especialidades;
