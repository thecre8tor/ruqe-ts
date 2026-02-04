/**
 * Copyright (c) 2022 Alexander Nitiola
 */

import { Panic } from './panic';

/**
 * The SomeArm represents the Some callback function
 */
export type SomeArm<R, T> = (value: T) => R;

/**
 * The NoneArm represents the None callback function
 */
export type NoneArm<R> = () => R;

/**
 * Option represents an optional value: every Option is either Some and contains a value,
 * or None, and does not.
 */
export abstract class Option<T> {
  protected abstract readonly _value?: T;

  /**
   * Returns the contained value, consuming the Option.
   * Throws Panic if the value is None.
   */
  abstract unwrap(): T;

  /**
   * Pattern matching for Option values
   */
  abstract match<R>(pattern: { some: SomeArm<R, T>; none: NoneArm<R> }): R;

  /**
   * Returns true if the option is a Some value
   */
  abstract isSome(): boolean;

  /**
   * Returns true if the option is a None value
   */
  abstract isNone(): boolean;
}

/**
 * Some value of type T
 */
export class Some<T> extends Option<T> {
  protected readonly _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  unwrap(): T {
    return this._value;
  }

  match<R>(pattern: { some: SomeArm<R, T>; none: NoneArm<R> }): R {
    return pattern.some(this._value);
  }

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }
}

/**
 * No value
 */
export class None<T = never> extends Option<T> {
  protected readonly _value?: T = undefined;

  unwrap(): T {
    throw new Panic("called `Option::unwrap()` on a `None` value");
  }

  match<R>(pattern: { some: SomeArm<R, T>; none: NoneArm<R> }): R {
    return pattern.none();
  }

  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }
}

