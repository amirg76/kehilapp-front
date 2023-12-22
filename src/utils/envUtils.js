const getEnvVariable = (varName) => {
  console.log(varName);
  let value = import.meta.env[varName];
  console.log("DEV:" + value);
  if (process.env.NODE_ENV === "production") {
    value = process.env[varName];
    console.log("PROD" + value);
  }

  if (!value) {
    throw new Error(`${varName} is not defined in .env file`);
  }
  return value;
};

export const getBaseUrl = () => {
  return getEnvVariable("VITE_REACT_APP_BASE_URL");
};
