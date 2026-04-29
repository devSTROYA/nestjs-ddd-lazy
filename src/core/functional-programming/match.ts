import { Option } from './option';
import { Result } from './result';

type ResultHandler<T, E, R> = {
  Ok: (value: T) => R;
  Err: (error: E) => R;
};
type OptionHandler<T, R> = {
  Some: (value: T) => R;
  None: () => R;
};
type BooleanHandler<R> = {
  False: () => R;
  True: () => R;
};

export const match = {
  fromResult: <T, E, R>(value: Result<T, E>, handler: ResultHandler<T, E, R>): R => {
    return value.isOk() ? handler.Ok(value.value) : handler.Err(value.error);
  },
  fromOption: <T, R>(value: Option<T>, handler: OptionHandler<T, R>): R => {
    return value.isSome() ? handler.Some(value.value) : handler.None();
  },
  fromBoolean: <R>(value: boolean, handler: BooleanHandler<R>): R => {
    return value ? handler.True() : handler.False();
  },
};
