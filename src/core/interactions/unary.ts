import { type AsyncUnaryFunction, type UnaryFunction } from '../data';

type UnaryFunctionTube = <Data, Return>(
  fn: UnaryFunction<Data, Return>,
) => UnaryFunction<Data, Return>;

export const unary: UnaryFunctionTube = fn => input => {
  fn(input);

  return input as never;
};

type AsyncUnaryFunctionTube = <Data, Return>(
  fn: AsyncUnaryFunction<Data, Return>,
) => AsyncUnaryFunction<Data, Return>;

export const punary: AsyncUnaryFunctionTube = fn => async input => {
  await fn(input);

  return input as never;
};
