/**
 * Copyright (c) 2022 Alexander Nitiola
 * 
 * Panic terminates the program when it comes across an unrecoverable error.
 * 
 * In other words, Panic is associated with critical errors:
 * - thrown when unwrapping a Result that is Err.
 * - thrown when unwrapping an Option that is None.
 * 
 * @example
 * ```typescript
 * throw new Panic("panic with error message");
 * ```
 */
export class Panic extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Panic';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Panic);
    }
  }
}

