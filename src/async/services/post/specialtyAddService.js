import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const specialtyAddService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/specialties`,
    payload,
    "velasco",
    false,
    token
  );
};
export default specialtyAddService;
