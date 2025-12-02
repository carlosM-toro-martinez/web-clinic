import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const pacientesService = async () => {
  return await get(`${buildApiUri()}/v1/patients`, undefined, "velasco");
};
export default pacientesService;
