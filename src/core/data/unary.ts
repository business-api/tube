/**
 * A function type interface that describes a function that accepts one parameter `T`
 * and returns another parameter `R`.
 *
 * Usually used to describe {@link OperatorFunction} - it always takes a single
 * parameter (the source Observable) and returns another Observable.
 */
export type UnaryFunction<Source = unknown, Return = unknown> = (
  source: Source,
) => Return;
export type RenoUnaryFunction<Source = unknown, Return = unknown> = (
  source: Required<NonNullable<Source>>,
) => Return;
export type ConditionFunction<Data = unknown> = UnaryFunction<Data, boolean>;
export type MonoFunction<Data = unknown> = UnaryFunction<Data, Data>;
export type Stub = { _ωω_: string };
export type Return<T, R = MonoFunction<T>> = T extends R
  ? T
  : R extends never
    ? MonoFunction<T>
    : R;
export type ReturnCondition<T, R = ConditionFunction<T>> = T extends R
  ? T
  : R extends never
    ? ConditionFunction<T>
    : R;

/**
 * async version of {@link UnaryFunction}
 */
export type AsyncUnaryFunction<Source = unknown, Return = unknown> = (
  source: Source,
) => Promise<Return>;
export type RenoAsyncUnaryFunction<Source = unknown, Return = unknown> = (
  source: Required<NonNullable<Source>>,
) => Promise<Return>;
export type AsyncConditionFunction<Data = unknown> = AsyncUnaryFunction<Data, boolean>;
export type AsyncMonoFunction<Data = unknown> = AsyncUnaryFunction<Data, Data>;
