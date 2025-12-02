// src/hooks/useDashboardData.js
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  calculateMetrics,
  filterTodayAppointments,
} from "../utils/dashboardCalculations";
import cashRegisterService from "../async/services/get/cashRegisterService";
import appointmentsService from "../async/services/get/appointmentsService";

export const useDashboardData = () => {
  // OCP - Open/Closed Principle: Fácil de extender con nuevas queries
  const cashRegisterQuery = useQuery({
    queryKey: ["cashRegister"],
    queryFn: cashRegisterService,
  });

  const appointmentsQuery = useQuery({
    queryKey: ["appointments"],
    queryFn: appointmentsService,
  });

  const isLoading = cashRegisterQuery.isLoading || appointmentsQuery.isLoading;
  const isError = cashRegisterQuery.isError || appointmentsQuery.isError;
  const error = cashRegisterQuery.error || appointmentsQuery.error;

  // ISP - Interface Segregation: Cada cálculo tiene su responsabilidad
  const metrics = useMemo(
    () => calculateMetrics(appointmentsQuery.data, cashRegisterQuery.data),
    [appointmentsQuery.data, cashRegisterQuery.data]
  );

  const todayAppointments = useMemo(
    () => filterTodayAppointments(appointmentsQuery.data),
    [appointmentsQuery.data]
  );

  return {
    metrics,
    todayAppointments,
    cashRegisterData: cashRegisterQuery.data,
    isLoading,
    isError,
    error,
    refetch: () => {
      cashRegisterQuery.refetch();
      appointmentsQuery.refetch();
    },
  };
};
