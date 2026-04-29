import { DomainError, NotFoundError, ValidationError } from '@core/errors';
import { Result } from '@core/functional-programming';
import { Command as BaseCommand } from '@nestjs/cqrs';

export type CommandResult = Result<void, ValidationError | NotFoundError | DomainError | Error>;

export class Command extends BaseCommand<CommandResult> {
  constructor(readonly todoId: string) {
    super();
  }
}
