import DB from 'db';

type UserDataSelector = {
  user_id: string,
  guild_id: string,
};

type UserTableData = {
  id: number,
  user_id: string,
  guild_id: string,
  doot_dollars: number,
  anime_count: number,
  unique_role: string | null,
};

// TODO: One day, add returned columns as a param :p
export default class UserData {
  public static table = 'user_data';

  public static async findOrCreate({ user_id, guild_id }: UserDataSelector): Promise<UserTableData> {
    let userData = await DB.knex(UserData.table)
      .where({ user_id, guild_id })
      .select()
      .first('*');
    if (!userData) {
      [userData] = await DB.knex(UserData.table)
        .insert({ user_id, guild_id })
        .returning('*');
    }
    return userData;
  }

  public static async incrementAnime({ user_id, guild_id }: UserDataSelector): Promise<UserTableData> {
    const userData = await UserData.findOrCreate({ user_id, guild_id });
    const [updatedData] = await DB.knex(UserData.table)
      .where({ user_id, guild_id })
      .update({
        anime_count: userData.anime_count + 1,
      })
      .returning('*');
    return updatedData;
  }

  public static async setUniqueRole({ user_id, guild_id }: UserDataSelector, roleId: string | null): Promise<UserTableData> {
    await UserData.findOrCreate({ user_id, guild_id });
    const [updatedData] = await DB.knex(UserData.table)
      .where({ user_id, guild_id })
      .update({
        unique_role: roleId,
      })
      .returning('*');
    return updatedData;
  }
}
