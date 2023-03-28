import { type Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("user_data", (table) => {
    table.jsonb("inventory").defaultTo("[]");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("user_data", (table) => {
    table.dropColumn("inventory");
  });
}
