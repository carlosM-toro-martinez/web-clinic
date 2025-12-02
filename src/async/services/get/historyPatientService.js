import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const historyPatientService = async (idPatient) => {
  return await get(
    `${buildApiUri()}/v1/history-entries/patient/${idPatient}/history`,
    undefined,
    "velasco"
  );
};
export default historyPatientService;
