import React, { useState, useMemo } from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import patientsByDiagnosisService from "../../../async/services/get/patientsByDiagnosisService";

function ReportsDiagnosticos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all"); // "all", "specialty", "diagnosis"

  const {
    data: reportData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reports", "patientsByDiagnosis"],
    queryFn: patientsByDiagnosisService,
  });

  // Procesar datos y calcular estadísticas
  const processedData = useMemo(() => {
    if (!reportData?.data || !Array.isArray(reportData.data)) {
      return {
        filteredData: [],
        totalPatients: 0,
        uniqueSpecialties: 0,
        uniqueDiagnoses: 0,
        topSpecialties: [],
        topDiagnoses: [],
      };
    }

    const data = reportData.data;

    // Filtrar datos según búsqueda
    const filteredData = data.filter((row) => {
      const searchLower = searchTerm.toLowerCase();
      if (filterBy === "specialty") {
        return row.specialtyName?.toLowerCase().includes(searchLower);
      } else if (filterBy === "diagnosis") {
        return row.diagnosisName?.toLowerCase().includes(searchLower);
      } else {
        return (
          row.specialtyName?.toLowerCase().includes(searchLower) ||
          row.diagnosisName?.toLowerCase().includes(searchLower)
        );
      }
    });

    // Calcular total de pacientes
    const totalPatients = data.reduce(
      (sum, row) => sum + (row.patientCount || 0),
      0
    );

    // Obtener especialidades y diagnósticos únicos
    const specialties = new Set(data.map((row) => row.specialtyName));
    const diagnoses = new Set(data.map((row) => row.diagnosisName));

    // Top 5 especialidades por cantidad de pacientes
    const specialtyMap = {};
    data.forEach((row) => {
      if (!specialtyMap[row.specialtyName]) {
        specialtyMap[row.specialtyName] = 0;
      }
      specialtyMap[row.specialtyName] += row.patientCount || 0;
    });

    const topSpecialties = Object.entries(specialtyMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top 5 diagnósticos más frecuentes
    const diagnosisMap = {};
    data.forEach((row) => {
      if (!diagnosisMap[row.diagnosisName]) {
        diagnosisMap[row.diagnosisName] = 0;
      }
      diagnosisMap[row.diagnosisName] += row.patientCount || 0;
    });

    const topDiagnoses = Object.entries(diagnosisMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      filteredData,
      totalPatients,
      uniqueSpecialties: specialties.size,
      uniqueDiagnoses: diagnoses.size,
      topSpecialties,
      topDiagnoses,
      allData: data,
    };
  }, [reportData, searchTerm, filterBy]);

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-background py-8">
          <div className="container">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Cargando reporte de diagnósticos...
              </h2>
              <p className="text-text-subtle">
                Por favor, espera un momento mientras obtenemos los datos.
              </p>
            </div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  if (isError) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-background py-8">
          <div className="container">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Error al cargar los datos
              </h2>
              <p className="text-text-subtle mb-4">
                {error?.message || "Ocurrió un error inesperado"}
              </p>
              <button
                onClick={() => refetch()}
                className="btn-primary px-4 py-2 rounded-lg"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                📊 Reporte de Diagnósticos
              </h1>
              <p className="text-text-subtle">
                Distribución de pacientes según diagnóstico por especialidad
              </p>
            </div>

            <button
              onClick={() => navigate("/reportes")}
              className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition self-start"
            >
              ← Volver a Reportes
            </button>
          </div>

          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Total de pacientes
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {processedData.totalPatients}
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Especialidades
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {processedData.uniqueSpecialties}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 text-xl">🏥</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Diagnósticos diferentes
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {processedData.uniqueDiagnoses}
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🩺</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Registros totales
                  </div>
                  <div className="text-2xl font-bold text-amber-600">
                    {processedData.filteredData.length}
                  </div>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <span className="text-amber-600 text-xl">📊</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por especialidad, diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-4 py-3 pl-10 text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle">
                    🔍
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-subtle">Filtrar por:</span>
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setFilterBy("all")}
                      className={`px-3 py-2 text-sm transition ${
                        filterBy === "all"
                          ? "bg-primary text-white"
                          : "bg-white text-text-primary hover:bg-surface-variant"
                      }`}
                    >
                      Todo
                    </button>
                    <button
                      onClick={() => setFilterBy("specialty")}
                      className={`px-3 py-2 text-sm transition ${
                        filterBy === "specialty"
                          ? "bg-primary text-white"
                          : "bg-white text-text-primary hover:bg-surface-variant"
                      }`}
                    >
                      Especialidad
                    </button>
                    <button
                      onClick={() => setFilterBy("diagnosis")}
                      className={`px-3 py-2 text-sm transition ${
                        filterBy === "diagnosis"
                          ? "bg-primary text-white"
                          : "bg-white text-text-primary hover:bg-surface-variant"
                      }`}
                    >
                      Diagnóstico
                    </button>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition flex items-center gap-2">
                  <span>📥</span>
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla principal */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Distribución de pacientes por diagnóstico
              </h2>
              <div className="text-sm text-text-subtle">
                Mostrando {processedData.filteredData.length} registros
              </div>
            </div>

            {processedData.filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-variant">
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Especialidad
                      </th>
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Diagnóstico
                      </th>
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Código
                      </th>
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Cantidad de pacientes
                      </th>
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Porcentaje
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.filteredData.map((row, idx) => (
                      <tr
                        key={`${row.specialtyId}-${row.diagnosisId}-${idx}`}
                        className={`border-b border-border ${
                          idx % 2 === 0 ? "bg-white" : "bg-surface-variant"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-text-primary">
                            {row.specialtyName || "No especificado"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <span className="text-blue-600">🩺</span>
                            </div>
                            <span className="font-medium text-text-primary">
                              {row.diagnosisName || "Sin diagnóstico"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {row.diagnosisCode || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-text-primary">
                              {row.patientCount || 0}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((row.patientCount || 0) /
                                      processedData.totalPatients) *
                                      100 *
                                      5
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-blue-600">
                            {(
                              ((row.patientCount || 0) /
                                processedData.totalPatients) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-text-subtle">
                  No se encontraron resultados para tu búsqueda
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-primary hover:text-blue-600 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sección de estadísticas adicionales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top especialidades */}
            <div className="card">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span>🏥</span>
                Top especialidades por pacientes
              </h3>
              <div className="space-y-3">
                {processedData.topSpecialties.map((specialty, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          idx === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : idx === 1
                            ? "bg-gray-100 text-gray-800"
                            : idx === 2
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <span className="font-bold">{idx + 1}</span>
                      </div>
                      <span className="font-medium text-text-primary">
                        {specialty.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-primary">
                        {specialty.count} pacientes
                      </div>
                      <div className="text-sm text-text-subtle">
                        {(
                          (specialty.count / processedData.totalPatients) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top diagnósticos */}
            <div className="card">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span>🩺</span>
                Diagnósticos más frecuentes
              </h3>
              <div className="space-y-3">
                {processedData.topDiagnoses.map((diagnosis, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        <span className="text-purple-600">🩺</span>
                      </div>
                      <span className="font-medium text-text-primary truncate max-w-[200px]">
                        {diagnosis.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-primary">
                        {diagnosis.count} pacientes
                      </div>
                      <div className="text-sm text-text-subtle">
                        {(
                          (diagnosis.count / processedData.totalPatients) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}

export default ReportsDiagnosticos;
