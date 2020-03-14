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
const production = {
  ...baseConfig,
  connection: {
    ...baseConfig.connection,
    database: "dbstaging",
    port: 5432,
    host: "dbstaging.clzm35vzwxtv.eu-central-1.rds.amazonaws.com",
    user: "tinfra",
    password: "tinfratinfra"
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
