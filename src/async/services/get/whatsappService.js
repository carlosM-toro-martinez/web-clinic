import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const whatsappService = async () => {
  return await get(
    `${buildApiUri()}/v1/whatsapp/pending`,
    undefined,
    "velasco",
  );
};

export default whatsappService;
