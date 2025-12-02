import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LayoutComponent from "../../../components/LayoutComponent";
import workersService from "../../../async/services/get/workersService";
import WorkersTable from "../../../components/WorkersTableComponent";

function Trabajadores() {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trabajadores"],
    queryFn: workersService,
  });

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-[var(--color-text-secondary)]">
          Cargando trabajadores...
        </div>
      </LayoutComponent>
    );
  }

  if (isError) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-red-500">
          Error al cargar trabajadores: {error.message}
        </div>
      </LayoutComponent>
    );
  }

  const workers = response?.data || [];

  return (
    <LayoutComponent>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Trabajadores
        </h2>

        <button
          onClick={() => navigate("/trabajador/crear")}
          className="px-5 py-2.5 rounded-xl text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/30 transition"
        >
          + Nuevo Trabajador
        </button>
      </div>

      <WorkersTable workers={workers} />
    </LayoutComponent>
  );
}

export default Trabajadores;
