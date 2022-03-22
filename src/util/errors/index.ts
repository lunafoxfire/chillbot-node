export class BotError extends Error {
  public static NAME = 'BotError';
  public static defaultMessage = "Oops... I just don't know what went wrong.";
  public isBotError = true;
  public name = BotError.NAME;
  public internalOnly: boolean = false;
  constructor(message?: string, internalOnly?: boolean) {
    super(message || BotError.defaultMessage);
    this.internalOnly = !!internalOnly;
  }
}

export class ArgumentError extends BotError {
  public static NAME = 'ArgumentError';
  public static defaultMessage = "Sorry, I didn't understand that... @_@\nTry checking the command arguments";
  public name = ArgumentError.NAME;
  constructor(message?: string) {
    super(message || ArgumentError.defaultMessage);
  }
}

export class UserPermissionError extends BotError {
  public static NAME = 'UserPermissionError';
  public static defaultMessage = "I can't let you do that c:";
  public name = UserPermissionError.NAME;
  constructor(message?: string) {
    super(message || UserPermissionError.defaultMessage);
  }
}

export class BotPermissionError extends BotError {
  public static NAME = 'BotPermissionError';
  public static defaultMessage = "I'm not allowed to do that >_>";
  public name = BotPermissionError.NAME;
  constructor(message?: string) {
    super(message || BotPermissionError.defaultMessage);
  }
}
