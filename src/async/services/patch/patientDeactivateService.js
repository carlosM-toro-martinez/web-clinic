import { patch } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const patientDeactivateService = async (patientId, token) => {
  return await patch(
    `${buildApiUri()}/v1/patients/${patientId}/deactivate`,
    undefined,
    "velasco",
    false,
    token,
  );
};

export default patientDeactivateService;
