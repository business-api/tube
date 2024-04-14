type ProjectionFn<T> = (value: T, index?: number) => T | boolean;
type PredicateFn<T> = (value: T, index?: number) => boolean;

export type CheckOperator = {
  <T>(...predicates: Array<PredicateFn<T>>): ProjectionFn<T>;
  <T>(index?: number, ...predicates: Array<PredicateFn<T>>): ProjectionFn<T>;
};
