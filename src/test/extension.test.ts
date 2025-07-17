import * as assert from 'assert';

describe('Extension Test Suite', () => {

	let testData: any;

	before(() => {
		// Setup vor allen Tests
		console.log('Starting test suite...');
		testData = {
			numbers: [1, 2, 3, 4, 5],
			strings: ['hello', 'world', 'test'],
			users: [
				{ name: 'John', age: 30 },
				{ name: 'Jane', age: 25 }
			]
		};
	});

	after(() => {
		// Cleanup nach allen Tests
		console.log('Test suite completed.');
		testData = null;
	});

	beforeEach(() => {
		// Setup vor jedem Test
		console.log('Running test...');
	});

	afterEach(() => {
		// Cleanup nach jedem Test
		console.log('Test completed.');
	});

	describe('Array Operations', () => {

		it('should find element in array', () => {
			// Arrange
			const array = testData.numbers;
			const searchValue = 3;
			const expectedIndex = 2;

			// Act
			const result = array.indexOf(searchValue);

			// Assert
			assert.strictEqual(result, expectedIndex);
		});

		it('should return -1 for missing element', () => {
			// Arrange
			const array = testData.numbers;
			const searchValue = 99;
			const expectedIndex = -1;

			// Act
			const result = array.indexOf(searchValue);

			// Assert
			assert.strictEqual(result, expectedIndex);
		});

		it('should filter even numbers', () => {
			// Arrange
			const numbers = testData.numbers;
			const expected = [2, 4];

			// Act
			const result = numbers.filter((n: number) => n % 2 === 0);

			// Assert
			assert.deepStrictEqual(result, expected);
		});

		it('should map array correctly', () => {
			// Arrange
			const numbers = [1, 2, 3];
			const expected = [2, 4, 6];

			// Act
			const result = numbers.map(n => n * 2);

			// Assert
			assert.deepStrictEqual(result, expected);
		});

		it('should reduce array to sum', () => {
			// Arrange
			const numbers = [1, 2, 3, 4];
			const expected = 10;

			// Act
			const result = numbers.reduce((sum, n) => sum + n, 0);

			// Assert
			assert.strictEqual(result, expected);
		});
	});

	describe('String Operations', () => {

		it('should convert to uppercase', () => {
			// Arrange
			const input = 'hello';
			const expected = 'HELLO';

			// Act
			const result = input.toUpperCase();

			// Assert
			assert.strictEqual(result, expected);
		});

		it('should trim whitespace', () => {
			// Arrange
			const input = '  test  ';
			const expected = 'test';

			// Act
			const result = input.trim();

			// Assert
			assert.strictEqual(result, expected);
		});

		it('should split string by delimiter', () => {
			// Arrange
			const input = 'apple,banana,cherry';
			const delimiter = ',';
			const expected = ['apple', 'banana', 'cherry'];

			// Act
			const result = input.split(delimiter);

			// Assert
			assert.deepStrictEqual(result, expected);
		});

		it('should check if string includes substring', () => {
			// Arrange
			const text = 'The quick brown fox';
			const substring = 'quick';
			const expected = true;

			// Act
			const result = text.includes(substring);

			// Assert
			assert.strictEqual(result, expected);
		});

		it('should replace substring', () => {
			// Arrange
			const text = 'Hello World';
			const searchValue = 'World';
			const replaceValue = 'Universe';
			const expected = 'Hello Universe';

			// Act
			const result = text.replace(searchValue, replaceValue);

			// Assert
			assert.strictEqual(result, expected);
		});
	});

	describe('Object Operations', () => {

		it('should access object properties', () => {
			// Arrange
			const user = testData.users[0];
			const expectedName = 'John';
			const expectedAge = 30;

			// Act
			const name = user.name;
			const age = user.age;

			// Assert
			assert.strictEqual(name, expectedName);
			assert.strictEqual(age, expectedAge);
		});

		it('should find user by name', () => {
			// Arrange
			const users = testData.users;
			const searchName = 'Jane';
			const expected = { name: 'Jane', age: 25 };

			// Act
			const result = users.find((user: { name: string; }) => user.name === searchName);

			// Assert
			assert.deepStrictEqual(result, expected);
		});

		it('should get array of names', () => {
			// Arrange
			const users = testData.users;
			const expected = ['John', 'Jane'];

			// Act
			const result = users.map((user: { name: any; }) => user.name);

			// Assert
			assert.deepStrictEqual(result, expected);
		});
	});

	describe('Edge Cases', () => {

		it('should handle null values', () => {
			// Arrange
			const input = null;
			const expected = true;

			// Act
			const result = input === null;

			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle undefined values', () => {
			// Arrange
			const obj: any = {};
			const expected = undefined;

			// Act
			const result = obj.nonExistentProperty;

			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle empty arrays', () => {
			// Arrange
			const emptyArray: number[] = [];
			const expected = 0;

			// Act
			const result = emptyArray.length;

			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle empty strings', () => {
			// Arrange
			const emptyString = '';
			const expected = true;

			// Act
			const result = emptyString.length === 0;

			// Assert
			assert.strictEqual(result, expected);
		});
	});

});