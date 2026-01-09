// hooks/useCashData.js
import { useMemo } from "react";
import { processCashData } from "../utils/cashDataProcessor";

export const useCashData = (cajaResponse, selectedDate) => {
  const processedData = useMemo(() => {
    if (!cajaResponse?.data) return null;
    return processCashData(cajaResponse, selectedDate);
  }, [cajaResponse, selectedDate]);

  const isLoading = !cajaResponse;
  const isError = cajaResponse?.ok === false;

  return {
    processedData,
    isLoading,
    isError,
    rawData: cajaResponse?.data || [],
  };
};
