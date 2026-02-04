import { Result, Ok, Err, Panic } from '../src';

/**
 * Example demonstrating recoverable and unrecoverable errors
 */

// Recoverable Error Example
console.log('=== Recoverable Errors ===\n');

type ListMap = Array<{ first_name?: string; last_name?: string }>;
type AppError = string;

const data: ListMap = [
  { first_name: 'Tunbnad', last_name: 'Smart' },
  { first_name: 'Lambo', last_name: 'Turnner' },
];

// Returns a Result that is Err if ListMap is empty
function getFirstName(data: ListMap): Result<string[], AppError> {
  if (data.length > 0) {
    return new Ok(data.map((user) => user.first_name || ''));
  } else {
    return new Err('[error]: an error occurred!');
  }
}

// Success case
const firstNames1 = getFirstName(data);
if (firstNames1.isOk()) {
  console.log('First names:', firstNames1.unwrap()); // [Tunbnad, Lambo]
}

// Error case - handled gracefully
const firstNames2 = getFirstName([]);
const recovered = firstNames2.match({
  ok: (names) => names,
  err: (error) => {
    console.log(`Recovered from error: ${error}`);
    return [];
  },
});
console.log('Recovered value:', recovered); // []

// Unrecoverable Error Example
console.log('\n=== Unrecoverable Errors ===\n');

function demonstrateUnrecoverableError() {
  try {
    // Unwrapping an Err value will trigger a Panic
    const errorResult: Result<number, string> = new Err('critical error');
    errorResult.unwrap(); // This will throw a Panic
  } catch (error) {
    if (error instanceof Panic) {
      console.log(`Caught Panic: ${error.message}`);
    }
  }
}

demonstrateUnrecoverableError();

// Example with safe checking
console.log('\n=== Safe Result Checking ===\n');

function safelyHandleResult<T, E>(result: Result<T, E>): T | null {
  if (result.isOk()) {
    return result.unwrap();
  } else {
    console.log('Result is an error, returning null');
    return null;
  }
}

const okResult = new Ok(42);
const errResult = new Err('something went wrong');

console.log('Safe handling (Ok):', safelyHandleResult(okResult)); // 42
console.log('Safe handling (Err):', safelyHandleResult(errResult)); // null

