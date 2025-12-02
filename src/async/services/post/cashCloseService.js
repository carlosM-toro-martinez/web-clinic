import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cashCloseService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/cash-register/${payload.cashRegisterId}/close`,
    payload,
    "velasco",
    false,
    token
  );
};
export default cashCloseService;
