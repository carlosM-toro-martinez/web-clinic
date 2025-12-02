import React from "react";
import { useDashboardData } from "../../hocks/useDashboardData";
import MetricsGrid from "../metrics/MetricsGrid";
import TodayAppointments from "../appointments/TodayAppointments";
import CashRegisterSummary from "../cash-register/CashRegisterSummary";
import CashFlowChart from "../cash-register/CashFlowChart";
import RecentMovements from "../cash-register/RecentMovements";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

function Dashboard() {
  const {
    metrics,
    todayAppointments,
    cashRegisterData,
    isLoading,
    isError,
    error,
  } = useDashboardData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)]">
          Inicio
        </h1>
        <p className="text-[color:var(--color-text-subtle)] mt-2">
          Resumen general del sistema
        </p>
      </div>

      {/* Métricas Principales */}
      <MetricsGrid metrics={metrics} />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Citas del Día */}
        <div className="lg:col-span-2 space-y-6">
          <TodayAppointments appointments={todayAppointments} />
          <CashFlowChart data={cashRegisterData} />
        </div>

        {/* Columna 2: Caja y Movimientos */}
        <div className="space-y-6">
          <CashRegisterSummary data={cashRegisterData} />
          <RecentMovements movements={cashRegisterData?.movements || []} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
