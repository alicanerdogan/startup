import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema
    .createTable("users", function(table) {
      table
        .bigIncrements("id")
        .notNullable()
        .unique()
        .primary();
      table
        .string("email")
        .notNullable()
        .index()
        .unique();
      table.text("password_hash").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
    .then();
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("users").then();
}
