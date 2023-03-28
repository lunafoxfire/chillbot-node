import { isDev } from "util/env";

export const userIds = {
  LydianLights: "84034036791513088",
  Chillbot: isDev ? "246040396247859213" : "245722865406574592",
  VictoriaBot: "928832019474047066",
};

export const guildIds = {
  ChillBros: isDev ? "91644422768312320" : "186014599798063104",
  _dev_: "91644422768312320",
};


export const roleIds = {
  Bro: isDev ? "955917253692502056" : "232608784093020161",
  UniqueRolePlaceholder: isDev ? "955754844067618878" : "955748617749147698",
};

export const channelIds = {
  BotSpam: "955950801157779477",
};

export const emojiIds = {
  CoffeeCat: "<:coffeecat:673288186960805889>",
  Butt: "<:butt:712579657479880755>",
};

export const botSpamChannels = [
  channelIds.BotSpam,
];
