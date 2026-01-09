import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cashRegisterAllService = async () => {
  return await get(
    `${buildApiUri()}/v1/cash-register/all`,
    undefined,
    "velasco"
  );
};
export default cashRegisterAllService;
