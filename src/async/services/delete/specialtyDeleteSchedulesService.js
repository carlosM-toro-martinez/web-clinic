import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const specialtyDeleteSchedulesService = async (
  scheduleIds,
  token,
  specialtyId,
) => {
  return await remove(
    `${buildApiUri()}/v1/specialties/${specialtyId}/schedules`,
    scheduleIds,
    "velasco",
    false,
    token,
  );
};

export default specialtyDeleteSchedulesService;
