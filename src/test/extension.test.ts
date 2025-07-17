import * as assert from 'assert';

describe('Extension Test Suite', () => {

	it('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	it('String operations', () => {
		assert.strictEqual('hello'.toUpperCase(), 'HELLO');
		assert.strictEqual('  test  '.trim(), 'test');
	});

	it('Array operations', () => {
		const numbers = [1, 2, 3, 4, 5];
		const even = numbers.filter(n => n % 2 === 0);
		assert.deepStrictEqual(even, [2, 4]);
	});

});