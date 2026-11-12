import React, { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../../context/MainContext";
import patientDeactivateService from "../../../async/services/patch/patientDeactivateService";
import LayoutComponent from "../../../components/LayoutComponent";
import PatientsTable from "../../../components/PatientsTableComponent";
import pacientesService from "../../../async/services/get/pacientesService";

function Pacientes() {
  const navigate = useNavigate();
  const { token } = useContext(MainContext);

  const deactivateMutation = useMutation({
    mutationFn: (patientId) => patientDeactivateService(patientId, token),
    onSuccess: async () => {
      await refetch();
      window.alert("El paciente fue dado de baja correctamente.");
    },
    onError: (error) => {
      if (error === 401 || error === 403) {
        window.alert("No tienes permisos o tu sesión expiró.");
        return;
      }
      if (error === 404) {
        window.alert("No se encontró el paciente.");
        return;
      }
      window.alert("No se pudo dar de baja al paciente. Intenta nuevamente.");
    },
  });

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
          className="px-5 cursor-pointer py-2.5 rounded-xl text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/30 transition"
        >
          + Nuevo Paciente
        </button>
      </div>

      <PatientsTable
        patients={patients}
        onDeactivate={(patient) => deactivateMutation.mutate(patient.id)}
      />
    </LayoutComponent>
  );
}

export default Pacientes;
