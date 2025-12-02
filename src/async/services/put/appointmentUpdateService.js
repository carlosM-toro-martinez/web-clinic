import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const appointmentUpdateService = async (payload, token) => {
  return await put(
    `${buildApiUri()}/v1/appointments/${payload.id}`,
    payload,
    "velasco",
    false,
    token
  );
};

export default appointmentUpdateService;
