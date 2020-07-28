import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema
    .createTable("users", function (table) {
      table
        .uuid("id")
        .notNullable()
        .unique()
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("email").notNullable().index().unique();
      table.string("provider");
      table.text("password_hash");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
    .then();
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("users").then();
}
