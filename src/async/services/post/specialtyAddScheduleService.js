import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const specialtyAddScheduleService = async (payload, token, specialtyId) => {
  console.log(payload, token, specialtyId);

  return await post(
    `${buildApiUri()}/v1/specialties/${specialtyId}/schedules`,
    payload,
    "velasco",
    false,
    token
  );
};
export default specialtyAddScheduleService;
