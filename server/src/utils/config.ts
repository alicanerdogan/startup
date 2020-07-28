function getLocalConfig() {
  try {
    return require("./../config.dev.json");
  } catch (error) {
    return {};
  }
}

export function getConfig() {
  const config = {
    port: 3000,
    ...getLocalConfig(),
  };
  if (process.env.NODE_ENV === "production") {
    return require("./../config.prod.json");
  }
  return config;
}

export function getSecrets() {
  const secret = require("./../../secret.json");
  return secret;
}
