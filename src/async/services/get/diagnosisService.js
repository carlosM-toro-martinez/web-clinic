import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const diagnosisService = async () => {
  return await get(`${buildApiUri()}/v1/diagnosis`, undefined, "velasco");
};
export default diagnosisService;
