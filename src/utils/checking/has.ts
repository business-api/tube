import { type ReturnCondition } from '../../core/data';
import { condition } from '../../core/interactions';

const isExistProp = (prop: unknown): boolean => {
  prop = typeof prop === 'boolean' ? true : prop;
  const result = prop ?? false;
  return typeof result === 'boolean' ? result : true;
};
const have = (prop: any, _value: any): boolean => {
  if (Array.isArray(prop)) {
    return prop.every(pr => isExistProp(_value[pr]));
  }

  return isExistProp(_value[prop]);
};

type Has = {
  <Value>(prop: keyof Value): ReturnCondition<Value>;
  <Value>(matcher: 'noτ', prop: keyof Value): ReturnCondition<Value>;
  <Value>(prop: keyof Value, value: Value): ReturnCondition<Value, boolean>;
};

/**
 * Determines whether an object has a value or it is undefined | null, returning true or false as appropriate.
 * and ignore falsy values such as: false, NaN, '', 0, -0 etc they is true.
 *
 * @param value an object or undefined | null.
 * @param force if value is string, but is not for tube then set force
 */
export const has: Has = (matcher, prop?, value?) =>
  condition(
    _value => {
      if (matcher === 'noτ') {
        return !have(prop, _value);
      }
      return have(matcher, _value);
    },
    matcher === 'noτ' ? value : prop,
  );
