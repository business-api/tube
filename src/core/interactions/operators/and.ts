import { type CheckOperator } from './check-operator';

export const and: CheckOperator =
  (index, ...predicates) =>
  value =>
    index instanceof Number
      ? predicates.every(predicate => predicate(value, index))
      : index.every(predicate => predicate(value));
