import { UniqueEntityId } from '@core/domain-driven-design';
import { randomUUID } from 'crypto';

export class UserId extends UniqueEntityId {
  declare readonly _tag: 'UserId';

  private constructor(value: string) {
    super(value);
  }

  static generate(): UserId {
    return new UserId(randomUUID());
  }

  static rehydrate(value: string): UserId {
    return new UserId(value);
  }
}
