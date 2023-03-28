export class BotError extends Error {
  public static NAME = "BotError";
  public static defaultMessage = "Oops... Something went wrong.";
  public isBotError = true;
  public name = BotError.NAME;
  public internalOnly: boolean = false;
  constructor(message?: string) {
    super(message ?? BotError.defaultMessage);
  }
}

export class InternalError extends BotError {
  public static NAME = "InternalError";
  public static defaultMessage = BotError.defaultMessage;
  public name = InternalError.NAME;
  constructor(message?: string) {
    super(message ?? InternalError.defaultMessage);
    this.internalOnly = true;
  }
}

export class ArgumentError extends BotError {
  public static NAME = "ArgumentError";
  public static defaultMessage = "Sorry, I didn't understand that... @_@\nTry checking the command arguments";
  public name = ArgumentError.NAME;
  constructor(message?: string) {
    super(message ?? ArgumentError.defaultMessage);
  }
}

export class UserPermissionError extends BotError {
  public static NAME = "UserPermissionError";
  public static defaultMessage = "You aren't allowed to do that :c";
  public name = UserPermissionError.NAME;
  constructor(message?: string) {
    super(message ?? UserPermissionError.defaultMessage);
  }
}

export class BotPermissionError extends BotError {
  public static NAME = "BotPermissionError";
  public static defaultMessage = "I'm not allowed to do that >_>";
  public name = BotPermissionError.NAME;
  constructor(message?: string) {
    super(message ?? BotPermissionError.defaultMessage);
  }
}
