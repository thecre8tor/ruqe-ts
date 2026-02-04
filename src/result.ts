/**
 * Copyright (c) 2022 Alexander Nitiola
 *
 * Functions return Result whenever errors are expected and recoverable.
 */

import { Option, Some, None } from './option';

/**
 * The OkArm represents the Ok callback function
 */
export type OkArm<R, T> = (value: T) => R;

/**
 * The ErrArm represents the Err callback function
 */
export type ErrArm<R, E> = (error: E) => R;

/**
 * Result is the type used for returning and propagating errors.
 * It is a type with the variants, Ok(T), representing success and containing a value,
 * and Err(E), representing error and containing an error value.
 */
export abstract class Result<T, E> {
  protected abstract readonly _value?: T;
  protected abstract readonly _error?: E;

  /**
   * Returns `true` if the result is `Ok`.
   *
   * @example
   * ```typescript
   * const x: Result<number, string> = new Ok(21);
   * assert(x.isOk() === true);
   *
   * const y: Result<number, string> = new Err("an error occurred.");
   * assert(y.isOk() === false);
   * ```
   */
  abstract isOk(): boolean;

  /**
   * Returns `true` if the result is `Err`.
   *
   * @example
   * ```typescript
   * const x: Result<number, string> = new Ok(21);
   * assert(x.isErr() === false);
   *
   * const y: Result<number, string> = new Err("an error occurred.");
   * assert(y.isErr() === true);
   * ```
   */
  abstract isErr(): boolean;

  /**
   * Converts from `Result<T, E>` to `Option<T>`.
   *
   * Converts self into an Option<T>, consuming self,
   * and discarding the error, if any.
   */
  abstract ok(): Option<T>;

  /**
   * Converts from `Result<T, E>` to `Option<E>`.
   *
   * Converts self into an Option<E>, consuming self,
   * and discarding the success value, if any.
   */
  abstract err(): Option<E>;

  /**
   * Returns the contained Ok value, consuming the self value.
   *
   * Throws Panic if the value is an Err.
   */
  abstract unwrap(): T;

  /**
   * Pattern matching for Result values
   */
  abstract match<R>(pattern: { ok: OkArm<R, T>; err: ErrArm<R, E> }): R;
}

/**
 * Contains the success value
 */
export class Ok<T, E = never> extends Result<T, E> {
  protected readonly _value: T;
  protected readonly _error?: E = undefined;

  constructor(value: T) {
    super();
    this._value = value;
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return false;
  }

  ok(): Option<T> {
    return new Some(this._value);
  }

  err(): Option<E> {
    return new None<E>();
  }

  match<R>(pattern: { ok: OkArm<R, T>; err: ErrArm<R, E> }): R {
    return pattern.ok(this._value);
  }

  unwrap(): T {
    return this._value;
  }
}

/**
 * Contains the error value
 */
export class Err<T = never, E = unknown> extends Result<T, E> {
  protected readonly _value?: T = undefined;
  protected readonly _error: E;

  constructor(error: E) {
    super();
    this._error = error;
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  ok(): Option<T> {
    return new None<T>();
  }

  err(): Option<E> {
    return new Some(this._error);
  }

  match<R>(pattern: { ok: OkArm<R, T>; err: ErrArm<R, E> }): R {
    return pattern.err(this._error);
  }

  unwrap(): T {
    throw this._error;
  }
}
