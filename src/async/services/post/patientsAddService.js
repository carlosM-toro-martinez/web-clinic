import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const patientsAddService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/patients`,
    payload,
    "velasco",
    false,
    token,
  );
};
export default patientsAddService;
