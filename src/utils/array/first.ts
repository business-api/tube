/**
 * Return first item of the `arr` our `null` if arr is empty/undefined;
 *
 * @param arr array;
 * @returns `T | null`
 */
export const first = <T>(arr: T[]): T | undefined =>
  arr?.length > 0 ? arr[0] : undefined;
