import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const specialtiesService = async () => {
  return await get(`${buildApiUri()}/v1/specialties`, undefined, "velasco");
};
export default specialtiesService;
