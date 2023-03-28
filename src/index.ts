import "config";
import DB from "db";
import Bot from "bot";

void (async () => {
  try {
    await DB.init();
    await Bot.init();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(-1);
  }
})();
