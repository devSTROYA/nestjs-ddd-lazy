import { ValidationError } from '@core/errors';
import { Result } from '@core/functional-programming';
import { Command as BaseCommand } from '@nestjs/cqrs';

export type CommandResult = Result<void, ValidationError | Error>;

export class Command extends BaseCommand<CommandResult> {
  constructor(
    readonly userId: string,
    readonly title: string,
    readonly description?: string,
  ) {
    super();
  }
}
