import knex from "knex";
import dbConfig from "./dbConfig.js";

export const dbConn = knex(dbConfig);

export async function closeDBConnection() {
  await dbConn.destroy();
}

export async function resetDB() {
  const isTestEnvironment = process.env.NODE_ENV === "test";
  if (!isTestEnvironment) {
    throw new Error("Do not reset database on environments other than test");
  }

  const query =
    "SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?";

  const bindings = [dbConn.client.database()];

  const tables: string[] = await dbConn
    .raw(query, bindings)
    .then(results => results.rows.map((row: any) => row.table_name));

  let tablesToBeDeleted = tables.filter(
    tableName =>
      !["knex_migrations", "knex_migrations_lock"].includes(tableName)
  );

  while (tablesToBeDeleted.length > 0) {
    const newTablesToBeDeleted: string[] = [];
    await Promise.all(
      tablesToBeDeleted.map(tableName =>
        dbConn
          .table(tableName)
          .delete()
          .then(undefined, () => {
            //If the table is failed to be deleted beacuse of a foreign key,
            // try to remove again once the dependency removed
            newTablesToBeDeleted.push(tableName);
          })
      )
    );
    tablesToBeDeleted = newTablesToBeDeleted;
  }
}
