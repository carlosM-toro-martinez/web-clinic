const getHeaders = (tenantId, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const buildOptions = (payload, method, isFile, tenantId, token = null) => {
  const options = {
    method,
    headers: isFile
      ? {
          "x-tenant-id": tenantId,
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      : getHeaders(tenantId, token),
  };

  if (method === "POST" || method === "PUT" || method === "DELETE") {
    options["body"] = isFile ? payload : JSON.stringify(payload);
  }

  return options;
};

const request = async (
  endpoint,
  payload,
  method,
  isFile,
  tenantId = "clinic-default",
  token = null
) => {
  const options = buildOptions(payload, method, isFile, tenantId, token);
  const response = await fetch(endpoint, options);

  if (response.ok) {
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(response);
      return error;
    }
  } else {
    throw response.status;
  }
};

export const post = async (
  endpoint,
  payload,
  tenantId = "clinic-default",
  isFile = false,
  token = null
) => request(endpoint, payload, "POST", isFile, tenantId, token);

export const get = async (
  endpoint,
  payload,
  tenantId = "clinic-default",
  isFile = false,
  token = null
) => request(endpoint, payload, "GET", isFile, tenantId, token);

export const put = async (
  endpoint,
  payload,
  tenantId = "clinic-default",
  isFile = false,
  token = null
) => request(endpoint, payload, "PUT", isFile, tenantId, token);

export const remove = async (
  endpoint,
  payload,
  tenantId = "clinic-default",
  isFile = false,
  token = null
) => request(endpoint, payload, "DELETE", isFile, tenantId, token);
