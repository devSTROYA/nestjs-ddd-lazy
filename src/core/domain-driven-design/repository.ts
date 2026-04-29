import { Option } from '@core/functional-programming';
import { AggregateRoot } from './aggregate-root';
import { UniqueEntityId } from './unique-entity-id';

export abstract class Repository<T extends AggregateRoot<Record<string, unknown>, UniqueEntityId>> {
  abstract findById(id: T['id']): Promise<Option<T>>;
  abstract save(aggregate: T): Promise<void>;
}
