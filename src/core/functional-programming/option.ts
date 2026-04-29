type Some<T> = {
  readonly value: T;
  isSome(): this is Some<T>;
  isNone(): false;
};
type None = {
  readonly value: null;
  isSome(): false;
  isNone(): this is None;
};

export const Some = <T>(value: T): Option<T> => {
  return Object.freeze({
    value,
    isSome: (): this is Some<T> => true,
    isNone: () => false,
  });
};
export const None: None = Object.freeze({
  value: null,
  isSome: () => false,
  isNone: (): this is None => true,
});

export type Option<T> = Some<T> | None;
