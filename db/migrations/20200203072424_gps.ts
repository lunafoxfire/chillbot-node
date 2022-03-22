import { Knex } from 'knex';


export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('guild_data', (table) => {
    table.increments('id');
    table.string('guild_id').notNullable().unique();
    table.jsonb('space_engineers_gps').defaultTo('[]');
  });
}


export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('guild_data');
}
