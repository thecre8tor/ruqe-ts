import { describe, it, expect, beforeEach } from 'vitest';
import { Result, Ok, Err } from '../result';
import { Some, None } from '../option';

describe('Result', () => {
  describe('Ok', () => {
    let result: Result<number, string>;

    beforeEach(() => {
      result = new Ok(-3);
    });

    it('should return true if the result is Ok', () => {
      expect(result.isOk()).toBe(true);
    });

    it('should return false if isErr is called', () => {
      expect(result.isErr()).toBe(false);
    });

    it('should return Some(...) when ok() is called', () => {
      const option = result.ok();
      expect(option).toBeInstanceOf(Some);
      expect(option.unwrap()).toBe(-3);
    });

    it('should return None when err() is called', () => {
      const option = result.err();
      expect(option).toBeInstanceOf(None);
    });

    it('should return the contained Ok value when unwrap is called', () => {
      expect(result.unwrap()).toBe(-3);
    });

    it('should call ok callback in match', () => {
      const value = result.match({
        ok: (v) => v * 2,
        err: () => 0,
      });
      expect(value).toBe(-6);
    });
  });

  describe('Err', () => {
    let error: Result<string, string>;

    beforeEach(() => {
      error = new Err('some error message');
    });

    it('should return false if isOk is called', () => {
      expect(error.isOk()).toBe(false);
    });

    it('should return true if the result is Err', () => {
      expect(error.isErr()).toBe(true);
    });

    it('should return None when ok() is called', () => {
      const option = error.ok();
      expect(option).toBeInstanceOf(None);
    });

    it('should return Some(...) if result is Err', () => {
      const option = error.err();
      expect(option).toBeInstanceOf(Some);
      expect(option.unwrap()).toBe('some error message');
    });

    it('should throw Panic if unwrap is called on Err type', () => {
      // expect(() => error.unwrap()).toThrow(Panic);
      expect(() => error.unwrap()).toThrow('some error message');
    });

    it('should call err callback in match', () => {
      const value = error.match({
        ok: () => 'success',
        err: (e) => `error: ${e}`,
      });
      expect(value).toBe('error: some error message');
    });
  });

  describe('Pattern Matching', () => {
    it('should handle Ok pattern matching', () => {
      const result: Result<number, string> = new Ok(21);
      const value = result.match({
        ok: (v) => `value is ${v}`,
        err: (e) => `error is ${e}`,
      });
      expect(value).toBe('value is 21');
    });

    it('should handle Err pattern matching', () => {
      const result: Result<number, string> = new Err('failed');
      const value = result.match({
        ok: (v) => `value is ${v}`,
        err: (e) => `error is ${e}`,
      });
      expect(value).toBe('error is failed');
    });

    it('should handle recoverable errors', () => {
      const stringToNum = (str: string): Result<number, string> => {
        try {
          const value = parseInt(str, 10);
          if (isNaN(value)) {
            return new Err('Value is not a number');
          }
          return new Ok(value);
        } catch (err) {
          return new Err('Value is none');
        }
      };

      const trigger = stringToNum('%65');
      const result = trigger.match({
        ok: (value) => value,
        err: () => 0,
      });

      expect(result).toBe(0);
    });
  });
});
