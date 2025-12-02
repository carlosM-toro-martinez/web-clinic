import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const doctorsService = async () => {
  return await get(`${buildApiUri()}/v1/users/doctors`, undefined, "velasco");
};
export default doctorsService;
