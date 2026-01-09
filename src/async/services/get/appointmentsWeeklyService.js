import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const appointmentsWeeklyService = async (startDate, endDate) => {
  const params = [];
  if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
  if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);
  const qs = params.length ? `?${params.join("&")}` : "";
  return await get(
    `${buildApiUri()}/v1/reports/appointments-weekly${qs}`,
    undefined,
    "velasco"
  );
};

export default appointmentsWeeklyService;
