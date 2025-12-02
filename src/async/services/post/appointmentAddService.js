import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const appointmentAddService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/appointments`,
    payload,
    "velasco",
    false,
    token
  );
};
export default appointmentAddService;
