import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const whatsappSendService = async (payload, token) => {
  return await post(
    `${buildApiUri()}/v1/whatsapp/send`,
    payload,
    "velasco",
    false,
    token,
  );
};

export default whatsappSendService;
