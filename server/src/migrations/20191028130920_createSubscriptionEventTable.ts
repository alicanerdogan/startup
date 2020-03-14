import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("subscription_events", table => {
    table
      .bigIncrements("id")
      .unique()
      .primary()
      .notNullable();
    table.bigInteger("user_id").notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users");
    table.json("event_type").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("subscription_events");
}
