import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const patientAppointmentsService = async (patientId) => {
  return await get(
    `${buildApiUri()}/v1/appointments/patient/${patientId}`,
    undefined,
    "velasco"
  );
};
export default patientAppointmentsService;
