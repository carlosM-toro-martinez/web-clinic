import React, { useState, useMemo } from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import appointmentsWeeklyService from "../../../async/services/get/appointmentsWeeklyService";

function ReportsCitas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [dateRange, setDateRange] = useState("last-month");

  // Generar fechas por defecto (últimos 30 días)
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const defaultDates = useMemo(() => getDefaultDates(), []);
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);

  const {
    data: reportData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reports", "appointmentsWeekly", startDate, endDate],
    queryFn: () => appointmentsWeeklyService(startDate, endDate),
  });

  // Procesar datos para estadísticas
  const processedData = useMemo(() => {
    if (!reportData?.data || !Array.isArray(reportData.data)) {
      return {
        filteredData: [],
        totalAppointments: 0,
        totalSpecialties: 0,
        totalWeeks: 0,
        topSpecialties: [],
        weeklyTrend: [],
        specialties: [],
      };
    }

    const data = reportData.data;

    // Filtrar por búsqueda y especialidad seleccionada
    const filteredData = data.filter((row) => {
      const matchesSearch = row.specialtyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "all" || row.specialtyName === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });

    // Calcular totales
    const totalAppointments = filteredData.reduce(
      (sum, row) => sum + (row.count || 0),
      0
    );

    // Obtener especialidades únicas
    const specialties = [
      ...new Set(data.map((row) => row.specialtyName)),
    ].filter(Boolean);

    // Top 5 especialidades por citas
    const specialtyMap = {};
    data.forEach((row) => {
      if (!specialtyMap[row.specialtyName]) {
        specialtyMap[row.specialtyName] = 0;
      }
      specialtyMap[row.specialtyName] += row.count || 0;
    });

    const topSpecialties = Object.entries(specialtyMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Tendencia semanal
    const weeklyTrend = {};
    data.forEach((row) => {
      if (!weeklyTrend[row.weekStart]) {
        weeklyTrend[row.weekStart] = 0;
      }
      weeklyTrend[row.weekStart] += row.count || 0;
    });

    const weeklyTrendArray = Object.entries(weeklyTrend)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Obtener semanas únicas
    const weeks = [...new Set(data.map((row) => row.weekStart))].filter(
      Boolean
    );

    return {
      filteredData,
      totalAppointments,
      totalSpecialties: specialties.length,
      totalWeeks: weeks.length,
      topSpecialties,
      weeklyTrend: weeklyTrendArray,
      specialties,
      allData: data,
    };
  }, [reportData, searchTerm, selectedSpecialty]);

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Función para obtener el color según el número de citas
  const getCountColor = (count) => {
    if (count > 50) return "bg-red-100 text-red-800";
    if (count > 30) return "bg-orange-100 text-orange-800";
    if (count > 20) return "bg-yellow-100 text-yellow-800";
    if (count > 10) return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  // Manejar cambio de rango de fecha
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const end = new Date();
    const start = new Date();

    switch (range) {
      case "last-week":
        start.setDate(start.getDate() - 7);
        break;
      case "last-month":
        start.setDate(start.getDate() - 30);
        break;
      case "last-quarter":
        start.setMonth(start.getMonth() - 3);
        break;
      case "last-year":
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setDate(start.getDate() - 30);
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-background py-8">
          <div className="container">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Cargando reporte de citas...
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
                📅 Reporte de Citas
              </h1>
              <p className="text-text-subtle">
                Análisis detallado de citas por especialidad y semana
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
            <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Total de citas
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {processedData.totalAppointments}
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-blue-600 text-xl">📅</span>
                </div>
              </div>
            </div>

            <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Especialidades
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {processedData.totalSpecialties}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-green-600 text-xl">🏥</span>
                </div>
              </div>
            </div>

            <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Semanas analizadas
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {processedData.totalWeeks}
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-purple-600 text-xl">📆</span>
                </div>
              </div>
            </div>

            <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Promedio semanal
                  </div>
                  <div className="text-2xl font-bold text-amber-600">
                    {processedData.totalWeeks > 0
                      ? Math.round(
                          processedData.totalAppointments /
                            processedData.totalWeeks
                        )
                      : 0}
                  </div>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-amber-600 text-xl">📊</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y controles */}
          <div className="card mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Buscar especialidad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escribe para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-4 py-3 pl-10 text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle">
                    🔍
                  </div>
                </div>
              </div>

              {/* Selector de rango rápido */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Rango de fechas rápido
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "last-week", label: "Última semana" },
                    { value: "last-month", label: "Último mes" },
                    { value: "last-quarter", label: "Último trimestre" },
                    { value: "last-year", label: "Último año" },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleDateRangeChange(range.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        dateRange === range.value
                          ? "bg-primary text-white"
                          : "border border-border text-text-primary hover:bg-surface-variant"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de fechas personalizadas */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Rango personalizado
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="self-center text-text-subtle">a</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition whitespace-nowrap"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>

            {/* Filtro por especialidad */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Filtrar por especialidad
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSpecialty("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedSpecialty === "all"
                      ? "bg-primary text-white"
                      : "border border-border text-text-primary hover:bg-surface-variant"
                  }`}
                >
                  Todas las especialidades
                </button>
                {processedData.specialties.slice(0, 5).map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedSpecialty === specialty
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "border border-border text-text-primary hover:bg-surface-variant"
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
                {processedData.specialties.length > 5 && (
                  <span className="self-center text-sm text-text-subtle px-2">
                    +{processedData.specialties.length - 5} más
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabla principal */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Distribución de citas por especialidad
                </h2>
                <p className="text-sm text-text-subtle mt-1">
                  Período: {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-text-subtle">
                  Mostrando {processedData.filteredData.length} registros
                </div>
                <button className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition flex items-center gap-2">
                  <span>📥</span>
                  Exportar
                </button>
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
                        Semana
                      </th>
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Cantidad de citas
                      </th>
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Tendencia
                      </th>
                      <th className="text-left py-4 px-4 text-text-primary font-semibold">
                        Porcentaje
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.filteredData.map((row, idx) => (
                      <tr
                        key={`${row.specialtyId}-${row.weekStart}-${idx}`}
                        className={`border-b border-border ${
                          idx % 2 === 0 ? "bg-white" : "bg-surface-variant"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                              <span className="text-blue-600">🏥</span>
                            </div>
                            <div>
                              <div className="font-semibold text-text-primary">
                                {row.specialtyName || "Sin especificar"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-text-primary">
                              {formatDate(row.weekStart)}
                            </span>
                            <span className="text-xs text-text-subtle">
                              Semana del {row.weekStart}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold ${getCountColor(
                                row.count || 0
                              )}`}
                            >
                              {row.count || 0}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((row.count || 0) /
                                      Math.max(
                                        ...processedData.filteredData.map(
                                          (d) => d.count || 0
                                        )
                                      )) *
                                      100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {row.count > 20 ? (
                              <>
                                <span className="text-green-600">📈</span>
                                <span className="text-sm text-green-600 font-medium">
                                  Alta demanda
                                </span>
                              </>
                            ) : row.count > 10 ? (
                              <>
                                <span className="text-blue-600">📊</span>
                                <span className="text-sm text-blue-600 font-medium">
                                  Normal
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-600">📉</span>
                                <span className="text-sm text-gray-600 font-medium">
                                  Baja demanda
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-primary">
                            {processedData.totalAppointments > 0
                              ? (
                                  ((row.count || 0) /
                                    processedData.totalAppointments) *
                                  100
                                ).toFixed(1)
                              : 0}
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
                  No se encontraron citas para los filtros seleccionados
                </p>
                {(searchTerm || selectedSpecialty !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSpecialty("all");
                    }}
                    className="mt-4 text-primary hover:text-blue-600 font-medium"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sección de estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top especialidades */}
            <div className="card">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span>🏆</span>
                Top especialidades por citas
              </h3>
              <div className="space-y-4">
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
                      <div>
                        <div className="font-medium text-text-primary">
                          {specialty.name}
                        </div>
                        <div className="text-xs text-text-subtle">
                          {(
                            (specialty.count /
                              processedData.totalAppointments) *
                            100
                          ).toFixed(1)}
                          % del total
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-primary">
                        {specialty.count} citas
                      </div>
                      <div className="text-sm text-text-subtle">
                        Promedio:{" "}
                        {Math.round(specialty.count / processedData.totalWeeks)}
                        /semana
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tendencia semanal */}
            <div className="card">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span>📈</span>
                Tendencia semanal
              </h3>
              <div className="space-y-3">
                {processedData.weeklyTrend.slice(-5).map((week, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">
                        Semana {formatDate(week.date)}
                      </span>
                      <span className="font-bold text-primary">
                        {week.count} citas
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (week.count /
                              Math.max(
                                ...processedData.weeklyTrend.map((w) => w.count)
                              )) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* <div className="card">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-text-subtle">
                <span className="font-medium">📊 Análisis:</span> Este reporte
                muestra la distribución de citas por especialidad médica y
                semana. Última actualización: {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition flex items-center gap-2">
                  <span>📋</span>
                  Generar PDF
                </button>
                <button className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition flex items-center gap-2">
                  <span>📧</span>
                  Enviar por email
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </LayoutComponent>
  );
}

export default ReportsCitas;
