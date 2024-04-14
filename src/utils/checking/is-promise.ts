/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPromise = <T>(value: any): value is Promise<T> =>
  value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
