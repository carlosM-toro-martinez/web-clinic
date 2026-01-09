import React from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import patientsGeneralService from "../../../async/services/get/patientsGeneralService";

function ReportsPacientes() {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["reports", "patientsGeneral"],
    queryFn: patientsGeneralService,
  });

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="p-8">Cargando estadísticas de pacientes…</div>
      </LayoutComponent>
    );
  }

  if (isError) {
    return (
      <LayoutComponent>
        <div className="p-8">
          <p>Error cargando datos: {String(error)}</p>
          <button className="mt-2 px-4 py-2 border" onClick={() => refetch()}>
            Reintentar
          </button>
        </div>
      </LayoutComponent>
    );
  }

  console.log(data.data);

  return (
    <LayoutComponent>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">👥 Reporte de Pacientes</h1>
          <p className="text-text-subtle">
            Visión general de la población de pacientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="card p-4">
            <h3 className="font-semibold">Total de pacientes</h3>
            <p className="text-2xl font-bold">{data?.data?.total ?? "—"}</p>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold">Nuevos</h3>
            <p>
              Última semana: <strong>{data?.data?.newLastWeek ?? 0}</strong>
            </p>
            <p>
              Último mes: <strong>{data?.data?.newLastMonth ?? 0}</strong>
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold">Por género</h3>
            <ul>
              {Array.isArray(data?.data?.byGender) &&
                data?.data.byGender.map((g) => (
                  <li key={g.gender} className="flex justify-between">
                    <span>{g.gender}</span>
                    <span>{g.count}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Por grupos de edad</h3>
          {Array.isArray(data?.byAgeGroup) && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left p-2">Grupo</th>
                    <th className="text-right p-2">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byAgeGroup.map((row) => (
                    <tr key={row.ageGroup}>
                      <td className="p-2">{row.ageGroup}</td>
                      <td className="p-2 text-right">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate("/reportes")}
            className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition"
          >
            ← Volver a Reportes
          </button>
        </div>
      </div>
    </LayoutComponent>
  );
}

export default ReportsPacientes;
