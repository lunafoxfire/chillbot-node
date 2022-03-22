import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('user_data', (table) => {
    table.dropColumn('taco_baco_count');
    table.dropColumn('inventory');
  });

  await knex.schema.table('guild_data', (table) => {
    table.dropColumn('space_engineers_gps');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('user_data', (table) => {
    table.integer('taco_baco_count').defaultTo(0);
    table.jsonb('inventory').defaultTo('[]');
  });

  await knex.schema.table('guild_data', (table) => {
    table.jsonb('space_engineers_gps').defaultTo('[]');
  });
}
