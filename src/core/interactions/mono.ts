/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { first, NULLABLE } from '../../utils';
import {
  type AsyncMonoFunction,
  type AsyncUnaryFunction,
  type MonoFunction,
  type RenoAsyncUnaryFunction,
  type RenoUnaryFunction,
  type UnaryFunction,
} from '../data';
import { should } from './operators';
import { punary, unary } from './unary';

const hasProperties = (model, keys: []): boolean =>
  !!(keys && keys.length > 0 && model && keys.every(key => should(key, model)));

type ReturnMono<Return, T, Keys> = Return extends T
  ? MonoFunction<T>
  : Keys extends never[]
    ? T
    : T extends unknown
      ? Return
      : T;

type MonoFunctionTube = {
  <Data>(fn: MonoFunction<Data>): MonoFunction<Data>;
  <Data, Return = void>(fn: UnaryFunction<Data, Return>): MonoFunction<Data>;
  <
    Data = unknown,
    Return = void,
    Keys extends Array<keyof Required<NonNullable<Data>>> = Array<
      keyof Required<NonNullable<Data>>
    >,
  >(
    fn: RenoUnaryFunction<Data, Return>,
    model?: Data | Data[],
    keys?: Keys,
  ): ReturnMono<Return, Data, Keys>;
};

export const mono: MonoFunctionTube = (fn, model?, keys?) => {
  const hasModel = model ?? NULLABLE;
  const hasKeys = keys ?? NULLABLE;

  if (hasModel !== NULLABLE) {
    if (Array.isArray(model)) {
      return fn(first(model));
    }

    if (hasKeys && hasProperties(model, keys)) {
      return fn(model);
    }

    return model;
  } else {
    return unary(fn);
  }
};

type PromFunctionTube = {
  <Data>(fn: AsyncMonoFunction<Data>): AsyncMonoFunction<Data>;
  <Data, Return = void>(
    fn: AsyncUnaryFunction<Data, Return>,
    model: Data,
  ): Promise<Return>;
  <Data, Return = void>(
    fn: RenoAsyncUnaryFunction<Data, Return>,
    model: Data,
    keys: Array<keyof Data>,
  ): Promise<Return>;
};

export const prom: PromFunctionTube = (fn, model?, keys?): any => {
  return (async function (func: AsyncMonoFunction, value, k) {
    if ((k ?? true) && (value ?? true) && !hasProperties(value, k)) {
      return value;
    }
    const data = value ?? undefined;

    return data !== undefined ? await func(model) : punary(func);
  })(fn, model, keys);
};

/**
 * Returns an array containing the input data if the specified property exists and is not undefined,
 * otherwise returns undefined. If the property is an array, checks if the input data has all the
 * specified properties.
 *
 * @param {Data} data - The input data.
 * @param {keyof Required<NonNullable<Data>> | Array<keyof Required<NonNullable<Data>>>} property -
 * The property to check.
 * @return {([Data] | undefined)} An array containing the input data if the property exists and is not
 * undefined, otherwise undefined.
 */
export const prepare = <Data>(
  data: Data,
  property: keyof Required<NonNullable<Data>> | Array<keyof Required<NonNullable<Data>>>,
): [Data] | undefined => {
  const isArr = Array.isArray(property);
  return isArr
    ? hasProperties(data, property as [])
      ? [data]
      : undefined
    : data && should(property, data)
      ? [data]
      : undefined;
};
