import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const patientsByDiagnosisService = async () => {
  return await get(
    `${buildApiUri()}/v1/reports/patients-by-diagnosis`,
    undefined,
    "velasco"
  );
};

export default patientsByDiagnosisService;
