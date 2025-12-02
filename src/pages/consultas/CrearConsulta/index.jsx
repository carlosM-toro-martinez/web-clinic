import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LayoutComponent from "../../../components/LayoutComponent";
import PatientsTable from "../../../components/PatientsTableComponent";
import pacientesService from "../../../async/services/get/pacientesService";
import FormHistory from "../../../components/FormHistory";
import BackArrow from "../../../components/common/BackArrow";

function CrearConsulta() {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pacientes"],
    queryFn: pacientesService,
  });

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-[var(--color-text-secondary)]">
          Cargando pacientes...
        </div>
      </LayoutComponent>
    );
  }

  if (isError) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-red-500">
          Error al cargar pacientes: {error.message}
        </div>
      </LayoutComponent>
    );
  }

  const patients = response?.data || [];

  return (
    <LayoutComponent>
      <BackArrow />
      <FormHistory patients={patients} />
    </LayoutComponent>
  );
}

export default CrearConsulta;
