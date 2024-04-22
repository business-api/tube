/* eslint-disable @typescript-eslint/ban-types */
export const checkArray = <T>(
  array: T[],
  fn: Function,
  propNameOfArray: string,
): void => {
  if (Array.isArray(array)) {
    fn();
  } else {
    throw new Error(`${propNameOfArray} is not Array instance.`);
  }
};
