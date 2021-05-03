import knexConfig from 'knex';
import { createLogger } from 'util/logger';
import { isTruthy } from 'util/string';
import { knexSettings } from '../../knexfile';

const logger = createLogger('db');

export default class DB {
  public static knex: knexConfig;

  public static async init() {
    logger.info('Connecting to database...');
    const connection = process.env.DATABASE_URL
      ? {
        uri: process.env.DATABASE_URL,
      }
      : {
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
      };
    DB.knex = knexConfig({
      client: 'pg',
      connection: {
        ...connection,
        ssl: isTruthy(process.env.PG_SSL),
      },
      pool: { min: 0, max: 7 },
      debug: isTruthy(process.env.KNEX_DEBUG),
    });
    await DB.knex.raw("SELECT 'connection test';");
    logger.info('Running migrations...');
    await DB.knex.migrate.latest(knexSettings.migrations);
    logger.info('Database ready!');
  }
}
