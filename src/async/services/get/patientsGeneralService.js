import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const patientsGeneralService = async () => {
  return await get(
    `${buildApiUri()}/v1/reports/patients-general`,
    undefined,
    "velasco"
  );
};

export default patientsGeneralService;
