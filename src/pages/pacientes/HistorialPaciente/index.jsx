import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import LayoutComponent from "../../../components/LayoutComponent";
import PatientMedicalHistory from "../../../components/PatientMedicalHistory";
import historyPatientService from "../../../async/services/get/historyPatientService";
import BackArrow from "../../../components/common/BackArrow";

function HistorialPaciente() {
  const { id: patientId } = useParams();
  const {
    data: medicalHistory,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["medicalPatientHistory", patientId],
    queryFn: () => historyPatientService(patientId),
    enabled: !!patientId,
  });

  return (
    <LayoutComponent>
      <BackArrow />
      {isLoading && <div className="text-gray-500">Cargando historial...</div>}
      {isError && (
        <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
          <p>
            Error al cargar el historial:{" "}
            {error?.message || "Error desconocido"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Reintentar
          </button>
        </div>
      )}
      {!isLoading &&
        !isError &&
        (!medicalHistory || medicalHistory.length === 0) && (
          <div className="text-gray-600">
            No hay historial clínico disponible.
          </div>
        )}
      {!isLoading && !isError && medicalHistory && (
        <PatientMedicalHistory medicalHistory={medicalHistory?.data} />
      )}
    </LayoutComponent>
  );
}

export default HistorialPaciente;
