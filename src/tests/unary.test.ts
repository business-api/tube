import { type AsyncUnaryFunction, type UnaryFunction } from '@core/data';
import { punary, unary } from '@core/interactions';

// Define a test for the synchronous unary function
describe('Synchronous unary function', () => {
  let syncFunction: UnaryFunction<number, number>;
  beforeAll(() => {
    // Define a synchronous unary function
    syncFunction = (x: number) => {
      return x * 2;
    };
  });
  it('Should return the input value after applying the synchronous function', () => {
    // Define a simple synchronous function
    const syncFn = (input: number): number => input * 2;

    // Call the unary function with the synchronous matcher and the function
    const unaryFunction = unary(syncFn);
    // Test the unary function with different input values
    expect(unaryFunction(5)).toBe(5);
    expect(unaryFunction(10)).toBe(10);
    expect(unaryFunction(-3)).toBe(-3);
  });
  it('should execute the synchronous function and return the result', () => {
    expect(unary(syncFunction)(5)).toEqual(5);
  });
});

// Define a test for the asynchronous unary function
describe('Asynchronous unary function', () => {
  let asyncFunction: AsyncUnaryFunction<number, number>;
  beforeAll(() => {
    // Define a synchronous unary function
    asyncFunction = async (x: number) => {
      return x * 2;
    };
  });
  it('Should return the input value after applying the asynchronous function', async () => {
    // Define an asynchronous function
    const asyncFn = async (input: number): Promise<number> => {
      return await new Promise<number>(resolve => {
        setTimeout(() => {
          resolve(input * 2);
        }, 0);
      });
    };
    // Call the unary function with the asynchronous matcher and the function
    const unaryFunction = punary(asyncFn);
    // Test the unary function with different input values
    expect(await unaryFunction(5)).toBe(5);
    expect(await unaryFunction(10)).toBe(10);
    expect(await unaryFunction(-3)).toBe(-3);
  });
  it('should execute the asynchronous function and return the result', async () => {
    expect(await punary(asyncFunction)(5)).toEqual(5);
  });
});
