export const userIds = {
  LydianLights: '84034036791513088',
  Chillbot: process.env.NODE_ENV === 'development' ? '246040396247859213' : '245722865406574592',
  VictoriaBot: '928832019474047066',
};

export const guildIds = {
  ChillBros: process.env.NODE_ENV === 'development' ? '91644422768312320' : '186014599798063104',
};


export const roleIds = {
  Bro: process.env.NODE_ENV === 'development' ? '955917253692502056' : '232608784093020161',
  UniqueRolePlaceholder: process.env.NODE_ENV === 'development' ? '955754844067618878' : '955748617749147698',
};

export const channelIds = {
  BotSpam: '955950801157779477',
};

export const emojiIds = {
  CoffeeCat: '<:coffeecat:673288186960805889>',
  Butt: '<:butt:712579657479880755>',
};

// TODO: add this to guild config
export const botSpamChannels = [
  channelIds.BotSpam,
];
