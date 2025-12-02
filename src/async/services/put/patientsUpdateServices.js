import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const patientsUpdateServices = async (payload, token, idPatient) => {
  return await put(
    `${buildApiUri()}/v1/patients/${idPatient}`,
    payload,
    "velasco",
    false,
    token
  );
};
export default patientsUpdateServices;
