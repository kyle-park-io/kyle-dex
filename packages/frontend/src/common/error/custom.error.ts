export class CustomError extends Error {
  code: string;
  reason: string;
  shortMessage: string;

  constructor(code: string, reason: string | null, shortMessage: string) {
    const message =
      shortMessage.length > 0
        ? shortMessage
        : reason != null && reason.length > 0
          ? reason
          : code;
    super(message);
    this.code = code;
    if (reason === null) {
      this.reason = '';
    } else {
      this.reason = reason;
    }
    this.shortMessage = shortMessage;
    this.name = 'CustomError';
  }
}
