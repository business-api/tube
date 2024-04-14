import { condition } from '@core/interactions';

// Define a test for the synchronous condition function
describe('Synchronous condition function', () => {
  it('Should return true if the predicate is true', () => {
    // Define a simple predicate function
    const predicate = (param?: number): boolean => param !== undefined && param > 0;
    // Call the condition function with the synchronous matcher and the predicate
    const conditionFunction = condition(predicate);
    // Test the condition function with different values
    expect(conditionFunction(5)).toBe(true);
    expect(conditionFunction(-3)).toBe(false);
    expect(conditionFunction(0)).toBe(false);
  });
});
