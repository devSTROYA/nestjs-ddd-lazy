import { Err, Ok } from '@core/functional-programming';
import { UserId, UserRepository } from '@domain/user';
import { UserErrors } from '@domain/user/errors/user.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Query, QueryResult } from './query';

@QueryHandler(Query)
export class Handler implements IQueryHandler<Query> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: Query): Promise<QueryResult> {
    try {
      const userId = UserId.rehydrate(query.userId);
      const user = await this.userRepository.findById(userId);
      if (user.isNone()) {
        return Err(new UserErrors.UserDoesNotExistError());
      }

      return Ok(user.value);
    } catch (error) {
      return Err(error as Error);
    }
  }
}
