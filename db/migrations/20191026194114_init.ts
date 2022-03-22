import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_data', (table) => {
    table.increments('id');
    table.string('user_id').notNullable();
    table.string('guild_id').notNullable();
    table.integer('doot_dollars').defaultTo(0);
    table.integer('anime_count').defaultTo(0);
    table.integer('taco_baco_count').defaultTo(0);
    table.unique(['user_id', 'guild_id']);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_data');
}
