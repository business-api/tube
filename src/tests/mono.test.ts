/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type MonoFunction, type Return } from '@core/data';
import { mono, tube } from '@core/interactions';
import { type Pacord } from '@utils';

type Model = {
  name: string;
  lastName: string;
};

type Models = Pacord<'model', Model>;

type Fn = {
  <Data extends Models = Models>(): Return<Data>;
  <Data extends Required<Models> = Required<Models>>(models: Data): Return<Data, string>;
  <Data extends Models = Models>(models: Data): Return<Data, Data>;
};

describe('mono function (synchronous)', () => {
  let syncMonoFunction: MonoFunction<number>;
  let model: Model;
  let models: Models;
  beforeAll(() => {
    // Mock synchronous mono function and
    // Define a synchronous mono function
    syncMonoFunction = (x: number) => x * 2;
    model = {
      lastName: 'Test2',
      name: 'Test1',
    };
    models = {
      model: {
        lastName: 'Test2',
        name: 'Test1',
      },
    };
  });
  it('should execute the synchronous function and return the result', () => {
    const result = mono(({ x }) => x * 2, { x: 5 }, ['x']);
    expect(result).toEqual(10);
  });

  test('applies synchronous mono function without model', () => {
    const result = mono(syncMonoFunction);
    expect(result).toBeInstanceOf(Function);
  });

  test('applies synchronous mono function model and all required keys', () => {
    const result = mono(data => data.name.toLowerCase(), model, ['name', 'lastName']);
    expect(result).toBe('test1');
  });

  test('applies synchronous mono function model and without required keys', () => {
    const result = mono(data => data.name.toLowerCase(), model, []);
    expect(result).toBe(model);
  });

  test('applies synchronous mono function model not all required keys', () => {
    const result = mono(data => data.name.toLowerCase(), model, ['name']);
    expect(result).toBe('test1');
  });

  test('applies synchronous mono function with tube', () => {
    const fn: Fn = (data?: Models) =>
      mono(
        ({ model }) => {
          const name = model.name.toLowerCase();

          return name;
        },
        data,
        ['model'],
      );
    const result = tube(
      fn(),
      mono(({ model }) => model && (model.name = model.name.toUpperCase())),
      fn(),
      mono(({ model }) => model && (model.name = model.name.toUpperCase())),
    )(models);
    expect(result.model?.name).toBe('TEST1');
  });

  test('applies synchronous mono function models with tube', () => {
    const fn: Fn = (data?: Models) =>
      mono(
        ({ model }) => {
          const name = model.name.toLowerCase();

          return name;
        },
        data,
        ['model'],
      );
    const name = fn({ model: { lastName: 'Test2', name: 'TesT1' } });
    expect(name).toBe('test1');
    const result = tube(
      fn(),
      mono(({ model }) => model && (model.name = model?.name.toUpperCase())),
    )(models);
    expect(result.model?.name).toBe('TEST1');
  });
});
