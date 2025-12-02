import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const historyAddService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/history-entries`,
    payload,
    "velasco",
    false,
    token
  );
};
export default historyAddService;
