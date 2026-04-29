import { ValueObject } from '@core/domain-driven-design';
import { ValidationError } from '@core/errors';
import { Err, match, Ok, Result } from '@core/functional-programming';
import { UserErrors } from '../errors/user.errors';

type EmailProps = {
  value: string;
};

export class Email extends ValueObject<EmailProps> {
  static readonly EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  private static validate(value: string): Result<string, ValidationError> {
    const normalizedValue = value.trim().toLowerCase();
    return match.fromBoolean(this.EMAIL_REGEX.test(normalizedValue), {
      False: () => {
        return Err(new UserErrors.InvalidEmailFormatError());
      },
      True: () => Ok(normalizedValue),
    });
  }

  static create(value: string): Result<Email, ValidationError> {
    return match.fromResult(this.validate(value), {
      Ok: (normalizedValue) => Ok(new Email({ value: normalizedValue })),
      Err: (error) => Err(error),
    });
  }

  static rehydrate(value: string): Email {
    return new Email({ value });
  }
}
