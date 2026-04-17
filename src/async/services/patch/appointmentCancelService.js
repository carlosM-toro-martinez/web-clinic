import { patch } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const appointmentCancelService = async (appointmentId, reason, token) => {
  const payload = reason ? { reason } : undefined;

  return await patch(
    `${buildApiUri()}/v1/appointments/${appointmentId}/cancel`,
    payload,
    "velasco",
    false,
    token,
  );
};

export default appointmentCancelService;
