import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('user_data', (table) => {
    table.string('unique_role').nullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('user_data', (table) => {
    table.dropColumn('unique_role');
  });
}
