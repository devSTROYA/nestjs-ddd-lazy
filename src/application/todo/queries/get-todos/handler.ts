import { Err, Ok } from '@core/functional-programming';
import { TodoRepository } from '@domain/todo';
import { UserId } from '@domain/user';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Query, QueryResult } from './query';

@QueryHandler(Query)
export class Handler implements IQueryHandler<Query> {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(query: Query): Promise<QueryResult> {
    try {
      const userId = UserId.rehydrate(query.userId);
      const todos = await this.todoRepository.findAllByUserId(userId);
      return Ok(todos);
    } catch (error) {
      return Err(error as Error);
    }
  }
}
