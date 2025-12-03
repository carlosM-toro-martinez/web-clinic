import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const specialtyAddFeeService = async (payload, token, specialtyId) => {
  console.log(payload, token, specialtyId);

  return await post(
    `${buildApiUri()}/v1/specialties/${specialtyId}/fees`,
    payload,
    "velasco",
    false,
    token
  );
};
export default specialtyAddFeeService;
