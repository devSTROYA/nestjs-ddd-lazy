import { DomainError, NotFoundError, ValidationError } from '@core/errors';

const TodoErrorCodes = {
  TITLE_TOO_SHORT: 'TITLE_TOO_SHORT',
  ALREADY_COMPLETED: 'TODO_ALREADY_COMPLETED',
  TODO_DOES_NOT_EXIST: 'TODO_DOES_NOT_EXIST',
} as const;

export namespace TodoErrors {
  export class TitleTooShortError extends ValidationError {
    constructor(details: Record<string, unknown>) {
      super(TodoErrorCodes.TITLE_TOO_SHORT, details);
    }
  }

  export class AlreadyCompletedError extends DomainError {
    constructor() {
      super(TodoErrorCodes.ALREADY_COMPLETED);
    }
  }

  export class TodoDoesNotExistError extends NotFoundError {
    constructor() {
      super(TodoErrorCodes.TODO_DOES_NOT_EXIST);
    }
  }
}
