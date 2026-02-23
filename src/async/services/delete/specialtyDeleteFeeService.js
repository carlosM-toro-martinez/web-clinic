import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const specialtyDeleteFeeService = async (feeId, token, specialtyId) => {
  return await remove(
    `${buildApiUri()}/v1/specialties/${specialtyId}/fees/${feeId}`,
    undefined,
    "velasco",
    false,
    token,
  );
};

export default specialtyDeleteFeeService;
