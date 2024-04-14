/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type AsyncUnaryFunction, type UnaryFunction } from '../data';
import { identity } from './identity';

type AsyncPipe = {
  <T, A>(fn1: AsyncUnaryFunction<T, A | boolean>): AsyncUnaryFunction<T, A>;
  <T, A, B>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
  ): AsyncUnaryFunction<T, B>;
  <T, A, B, C>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
  ): AsyncUnaryFunction<T, C>;
  <T, A, B, C, D>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
    fn4: AsyncUnaryFunction<C, D | boolean>,
  ): AsyncUnaryFunction<T, D>;
  <T, A, B, C, D, E>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
    fn4: AsyncUnaryFunction<C, D | boolean>,
    fn5: AsyncUnaryFunction<D, E | boolean>,
  ): AsyncUnaryFunction<T, E>;
  <T, A, B, C, D, E, F>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
    fn4: AsyncUnaryFunction<C, D | boolean>,
    fn5: AsyncUnaryFunction<D, E | boolean>,
    fn6: AsyncUnaryFunction<E, F | boolean>,
  ): AsyncUnaryFunction<T, F>;
  <T, A, B, C, D, E, F, G>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
    fn4: AsyncUnaryFunction<C, D | boolean>,
    fn5: AsyncUnaryFunction<D, E | boolean>,
    fn6: AsyncUnaryFunction<E, F | boolean>,
    fn7: AsyncUnaryFunction<F, G | boolean>,
  ): AsyncUnaryFunction<T, G>;
  <T, A, B, C, D, E, F, G, H>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
    fn4: AsyncUnaryFunction<C, D | boolean>,
    fn5: AsyncUnaryFunction<D, E | boolean>,
    fn6: AsyncUnaryFunction<E, F | boolean>,
    fn7: AsyncUnaryFunction<F, G | boolean>,
    fn8: AsyncUnaryFunction<G, H | boolean>,
  ): AsyncUnaryFunction<T, H>;
  <T, A, B, C, D, E, F, G, H, I>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
    fn4: AsyncUnaryFunction<C, D | boolean>,
    fn5: AsyncUnaryFunction<D, E | boolean>,
    fn6: AsyncUnaryFunction<E, F | boolean>,
    fn7: AsyncUnaryFunction<F, G | boolean>,
    fn8: AsyncUnaryFunction<G, H | boolean>,
    fn9: AsyncUnaryFunction<H, I | boolean>,
  ): AsyncUnaryFunction<T, I>;
  <T, A, B, C, D, E, F, G, H, I>(
    fn1: AsyncUnaryFunction<T, A | boolean>,
    fn2: AsyncUnaryFunction<A, B | boolean>,
    fn3: AsyncUnaryFunction<B, C | boolean>,
    fn4: AsyncUnaryFunction<C, D | boolean>,
    fn5: AsyncUnaryFunction<D, E | boolean>,
    fn6: AsyncUnaryFunction<E, F | boolean>,
    fn7: AsyncUnaryFunction<F, G | boolean>,
    fn8: AsyncUnaryFunction<G, H | boolean>,
    fn9: AsyncUnaryFunction<H, I | boolean>,
    ...fns: Array<UnaryFunction<any, any>>
  ): AsyncUnaryFunction<T, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <T, A, B, C, D, E, F, G, H, I, J>(
    ...fns: Array<UnaryFunction<T, A | boolean>>
  ): AsyncUnaryFunction<T, A>;
};

/**
 * tube() can be called on one or more functions, each of which can take one argument ("UnaryFunction")
 * and uses it to return a value.
 * It returns a function that takes one argument, passes it to the first UnaryFunction, and then
 * passes the result to the next one, passes that result to the next one, and so on. : UnaryFunction<any, any>
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const asyncPipe: AsyncPipe = (...fns) => {
  if (fns.length === 0) {
    return async (input: any): Promise<any> => input;
  }
  if (fns.length === 1) {
    const fn = fns[0];
    // eslint-disable-next-line @typescript-eslint/return-await
    return async (input: any): Promise<any> => fn(await input);
  }
  return async (input: any): Promise<any> =>
    await asyncReducePassable(
      fns,
      // eslint-disable-next-line @typescript-eslint/return-await
      async (prev: Promise<any>, fn: UnaryFunction<any, any> | any) => {
        // eslint-disable-next-line @typescript-eslint/return-await, @typescript-eslint/strict-boolean-expressions
        return await fn((await prev) || input);
      },
      Promise.resolve(),
    );
};

const asyncReducePassable = async <T, R>(arr: T[], ...arg: any[]): Promise<R> => {
  const len = arr.length;
  let i = 0;
  let bind: T | null = null;

  if (arg.length > 1) {
    bind = arg[2] as T;
  }

  if (arg.length === 0 && typeof arg[0] !== 'function') {
    throw new TypeError(`arg[0] is not a function`);
  }

  if (len === 0 && arg.length === 1) {
    throw new TypeError('Reduce of empty array with no initial value');
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  let accumulator = (arg[1] || arr[i++]) as R;
  let nextIterationSkip = false;
  let prevAccumulator;
  // eslint-disable-next-line @typescript-eslint/ban-types
  const prevFn = arg[0] as Function;

  for (; i < len; i++) {
    if (nextIterationSkip) {
      nextIterationSkip = false;
      // TODO: add break when preFn `return;` for stop invoke all pipe
      continue;
    }
    prevAccumulator = accumulator;
    accumulator = (await prevFn.call(bind, accumulator, arr[i], i, arr)) as R;

    if (typeof accumulator === 'boolean') {
      if (accumulator) {
        nextIterationSkip = false;
      } else {
        nextIterationSkip = true;
      }
      accumulator = prevAccumulator;
    }
  }

  return accumulator;
};

/**
 * condition() can be called on one or more consts, each of which can take one argument ("UnaryFunction")
 * and uses it to return a value.
 * It returns a const that takes one argument, passes it to the first UnaryFunction, and then
 * passes the result to the next one, passes that result to the next one, and so on.
 * const pipe = (...fns: Array<UnaryFunction<any, any>>): UnaryFunction<any, any> =>
 *  tubeFromArray(fns);
 */
const tubeFromArray = <T, R>(fns: Array<UnaryFunction<T, R>>): UnaryFunction<T, R> => {
  if (fns.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return identity as UnaryFunction<any, any>;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  const piped = (input: T): R =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    reducePassable(fns, (prev: any, fn: UnaryFunction<T, R>) => fn(prev), input as any);
  return piped;
};

const reducePassable = <T, R>(
  arr: T[],
  ...arg: any[] /* fn: Function, initial: any, bind: any */
): R => {
  const len = arr.length;
  let i = 0;
  let bind: T | null = null;

  if (arg.length > 1) {
    bind = arg[2] as T;
  }

  if (arg.length === 0 && typeof arg[0] !== 'function') {
    throw new TypeError(`arg[0] is not a function`);
  }

  if (len === 0 && arg.length === 1) {
    throw new TypeError('Reduce of empty array with no initial value');
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  let accumulator = (arg[1] || arr[i++]) as R;
  let nextIterationSkip = false;
  let prevAccumulator;
  // eslint-disable-next-line @typescript-eslint/ban-types
  const prevFn = arg[0] as Function;

  for (; i < len; i++) {
    if (nextIterationSkip) {
      nextIterationSkip = false;
      continue;
    }
    prevAccumulator = accumulator;
    accumulator = prevFn.call(bind, accumulator, arr[i], i, arr) as R;

    if (typeof accumulator === 'boolean') {
      if (accumulator) {
        nextIterationSkip = false;
      } else {
        nextIterationSkip = true;
      }
      accumulator = prevAccumulator;
    }

    // if (accumulator === finish) {
    //   accumulator = prevAccumulator;
    //   break;
    // }
  }

  return accumulator;
};

type Tube = {
  <T, A>(fn1: UnaryFunction<T, A | boolean>): UnaryFunction<T, A>;
  <T, A, B>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
  ): UnaryFunction<T, B>;
  <T, A, B, C>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
  ): UnaryFunction<T, C>;
  <T, A, B, C, D>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
    fn4: UnaryFunction<C, D | boolean>,
  ): UnaryFunction<T, D>;
  <T, A, B, C, D, E>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
    fn4: UnaryFunction<C, D | boolean>,
    fn5: UnaryFunction<D, E | boolean>,
  ): UnaryFunction<T, E>;
  <T, A, B, C, D, E, F>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
    fn4: UnaryFunction<C, D | boolean>,
    fn5: UnaryFunction<D, E | boolean>,
    fn6: UnaryFunction<E, F | boolean>,
  ): UnaryFunction<T, F>;
  <T, A, B, C, D, E, F, G>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
    fn4: UnaryFunction<C, D | boolean>,
    fn5: UnaryFunction<D, E | boolean>,
    fn6: UnaryFunction<E, F | boolean>,
    fn7: UnaryFunction<F, G | boolean>,
  ): UnaryFunction<T, G>;
  <T, A, B, C, D, E, F, G, H>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
    fn4: UnaryFunction<C, D | boolean>,
    fn5: UnaryFunction<D, E | boolean>,
    fn6: UnaryFunction<E, F | boolean>,
    fn7: UnaryFunction<F, G | boolean>,
    fn8: UnaryFunction<G, H | boolean>,
  ): UnaryFunction<T, H>;
  <T, A, B, C, D, E, F, G, H, I>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
    fn4: UnaryFunction<C, D | boolean>,
    fn5: UnaryFunction<D, E | boolean>,
    fn6: UnaryFunction<E, F | boolean>,
    fn7: UnaryFunction<F, G | boolean>,
    fn8: UnaryFunction<G, H | boolean>,
    fn9: UnaryFunction<H, I | boolean>,
  ): UnaryFunction<T, I>;
  <T, A, B, C, D, E, F, G, H, I>(
    fn1: UnaryFunction<T, A | boolean>,
    fn2: UnaryFunction<A, B | boolean>,
    fn3: UnaryFunction<B, C | boolean>,
    fn4: UnaryFunction<C, D | boolean>,
    fn5: UnaryFunction<D, E | boolean>,
    fn6: UnaryFunction<E, F | boolean>,
    fn7: UnaryFunction<F, G | boolean>,
    fn8: UnaryFunction<G, H | boolean>,
    fn9: UnaryFunction<H, I | boolean>,
    ...fns: Array<UnaryFunction<any, any>>
  ): UnaryFunction<T, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <T, A, B, C, D, E, F, G, H, I, J>(
    ...fns: Array<UnaryFunction<T, A | boolean>>
  ): UnaryFunction<T, A>;
};

export const tube: Tube =
  (...fns) =>
  input => {
    return tubeFromArray(fns)(input);
  };
