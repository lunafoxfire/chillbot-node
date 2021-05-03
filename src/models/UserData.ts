import DB from 'db';

interface UserDataSelector {
  user_id: string;
  guild_id: string;
}

export default class UserData {
  public static table = 'user_data';

  public static async findOrCreate({ user_id, guild_id }: UserDataSelector) {
    // TODO: find out how to do this properly in postgres
    let userData = await DB.knex(UserData.table)
      .where({ user_id, guild_id })
      .select()
      .first();
    if (!userData) {
      [userData] = await DB.knex(UserData.table)
        .insert({ user_id, guild_id })
        .returning('*');
    }
    return userData;
  }

  public static async incrementAnime({ user_id, guild_id }: UserDataSelector) {
    const userData = await UserData.findOrCreate({ user_id, guild_id });
    const [updatedData] = await DB.knex(UserData.table)
      .where({ user_id, guild_id })
      .update({
        anime_count: userData.anime_count + 1,
      })
      .returning('*');
    return updatedData;
  }
}
