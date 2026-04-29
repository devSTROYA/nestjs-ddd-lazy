import { ValueObject } from '@core/domain-driven-design';
import { ValidationError } from '@core/errors';
import { Err, match, Ok, Result } from '@core/functional-programming';
import { UserErrors } from '../errors/user.errors';

type NameProps = {
  value: string;
};

export class Name extends ValueObject<NameProps> {
  private static readonly MIN_NAME_LENGTH = 3;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: NameProps) {
    super(props);
  }

  private static validate(value: string): Result<void, ValidationError> {
    return match.fromBoolean(value.length < this.MIN_NAME_LENGTH, {
      True: () => {
        return Err(
          new UserErrors.NameTooShortError({
            provided: value.length,
            minLength: this.MIN_NAME_LENGTH,
          }),
        );
      },
      False: () => Ok(undefined),
    });
  }

  static create(value: string): Result<Name, ValidationError> {
    return match.fromResult(this.validate(value), {
      Ok: (_) => Ok(new Name({ value })),
      Err: (error) => Err(error),
    });
  }

  static rehydrate(value: string): Name {
    return new Name({ value });
  }
}
