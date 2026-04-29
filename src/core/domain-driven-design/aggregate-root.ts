import { AggregateRoot as BaseAggregateRoot } from '@nestjs/cqrs';
import { UniqueEntityId } from './unique-entity-id';

export abstract class AggregateRoot<
  Props extends Record<string, unknown>,
  Id extends UniqueEntityId,
> extends BaseAggregateRoot {
  protected readonly uniqueId: Id;
  protected readonly props: Props;

  constructor(props: Props, id: Id) {
    super();
    this.uniqueId = id;
    this.props = props;
  }

  get id(): Id {
    return this.uniqueId;
  }

  equals(other?: AggregateRoot<Props, Id>): boolean {
    if (other == null || other == undefined) return false;
    if (!(other instanceof this.constructor)) return false;
    return this.uniqueId.equals(other.uniqueId);
  }
}
