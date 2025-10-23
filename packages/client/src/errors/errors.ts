export class WidgetError extends Error {
  public originalError?: Error;

  constructor(message: string, originalError?: Error | string) {
    super(message);
    this.name = "WidgetError";
    this.originalError =
      originalError instanceof Error ? originalError : new Error(originalError);
  }
}

export class DepositError extends WidgetError {
  constructor(originalError?: string | Error) {
    super("Deposit failed. Please try again.", originalError);
    this.name = "DepositError";
  }
}

export class WithdrawError extends WidgetError {
  constructor(originalError?: string | Error) {
    super("Withdrawal failed. Please try again.", originalError);
    this.name = "WithdrawError";
  }
}

export class ApolloAccountCreationError extends WidgetError {
  constructor(originalError?: string | Error) {
    super("Failed to create Apollo account. Please try again.", originalError);
    this.name = "ApolloAccountCreationError";
  }
}

export class WalletConnectionError extends WidgetError {
  constructor(originalError?: string | Error) {
    super(
      "Failed to connect to wallet. Please check your wallet connection.",
      originalError,
    );
    this.name = "WalletConnectionError";
  }
}

export class ClientRequestError extends WidgetError {
  constructor(
    public readonly client: string,
    originalError?: string | Error,
  ) {
    super("Client request failed. Please try again.", originalError);
    this.name = "ClientRequestError";
  }
}

export class SupportWalletError extends WidgetError {
  constructor(originalError?: string | Error) {
    super(
      "The connected wallet does not support the required features. Please use a compatible wallet.",
      originalError,
    );
    this.name = "SupportWalletError";
  }
}
