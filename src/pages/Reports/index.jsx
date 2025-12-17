import React from "react";
import LayoutComponent from "../../components/LayoutComponent";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";

function Reports() {
  return (
    <LayoutComponent>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full mx-auto">
          <div className="card text-center p-10 space-y-8 shadow-lg border-0">
            {/* Icono decorativo */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[var(--color-accent-blue-light)] to-blue-50 blur-xl opacity-70"></div>
              </div>
              <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-blue-400 w-24 h-24 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <BarChart3 className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>

            {/* Contenido principal */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                Informes en camino
                <span className="block text-2xl text-[var(--color-primary)] mt-2">
                  🚀
                </span>
              </h1>

              <p className="text-lg text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
                Estamos preparando una experiencia de análisis completa con
                visualizaciones detalladas y métricas en tiempo real para que
                tomes mejores decisiones.
              </p>
            </div>

            {/* Características próximas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="space-y-3 p-4 rounded-xl bg-[var(--color-accent-blue-light)] border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  Tendencias
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Análisis de crecimiento y patrones
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-[var(--color-surface-variant)] border border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  Dashboards
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Paneles personalizables
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-[var(--color-accent-blue-light)] border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto">
                  <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  Históricos
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Comparativas temporales
                </p>
              </div>
            </div>

            {/* Badge de estado */}
            <div className="pt-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
                <span className="text-sm font-medium text-[var(--color-primary)]">
                  Disponible próximamente
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}

export default Reports;
