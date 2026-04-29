type Ok<T> = {
  readonly value: T;
  isOk(): this is Ok<T>;
  isErr(): false;
};
type Err<T> = {
  readonly error: T;
  isOk(): false;
  isErr(): this is Err<T>;
};

export const Ok = <T = never, U = never>(value: T): Result<T, U> => {
  return Object.freeze({
    value: value,
    isOk: (): this is Ok<T> => true,
    isErr: () => false,
  });
};
export const Err = <T = never, U = never>(error: U): Result<T, U> => {
  return Object.freeze({
    error,
    isOk: () => false,
    isErr: (): this is Err<U> => true,
  });
};

export type Result<T, U> = Ok<T> | Err<U>;
