export class ZeusWidgetError extends Error {
  public originalError?: Error;

  constructor(message: string, originalError?: Error | string) {
    super(message);
    this.name = "ZeusWidgetError";
    this.originalError =
      originalError instanceof Error ? originalError : new Error(originalError);
  }
}

export class DepositError extends ZeusWidgetError {
  constructor(originalError?: string | Error) {
    super("Deposit failed. Please try again.", originalError);
    this.name = "DepositError";
  }
}

export class WithdrawError extends ZeusWidgetError {
  constructor(originalError?: string | Error) {
    super("Withdrawal failed. Please try again.", originalError);
    this.name = "WithdrawError";
  }
}

export class ApolloAccountCreationError extends ZeusWidgetError {
  constructor(originalError?: string | Error) {
    super("Failed to create Apollo account. Please try again.", originalError);
    this.name = "ApolloAccountCreationError";
  }
}

export class WalletConnectionError extends ZeusWidgetError {
  constructor(originalError?: string | Error) {
    super(
      "Failed to connect to wallet. Please check your wallet connection.",
      originalError,
    );
    this.name = "WalletConnectionError";
  }
}

export class ClientRequestError extends ZeusWidgetError {
  constructor(
    public readonly client: string,
    originalError?: string | Error,
  ) {
    super("Client request failed. Please try again.", originalError);
    this.name = "ClientRequestError";
  }
}
