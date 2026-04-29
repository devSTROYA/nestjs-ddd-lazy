import { DomainError, ValidationError } from '@core/errors';
import { NotFoundError } from 'rxjs';

const UserErrorCodes = {
  NAME_TOO_SHORT: 'USER_NAME_TOO_SHORT',
  INVALID_EMAIL_FORMAT: 'USER_INVALID_EMAIL_FORMAT',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  EMAIL_ALREADY_IN_USE: 'USER_EMAIL_ALREADY_IN_USE',
  USER_DOES_NOT_EXIST: 'USER_DOES_NOT_EXIST',
} as const;

export namespace UserErrors {
  export class NameTooShortError extends ValidationError {
    constructor(details: Record<string, unknown>) {
      super(UserErrorCodes.NAME_TOO_SHORT, details);
    }
  }

  export class InvalidEmailFormatError extends ValidationError {
    constructor() {
      super(UserErrorCodes.INVALID_EMAIL_FORMAT);
    }
  }

  export class PasswordTooShortError extends ValidationError {
    constructor(details: Record<string, unknown>) {
      super(UserErrorCodes.PASSWORD_TOO_SHORT, details);
    }
  }

  export class EmailAlreadyInUseError extends DomainError {
    constructor() {
      super(UserErrorCodes.EMAIL_ALREADY_IN_USE);
    }
  }

  export class UserDoesNotExistError extends NotFoundError {
    constructor() {
      super(UserErrorCodes.USER_DOES_NOT_EXIST);
    }
  }
}
