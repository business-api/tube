/* eslint-disable @typescript-eslint/ban-types */
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';
