const getEnvVariable = (varName) => {
  let value = import.meta.env[varName];

  if (!value) {
    throw new Error(`${varName} is not defined in .env file`);
  }
  return value;
};

export const getBaseUrl = () => {
  if (import.meta.env.NODE_ENV === "production") {
    return getEnvVariable("http://dev-api.weunity.net/");
  }
  return getEnvVariable("VITE_REACT_APP_BASE_URL");
};
