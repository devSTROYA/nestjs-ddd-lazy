import { ValidationError } from '@core/errors';
import { Result } from '@core/functional-programming';
import { User } from '@domain/user';
import { Query as BaseQuery } from '@nestjs/cqrs';

export type QueryResult = Result<User, ValidationError | Error>;

export class Query extends BaseQuery<QueryResult> {
  constructor(readonly userId: string) {
    super();
  }
}
