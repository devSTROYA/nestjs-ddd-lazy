export abstract class ValueObject<Props extends Record<string, unknown>> {
  protected readonly props: Props;

  constructor(props: Props) {
    this.props = Object.freeze({ ...props });
  }

  equals(other?: ValueObject<Props>): boolean {
    if (other == null || other == undefined) return false;
    if (!(other instanceof this.constructor)) return false;

    const keys = Object.keys(this.props) as (keyof Props)[];
    const otherKeys = Object.keys(other.props) as (keyof Props)[];
    if (keys.length !== otherKeys.length) return false;

    for (const key of keys) {
      const thisValue = this.props[key];
      const otherValue = other.props[key];

      if (thisValue instanceof ValueObject && otherValue instanceof ValueObject) {
        if (!thisValue.equals(otherValue)) {
          return false;
        }
        continue;
      }

      if (thisValue instanceof Date && otherValue instanceof Date) {
        if (thisValue.getTime() !== otherValue.getTime()) {
          return false;
        }
        continue;
      }

      if (thisValue !== otherValue) return false;
    }

    return true;
  }
}
