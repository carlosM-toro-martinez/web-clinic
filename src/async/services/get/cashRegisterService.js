import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cashRegisterService = async () => {
  return await get(`${buildApiUri()}/v1/cash-register`, undefined, "velasco");
};
export default cashRegisterService;
