import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LayoutComponent from "../../../components/LayoutComponent";
import PatientsTable from "../../../components/PatientsTableComponent";
import pacientesService from "../../../async/services/get/pacientesService";

function Pacientes() {
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Pacientes
        </h2>

        <button
          onClick={() => navigate("/pacientes/crear")}
          className="px-5 py-2.5 rounded-xl text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/30 transition"
        >
          + Nuevo Paciente
        </button>
      </div>

      <PatientsTable patients={patients} />
    </LayoutComponent>
  );
}

export default Pacientes;
