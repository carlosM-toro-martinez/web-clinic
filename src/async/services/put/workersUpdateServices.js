import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const workersUpdateServices = async (payload, token, idWorker) => {
  console.log("payload", payload);
  return await put(
    `${buildApiUri()}/v1/users/${idWorker}`,
    payload,
    "velasco",
    false,
    token,
  );
};
export default workersUpdateServices;
