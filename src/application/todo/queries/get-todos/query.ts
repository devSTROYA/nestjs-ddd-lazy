import { Result } from '@core/functional-programming';
import { Todo } from '@domain/todo';
import { Query as BaseQuery } from '@nestjs/cqrs';

export type QueryResult = Result<Array<Todo>, Error>;

export class Query extends BaseQuery<QueryResult> {
  constructor(readonly userId: string) {
    super();
  }
}
