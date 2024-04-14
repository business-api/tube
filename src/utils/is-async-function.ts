export const isAsyncFunction = (func): boolean =>
  hasPromise(func) || func.constructor.name === 'AsyncFunction';

export const hasPromise = <T>(value): value is Promise<T> =>
  value.constructor.name === 'Promise';
