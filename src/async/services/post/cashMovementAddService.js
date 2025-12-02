import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cashMovementAddService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/cash-movement`,
    payload,
    "velasco",
    false,
    token
  );
};
export default cashMovementAddService;
