import { Result, Ok, Err, Option, Some, None } from '../src';

/**
 * Basic usage example demonstrating Result and Option types
 */

// Example 1: Using Result for error handling
function stringToNum(str: string): Result<number, string> {
  try {
    const value = parseInt(str, 10);
    if (isNaN(value)) {
      return new Err('Value is not a number');
    }
    return new Ok(value);
  } catch (err) {
    return new Err('Value is none');
  }
}

console.log('=== Result Example ===');

// Calling stringToNum with an invalid input will return an Err
const trigger = stringToNum('%65');

// With pattern matching, we can recover from the error and return 0 instead
const match = trigger.match({
  ok: (value) => value,
  err: () => 0,
});

console.log(`Result: ${match}`); // Result: 0

// Example 2: Option pattern matching
console.log('\n=== Option Example ===');

const option: Option<string> = new None();

const data = option.match({
  some: (value) => value,
  none: () => 'empty data',
});

console.log(`Option value: ${data}`); // Option value: empty data

// Example 3: Result pattern matching with type conversion
console.log('\n=== Result with Type Conversion ===');

const result: Result<number, string> = new Err('24');

const value = result.match({
  ok: (value) => value,
  err: (value) => parseInt(value, 10) || 0,
});

console.log(`Result value: ${value}`); // Result value: 24

// Example 4: Successful Result
console.log('\n=== Successful Result ===');

const successResult = stringToNum('42');
const successValue = successResult.match({
  ok: (value) => `Parsed: ${value}`,
  err: (error) => `Error: ${error}`,
});

console.log(successValue); // Parsed: 42

// Example 5: Option with Some
console.log('\n=== Option with Some ===');

const someOption: Option<string> = new Some('Hello, World!');
const someValue = someOption.match({
  some: (value) => value.toUpperCase(),
  none: () => 'No value',
});

console.log(someValue); // HELLO, WORLD!

