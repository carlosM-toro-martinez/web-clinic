import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const createCashRegisterService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/cash-register`,
    payload,
    "velasco",
    false,
    token
  );
};
export default createCashRegisterService;
