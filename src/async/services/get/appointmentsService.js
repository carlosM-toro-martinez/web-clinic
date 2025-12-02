import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const appointmentsService = async () => {
  return await get(`${buildApiUri()}/v1/appointments`, undefined, "velasco");
};
export default appointmentsService;
