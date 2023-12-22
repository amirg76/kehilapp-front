const getEnvVariable = (varName) => {
  const value = import.meta.env[varName];

  if (!value) {
    throw new Error(`${varName} is not defined in .env file`);
  }
  return value;
};

export const getBaseUrl = () => {
  return getEnvVariable("REACT_APP_VITE_REACT_APP_BASE_URL");
};
