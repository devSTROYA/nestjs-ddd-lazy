export abstract class UniqueEntityId {
  abstract readonly _tag: string;
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  equals<T extends UniqueEntityId>(id: T): boolean {
    if (!(id instanceof this.constructor)) return false;
    return id.value === this._value;
  }

  get value(): string {
    return this._value;
  }
}
