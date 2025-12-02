import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const workersService = async () => {
  return await get(`${buildApiUri()}/v1/users`, undefined, "velasco");
};
export default workersService;
