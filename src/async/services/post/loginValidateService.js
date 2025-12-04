import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const loginService = async (payload) => {
  return await post(`${buildApiUri()}/v1/auth/validate`, payload, "velasco");
};
export default loginService;
