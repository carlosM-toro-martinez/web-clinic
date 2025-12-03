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

  // if (isError) {
  //   return <ErrorMessage error={error} />;
  // }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)]">
          Inicio
        </h1>
        <p className="text-[color:var(--color-text-subtle)] mt-2">
          Resumen general del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayAppointments appointments={todayAppointments} />
        </div>
        <MetricsGrid metrics={metrics} />

        {/* <div className="space-y-6">
          <RecentMovements movements={cashRegisterData?.movements || []} />
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;
