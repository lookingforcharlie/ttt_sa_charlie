import { nullArray } from '../utils';

describe('nullArray', () => {
  it('should replace all elements with null in the array', () => {
    // Arrange
    const inputArray = ['apple', 'banana', 'cherry', null, 'orange'];

    // Act
    const result = nullArray([...inputArray]); // Create a copy to avoid modifying the original array

    // Assert
    expect(result).toEqual([null, null, null, null, null]); // Check if all elements are replaced with null
    expect(result).not.toBe(inputArray); // Check that the original array is not mutated
  });

  it('should return an empty array if input is an empty array', () => {
    // Arrange
    const inputArray: (string | null)[] = [];

    // Act
    const result = nullArray([...inputArray]); // Create a copy to avoid modifying the original array

    // Assert
    expect(result).toEqual([]); // Check if the result is an empty array
    expect(result).not.toBe(inputArray); // Check that the original array is not mutated
  });
});
