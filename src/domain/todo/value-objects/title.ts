import { ValueObject } from '@core/domain-driven-design';
import { ValidationError } from '@core/errors';
import { Err, match, Ok, Result } from '@core/functional-programming';
import { TodoErrors } from '../errors/todo.errors';

type TitleProps = {
  value: string;
};

export class Title extends ValueObject<TitleProps> {
  private static readonly MIN_TITLE_LENGTH = 3;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TitleProps) {
    super(props);
  }

  private static validate(value: string): Result<void, ValidationError> {
    return match.fromBoolean(value.length < this.MIN_TITLE_LENGTH, {
      True: () => {
        return Err(
          new TodoErrors.TitleTooShortError({
            provided: value.length,
            minLength: this.MIN_TITLE_LENGTH,
          }),
        );
      },
      False: () => Ok(undefined),
    });
  }

  static create(value: string): Result<Title, ValidationError> {
    return match.fromResult(this.validate(value), {
      Ok: (_) => Ok(new Title({ value })),
      Err: (error) => Err(error),
    });
  }

  static rehydrate(value: string): Title {
    return new Title({ value });
  }
}
