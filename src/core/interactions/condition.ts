import { NULLABLE } from '../../utils';
import { type AsyncConditionFunction, type ConditionFunction } from '../data';

type ConditionFunctionTube = {
  <Data>(predicate: (param?: Data) => boolean): ConditionFunction<Data>;
  <Data>(predicate: (param?: Data) => boolean, model: Data): Data;
  <Data>(predicate: (param?: Data) => Promise<boolean>): AsyncConditionFunction<Data>;
  <Data>(predicate: (param?: Data) => Promise<boolean>, model: Data): Promise<Data>;
};

export const condition: ConditionFunctionTube = (predicate?, model?) =>
  (model ?? NULLABLE) !== NULLABLE ? predicate(model) : value => predicate(value);
