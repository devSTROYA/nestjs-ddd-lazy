import { Repository } from '@core/domain-driven-design';
import { UserId } from '@domain/user';
import { Todo } from '../entities/todo';

export abstract class TodoRepository extends Repository<Todo> {
  abstract findAllByUserId(userId: UserId): Promise<Todo[]>;
}
