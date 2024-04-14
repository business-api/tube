import { type CheckOperator } from './check-operator';

export const or: CheckOperator =
  (index, ...predicates) =>
  value =>
    index instanceof Number
      ? predicates.some(predicate => predicate(value, index))
      : index.some(predicate => predicate(value));
