import { DomainError, ValidationError } from '@core/errors';
import { Result } from '@core/functional-programming';
import { Command as BaseCommand } from '@nestjs/cqrs';

type LoginResponse = {
  accessToken: string;
};
export type CommandResult = Result<LoginResponse, DomainError | ValidationError | Error>;

export class Command extends BaseCommand<CommandResult> {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {
    super();
  }
}
