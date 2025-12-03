import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const doctorsAppointmentsService = async (doctorId) => {
  console.log(doctorId);

  return await get(
    `${buildApiUri()}/v1/appointments/doctors?doctorId=${doctorId}`,
    undefined,
    "velasco"
  );
};
export default doctorsAppointmentsService;
