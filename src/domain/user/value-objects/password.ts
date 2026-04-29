import { Encryption } from '@common/utils';
import { ValueObject } from '@core/domain-driven-design';
import { ValidationError } from '@core/errors';
import { Err, match, Ok, Result } from '@core/functional-programming';
import { UserErrors } from '../errors/user.errors';

type PasswordProps = {
  value: string;
};

export class Password extends ValueObject<PasswordProps> {
  private static readonly MIN_PASSWORD_LENGTH = 8;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PasswordProps) {
    super(props);
  }

  private static validate(value: string): Result<void, ValidationError> {
    return match.fromBoolean(value.length < this.MIN_PASSWORD_LENGTH, {
      True: () => {
        return Err(
          new UserErrors.PasswordTooShortError({
            provided: value.length,
            minLength: this.MIN_PASSWORD_LENGTH,
          }),
        );
      },
      False: () => Ok(undefined),
    });
  }

  static async create(value: string): Promise<Result<Password, ValidationError>> {
    let passwordValidationResult = match.fromResult(this.validate(value), {
      Ok: (_) => Ok(value),
      Err: (error) => Err(error),
    });

    if (passwordValidationResult.isErr()) {
      return passwordValidationResult;
    }

    const hashedPassword = await Encryption.hash(passwordValidationResult.value);

    return Ok(new Password({ value: hashedPassword }));
  }

  static rehydrate(value: string): Password {
    return new Password({ value });
  }
}
