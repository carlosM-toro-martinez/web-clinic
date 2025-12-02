const parseEnvNumber = (envVar) => {
  const envVarValue = parseInt(import.meta.env[envVar]);
  if (isNaN(envVarValue)) {
    throw new Error(`Environment variable ${envVar} is not a number`);
  }
  return envVarValue;
};

const parseEnvString = (envVar) => {
  const envVarValue = import.meta.env[envVar];
  if (!envVarValue) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
  return envVarValue;
};

const parseEnvBoolean = (envVar) => {
  const envVarValue = import.meta.env[envVar];
  if (!envVarValue) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
  return envVarValue === "true";
};

const getEnvVariables = () => {
  const ClinicApiServer = parseEnvString("VITE_CLINIC_API");
  const ClinicApiServerService = parseEnvString("VITE_CLINIC_API_SERVICE");
  const nodeEnv = import.meta.env.MODE || "development";
  return {
    nodeEnv,
    ClinicApiServer,
    ClinicApiServerService,
  };
};

export default getEnvVariables;
