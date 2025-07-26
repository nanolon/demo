import * as assert from 'assert';
// Import business logic functions directly (no VSCode dependencies)
import { isValidFilename, createGreeting, countWords } from '../utils';

describe('Business Logic Unit Tests', () => {

	describe('isValidFilename()', () => {

		it('should return true for valid filename', () => {
			// Arrange
			const filename = 'test.txt';
			
			// Act
			const result = isValidFilename(filename);
			
			// Assert
			assert.strictEqual(result, true);
		});

		it('should return true for filename with valid special characters', () => {
			// Arrange
			const validFilenames = ['test-file.txt', 'file_name.js', 'document.pdf', 'image.png'];
			
			// Act & Assert
			validFilenames.forEach(filename => {
				const result = isValidFilename(filename);
				assert.strictEqual(result, true, `Filename "${filename}" should be valid`);
			});
		});

		it('should return false for empty filename', () => {
			// Arrange
			const filename = '';
			
			// Act
			const result = isValidFilename(filename);
			
			// Assert
			assert.strictEqual(result, false);
		});

		it('should return false for whitespace-only filename', () => {
			// Arrange
			const filename = '   ';
			
			// Act
			const result = isValidFilename(filename);
			
			// Assert
			assert.strictEqual(result, false);
		});

		it('should return false for filename with invalid characters', () => {
			// Arrange
			const invalidFilenames = [
				'test<.txt',  // < character
				'test>.txt',  // > character
				'test:.txt',  // : character
				'test".txt',  // " character
				'test/.txt',  // / character
				'test\\.txt', // \ character
				'test|.txt',  // | character
				'test?.txt',  // ? character
				'test*.txt'   // * character
			];
			
			// Act & Assert
			invalidFilenames.forEach(filename => {
				const result = isValidFilename(filename);
				assert.strictEqual(result, false, `Filename "${filename}" should be invalid`);
			});
		});

		it('should handle null and undefined input', () => {
			// Act & Assert
			assert.strictEqual(isValidFilename(null as any), false);
			assert.strictEqual(isValidFilename(undefined as any), false);
		});
	});

	describe('createGreeting()', () => {

		it('should create personalized greeting', () => {
			// Arrange
			const name = 'Alice';
			const expected = 'Hello Alice!';
			
			// Act
			const result = createGreeting(name);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should create greeting for different names', () => {
			// Arrange
			const testCases = [
				{ name: 'Bob', expected: 'Hello Bob!' },
				{ name: 'Charlie', expected: 'Hello Charlie!' },
				{ name: 'Diana', expected: 'Hello Diana!' }
			];
			
			// Act & Assert
			testCases.forEach(testCase => {
				const result = createGreeting(testCase.name);
				assert.strictEqual(result, testCase.expected);
			});
		});

		it('should trim whitespace from name', () => {
			// Arrange
			const name = '  Bob  ';
			const expected = 'Hello Bob!';
			
			// Act
			const result = createGreeting(name);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should return default greeting for empty name', () => {
			// Arrange
			const name = '';
			const expected = 'Hello World!';
			
			// Act
			const result = createGreeting(name);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should return default greeting for whitespace-only name', () => {
			// Arrange
			const name = '   ';
			const expected = 'Hello World!';
			
			// Act
			const result = createGreeting(name);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle null and undefined input', () => {
			// Act & Assert
			assert.strictEqual(createGreeting(null as any), 'Hello World!');
			assert.strictEqual(createGreeting(undefined as any), 'Hello World!');
		});
	});

	describe('countWords()', () => {

		it('should count words in simple text', () => {
			// Arrange
			const text = 'Hello world test';
			const expected = 3;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should count single word', () => {
			// Arrange
			const text = 'Hello';
			const expected = 1;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle multiple spaces between words', () => {
			// Arrange
			const text = 'Hello    world     test';
			const expected = 3;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle text with newlines and tabs', () => {
			// Arrange
			const text = 'Hello\nworld\ttest';
			const expected = 3;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle mixed whitespace characters', () => {
			// Arrange
			const text = '  Hello\n\nworld\t\t\ttest  ';
			const expected = 3;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should return 0 for empty text', () => {
			// Arrange
			const text = '';
			const expected = 0;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should return 0 for whitespace-only text', () => {
			// Arrange
			const text = '   \n\t  ';
			const expected = 0;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle null and undefined input', () => {
			// Act & Assert
			assert.strictEqual(countWords(null as any), 0);
			assert.strictEqual(countWords(undefined as any), 0);
		});

		it('should count words with punctuation correctly', () => {
			// Arrange
			const text = 'Hello, world! How are you?';
			const expected = 5;
			
			// Act
			const result = countWords(text);
			
			// Assert
			assert.strictEqual(result, expected);
		});
	});

	describe('Edge Cases and Boundary Testing', () => {

		it('should handle very long filenames', () => {
			// Arrange
			const longFilename = 'a'.repeat(100) + '.txt';
			
			// Act
			const result = isValidFilename(longFilename);
			
			// Assert
			assert.strictEqual(result, true);
		});

		it('should handle very long text for word counting', () => {
			// Arrange
			const longText = 'word '.repeat(1000); // 1000 words
			const expected = 1000;
			
			// Act
			const result = countWords(longText);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle special unicode characters in names', () => {
			// Arrange
			const unicodeName = 'José';
			const expected = 'Hello José!';
			
			// Act
			const result = createGreeting(unicodeName);
			
			// Assert
			assert.strictEqual(result, expected);
		});

		it('should handle empty string vs null consistently', () => {
			// Arrange & Act & Assert
			assert.strictEqual(isValidFilename(''), isValidFilename(null as any));
			assert.strictEqual(createGreeting(''), createGreeting(null as any));
			assert.strictEqual(countWords(''), countWords(null as any));
		});
	});
});