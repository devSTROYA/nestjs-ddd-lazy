import { UniqueEntityId } from '@core/domain-driven-design';
import { randomUUID } from 'crypto';

export class TodoId extends UniqueEntityId {
  declare readonly _tag: 'TodoId';

  private constructor(value: string) {
    super(value);
  }

  static generate(): TodoId {
    return new TodoId(randomUUID());
  }

  static rehydrate(value: string): TodoId {
    return new TodoId(value);
  }
}
