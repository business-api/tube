/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Return } from '@core/data';
import { mono, tube } from '@core/interactions';
import { has, type Pacord } from '@utils';

type User = {
  name: string;
  age: number;
};
type Users = Pacord<'user', User>;
type FnThen = {
  <Data extends Users = Users>(): Return<Data>;
  <Data extends Required<Users> = Required<Users>>(value: Data): Return<Data, void>;
  <Data extends Users = Users>(value: Data): Return<Data, Data>;
};

describe('has function', () => {
  let then: FnThen;
  beforeAll(() => {
    then = (data?: Users) =>
      mono(
        ({ user }) => {
          user.age = 31;
          user.name = 'test';
        },
        data,
        ['user'],
      );
  });
  test('has property', () => {
    // Arrange
    const obj: Users = { user: { age: 30, name: 'John' } };
    const result = tube(has('user'), then())(obj as Required<Users>);
    expect(result.user?.name).toBe('test');
    expect(result.user?.age).toBe(31);
  });

  test('does not have property not exist property', () => {
    const obj = { user: { age: 30, name: 'John' } };
    const result = tube(has('gender'), then())(obj as never);
    expect(result.user?.age).toBe(30);
    expect(result.user?.name).toBe('John');
  });
  test('does not have property exist property', () => {
    const obj: Users = { user: { age: 30, name: 'John' } };
    const result = tube(has<Users>('noτ', 'user'), then())(obj);
    expect(result.user?.age).toBe(30);
    expect(result.user?.name).toBe('John');
    const resultNot = tube(
      has('noτ', 'user1'),
      then(),
    )({ user: { age: 30, name: 'John' } } satisfies unknown as never);
    expect(resultNot.user?.age).toBe(31);
    expect(resultNot.user?.name).toBe('test');
  });

  test('property has truthy value', () => {
    const obj: Users = { user: { age: 30, name: 'John' } };
    const hasAge = has('user', obj);
    expect(hasAge).toBe(true);
  });

  test('property does not have truthy value', () => {
    const obj: Users = { user: { age: 30, name: 'John' } };
    const hasAge = !has('user', obj);
    expect(hasAge).toBe(false);
  });

  test('has return functions', () => {
    // Arrange
    const hasNoGender = has<Users>('noτ', 'user');
    expect(hasNoGender).toBeInstanceOf(Function);
    const hasGender = has<Users>('user');
    expect(hasGender).toBeInstanceOf(Function);
  });
});
