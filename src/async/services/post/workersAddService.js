import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const workersAddService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/auth/register`,
    payload,
    "velasco",
    false,
    token
  );
};
export default workersAddService;
