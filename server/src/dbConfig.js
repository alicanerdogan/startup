const baseConfig = {
  client: "pg",
  version: "12",
  connection: {
    host: "127.0.0.1",
    port: 5400,
    user: "postgres",
    password: "postgres",
    database: "nails-db"
  },
  migrations: {
    tableName: "knex_migrations",
    extension: "ts"
  },
  pool: { min: 3, max: 7 }
};

const development = baseConfig;

let productionConfig = {};
if (process.env.NODE_ENV === "production") {
  productionConfig = require("./config.prod.json");
}

const production = {
  ...baseConfig,
  connection: {
    ...baseConfig.connection,
    database: productionConfig.db,
    port: productionConfig.db_port,
    host: productionConfig.db_address,
    user: productionConfig.db_username,
    password: productionConfig.db_password
  }
};
const test = {
  ...baseConfig,
  connection: {
    ...baseConfig.connection,
    database: `${baseConfig.connection.database}-test`
  }
};

module.exports = { ...baseConfig, development, production, test };
