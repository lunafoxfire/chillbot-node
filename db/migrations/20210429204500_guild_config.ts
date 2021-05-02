import * as Knex from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('guild_data', (table) => {
    table.jsonb('config').defaultTo('{}');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('guild_data', (table) => {
    table.dropColumn('config');
  });
}
