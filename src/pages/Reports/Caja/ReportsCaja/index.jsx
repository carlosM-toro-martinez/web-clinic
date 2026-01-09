// ReportsCaja.jsx
import React, { useState } from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import cashRegisterAllService from "../../../async/services/get/cashRegisterAllService";

// Hooks
import { useCashData } from "./hooks/useCashData";
import { useDateUtils } from "./hooks/useDateUtils";

// Components
import SummaryCards from "./components/SummaryCards";
import DateSelector from "./components/DateSelector";
import DayView from "./components/DayView";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import CashRegisterHistory from "./components/CashRegisterHistory";

// Loading and Error components
import { LoadingState, ErrorState } from "./components/StatusStates";

function ReportsCaja() {
  const navigate = useNavigate();

  // Usar el hook de utilidades de fecha
  const { getTodayDateString, formatCurrency, formatDate } = useDateUtils();

  // Estado
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [viewMode, setViewMode] = useState("day");

  // Fetch data
  const {
    data: cajaResponse,
    isLoading: isLoadingCaja,
    isError: isErrorCaja,
    error: errorCaja,
    refetch: refetchCaja,
  } = useQuery({
    queryKey: ["cashRegisterAll"],
    queryFn: cashRegisterAllService,
  });

  // Procesar datos
  const { processedData, rawData } = useCashData(cajaResponse, selectedDate);

  // Estados de carga y error
  if (isLoadingCaja) {
    return (
      <LayoutComponent>
        <LoadingState />
      </LayoutComponent>
    );
  }

  if (isErrorCaja) {
    return (
      <LayoutComponent>
        <ErrorState error={errorCaja} onRetry={refetchCaja} />
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          {/* Header */}
          <Header onBack={() => navigate("/reportes")} />

          {/* Summary Cards */}
          <SummaryCards
            processedData={processedData}
            formatCurrency={formatCurrency}
          />

          {/* Date Selector */}
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            formatDate={formatDate}
          />

          {/* Day View (always shown) */}
          <DayView
            selectedDate={selectedDate}
            processedData={processedData}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />

          {/* Conditional Views */}
          <ConditionalView
            viewMode={viewMode}
            processedData={processedData}
            formatCurrency={formatCurrency}
          />

          {/* Cash Register History */}
          <CashRegisterHistory
            cashRegisters={rawData}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </LayoutComponent>
  );
}

// Componentes auxiliares pequeños
const Header = ({ onBack }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        💰 Reporte de Caja
      </h1>
      <p className="text-text-subtle">Flujo de caja por día, semana y mes</p>
    </div>
    <button
      onClick={onBack}
      className="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-surface-variant transition self-start"
    >
      ← Volver a Reportes
    </button>
  </div>
);

const ConditionalView = ({ viewMode, processedData, formatCurrency }) => {
  switch (viewMode) {
    case "week":
      return (
        <WeekView
          weeklyStats={processedData?.weeklyStats || []}
          last7Weeks={processedData?.last7Weeks || []}
          formatCurrency={formatCurrency}
        />
      );
    case "month":
      return (
        <MonthView
          monthlyStats={processedData?.monthlyStats || []}
          last6Months={processedData?.last6Months || []}
          formatCurrency={formatCurrency}
        />
      );
    default:
      return null;
  }
};

export default ReportsCaja;
