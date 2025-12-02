import getEnvVariables from "../../config/config";

const buildApiUri = () => {
  const { ClinicApiServer, ClinicApiServerService } = getEnvVariables();
  return `${ClinicApiServer}/${ClinicApiServerService}`;
};
export default buildApiUri;
