import { NULLABLE } from '../../../utils';
import { type ReturnCondition } from '../../data';
import { condition } from '../condition';

type Should = {
  <Value>(property: keyof Required<NonNullable<Value>>): ReturnCondition<Value>;
  <Value>(
    property: keyof Required<NonNullable<Value>>,
    value: Value,
  ): ReturnCondition<Value, boolean>;
};

/**
 * Determines whether an object has a value or it is undefined | null, returning true or false as appropriate.
 * and ignore falsy values such as: false, NaN, '', 0, -0 etc they is true.
 *
 * @param value an object or undefined | null.
 * @param force if value is string, but is not for tube then set force
 */
export const should: Should = (property, value?) =>
  condition(_value => {
    return (_value[property] ?? NULLABLE) !== NULLABLE;
  }, value);
