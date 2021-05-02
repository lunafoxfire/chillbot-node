export class BotError extends Error {
  public static NAME = 'BotError';
  public name = BotError.NAME;
  public internalOnly: boolean = false;
  public static defaultMessage = "Oops... I just don't know what went wrong.";
  constructor(message?: string) {
    super(message || BotError.defaultMessage);
  }
}

export class ArgumentError extends BotError {
  public static NAME = 'ArgumentError';
  public name = ArgumentError.NAME;
  public static defaultMessage = "Sorry, I didn't understand that @_@ Are some arguments missing?";
  constructor(message?: string) {
    super(message || ArgumentError.defaultMessage);
  }
}

export class UserPermissionError extends BotError {
  public static NAME = 'UserPermissionError';
  public name = UserPermissionError.NAME;
  public static defaultMessage = "I can't let you do that c:";
  constructor(message?: string) {
    super(message || UserPermissionError.defaultMessage);
  }
}

export class BotPermissionError extends BotError {
  public static NAME = 'BotPermissionError';
  public name = BotPermissionError.NAME;
  public static defaultMessage = "I'm not allowed to do that >_>";
  constructor(message?: string) {
    super(message || BotPermissionError.defaultMessage);
  }
}
