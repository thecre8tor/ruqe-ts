# ruqe

**Ruqe** brings the **Result-Oriented Programming** paradigm 🔥 to TypeScript and JavaScript 🎯 programs, with its main purpose being to simplify development processes. It helps you create predictable responses from your functions or method operations 🎉.

[![npm version](https://img.shields.io/npm/v/ruqe.svg)](https://www.npmjs.com/package/ruqe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is Result-Oriented Programming?

**Result-Oriented programming** is a paradigm that enables you to take a results-focused approach to your app's architecture and design, giving you control over your application development processes and expected results ✨.

**Ruqe** provides convenient types and methods such as the `Result`, `Option`, `Pattern Matching`, etc. Additionally, the library provides excellent `techniques for handling errors gracefully without resorting to exceptions`.

Dive into **Result-Oriented Programming** with **Ruqe**, ensuring your app remains `responsive and reliable` 🚀.

## Features

- 🦀 **Rust-inspired** - Familiar Result and Option types
- 🎯 **Type-safe** - Full TypeScript support with strict typing
- 🚀 **Lightweight** - Zero dependencies
- 📦 **Tree-shakeable** - Only import what you need
- 🧪 **Well-tested** - Comprehensive test coverage
- 💪 **Functional** - Encourages functional programming patterns

## Installation

```bash
npm install ruqe
```

or

```bash
yarn add ruqe
```

or

```bash
pnpm add ruqe
```

## Quick Start

```typescript
import { Result, Ok, Err, Option, Some, None } from 'ruqe';

// Using Result for error handling
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return new Err('Division by zero');
  }
  return new Ok(a / b);
}

const result = divide(10, 2);
const value = result.match({
  ok: (v) => `Result: ${v}`,
  err: (e) => `Error: ${e}`,
});
console.log(value); // "Result: 5"

// Using Option for nullable values
function findUser(id: string): Option<User> {
  const user = database.find(id);
  return user ? new Some(user) : new None();
}

const user = findUser('123');
user.match({
  some: (u) => console.log(`Found: ${u.name}`),
  none: () => console.log('User not found'),
});
```

## Core Types

### Result<T, E>

Result is the type used for returning and propagating errors. It is a type with the variants, `Ok(T)`, representing success and containing a value, and `Err(E)`, representing error and containing an error value.

```typescript
import { Result, Ok, Err } from 'ruqe';

function parseNumber(str: string): Result<number, string> {
  const num = parseInt(str, 10);
  if (isNaN(num)) {
    return new Err('Not a valid number');
  }
  return new Ok(num);
}

const result = parseNumber('42');

// Pattern matching
const value = result.match({
  ok: (num) => num * 2,
  err: (error) => 0,
});

// Check if Ok or Err
if (result.isOk()) {
  console.log(result.unwrap()); // 42
}

// Convert to Option
const option = result.ok(); // Some(42)
```

### Option<T>

Option represents an optional value: every Option is either `Some` and contains a value, or `None`, and does not.

```typescript
import { Option, Some, None } from 'ruqe';

function getFirstElement<T>(arr: T[]): Option<T> {
  return arr.length > 0 ? new Some(arr[0]) : new None();
}

const option = getFirstElement([1, 2, 3]);

// Pattern matching
const value = option.match({
  some: (v) => v,
  none: () => -1,
});

// Check if Some or None
if (option.isSome()) {
  console.log(option.unwrap()); // 1
}
```

## Advanced Usage

### Chaining Operations

```typescript
import { Ok, Err } from 'ruqe';

const result = new Ok(5).ok().match({
  some: (v) => new Ok(v * 2),
  none: () => new Err('No value'),
});
```

### Working with Async Functions

```typescript
async function fetchUser(id: string): Promise<Result<User, Error>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return new Ok(data);
  } catch (error) {
    return new Err(error as Error);
  }
}

// Usage
const userResult = await fetchUser('123');
userResult.match({
  ok: (user) => console.log(`Welcome, ${user.name}!`),
  err: (error) => console.error(`Failed: ${error.message}`),
});
```

### Recoverable vs Unrecoverable Errors

In **Ruqe**, there is a clear distinction between recoverable and unrecoverable errors.

**Recoverable errors** do not cause a program to terminate completely. Ruqe makes errors recoverable by matching the returned value of type `Result` and `Option` with the `.match()` method.

```typescript
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

// Recoverable - we handle the error gracefully
const result = stringToNum('%65');
const value = result.match({
  ok: (v) => v,
  err: () => 0, // Provide fallback value
});
console.log(value); // 0
```

**Unrecoverable errors** cause a program to terminate immediately. In Ruqe, `Panic` terminates the program when it comes across an unrecoverable error.

```typescript
// This will throw a Panic and terminate
const result = new Err('critical error');
result.unwrap(); // Panic!
```

## API Reference

### Result<T, E>

- `isOk(): boolean` - Returns true if the result is Ok
- `isErr(): boolean` - Returns true if the result is Err
- `ok(): Option<T>` - Converts Result to Option, discarding the error
- `err(): Option<E>` - Converts Result to Option, discarding the success value
- `unwrap(): T` - Returns the Ok value or throws Panic
- `match<R>(pattern): R` - Pattern matching

### Option<T>

- `isSome(): boolean` - Returns true if the option is Some
- `isNone(): boolean` - Returns true if the option is None
- `unwrap(): T` - Returns the Some value or throws Panic
- `match<R>(pattern): R` - Pattern matching

## TypeScript Support

Ruqe is written in TypeScript and provides full type safety:

```typescript
// Type inference works seamlessly
const result = new Ok(42); // Result<number, never>
const error = new Err('failed'); // Result<never, string>

// Generics are fully supported
function process<T, E>(result: Result<T, E>): T | null {
  return result.match({
    ok: (value) => value,
    err: () => null,
  });
}
```

## Inspiration

This library is inspired by:

- [Rust's Result and Option types](https://doc.rust-lang.org/std/result)
- [Functional programming patterns](https://en.wikipedia.org/wiki/Functional_programming)

## License

MIT © Alexander Nitiola

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [GitHub Repository](https://github.com/thecre8tor/ruqe-ts)
- [Issue Tracker](https://github.com/thecre8tor/ruqe-ts/issues)
- [npm Package](https://www.npmjs.com/package/ruqe-ts)
