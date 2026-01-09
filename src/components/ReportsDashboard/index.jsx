import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportsDashboard = () => {
  const [activeReport, setActiveReport] = useState(null);
  const navigate = useNavigate();

  const reports = [
    {
      id: 1,
      title: "Pacientes por diagnóstico",
      description: "Distribución de pacientes según diagnóstico",
      category: "Diagnósticos",
      icon: "📊",
      route: "/reportes/diagnosticos",
    },
    {
      id: 2,
      title: "Citas semanales",
      description: "Análisis de citas por especialidad",
      category: "Citas",
      icon: "📅",
      route: "/reportes/citas",
    },
    {
      id: 3,
      title: "Estadísticas de pacientes",
      description: "Visión general de pacientes",
      category: "Pacientes",
      icon: "👥",
      route: "/reportes/pacientes",
    },
    {
      id: 4,
      title: "Estadísticas de caja",
      description: "Flujo de caja por día, semana y mes",
      category: "Finanzas",
      icon: "💰",
      route: "/reportes/caja",
    },
  ];

  const handleReportClick = (reportId) => {
    setActiveReport(reportId);
    const report = reports.find((r) => r.id === reportId);
    if (report && report.route) {
      navigate(report.route);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container">
        {/* Header minimalista */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-3">
            Reportes disponibles
          </h1>
          <p className="text-text-subtle text-sm">
            Selecciona el tipo de reporte que deseas visualizar
          </p>
        </div>

        {/* Grid de tarjetas super minimalistas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report.id)}
              className={`group cursor-pointer transition-all duration-200 ${
                activeReport === report.id
                  ? "ring-2 ring-primary ring-opacity-50"
                  : ""
              }`}
            >
              <div className="card hover:shadow-md transition-shadow">
                {/* Imagen/Icono grande */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-4xl">{report.icon}</span>
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-medium text-text-primary text-center mb-2 group-hover:text-primary transition-colors">
                  {report.title}
                </h3>

                {/* Descripción pequeña */}
                <p className="text-sm text-text-subtle text-center leading-relaxed">
                  {report.description}
                </p>

                {/* Indicador visual sutil */}
                <div className="mt-4 pt-3 border-t border-border border-opacity-30">
                  <div className="text-xs text-text-subtle text-center">
                    Haz clic para ver
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer informativo minimalista */}
        <div className="mt-10 text-center">
          <p className="text-sm text-text-subtle">
            Selecciona cualquier reporte para ver información detallada
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
