import { describe, it, expect, beforeEach } from 'vitest';
import { Option, Some, None } from '../option';
import { Panic } from '../panic';

describe('Option', () => {
  describe('Some', () => {
    let option: Option<number>;

    beforeEach(() => {
      option = new Some(42);
    });

    it('should return true for isSome', () => {
      expect(option.isSome()).toBe(true);
    });

    it('should return false for isNone', () => {
      expect(option.isNone()).toBe(false);
    });

    it('should unwrap the contained value', () => {
      expect(option.unwrap()).toBe(42);
    });

    it('should call some callback in match', () => {
      const value = option.match({
        some: (v) => v * 2,
        none: () => 0,
      });
      expect(value).toBe(84);
    });

    it('should work with string values', () => {
      const strOption = new Some('hello');
      expect(strOption.unwrap()).toBe('hello');
    });
  });

  describe('None', () => {
    let option: Option<number>;

    beforeEach(() => {
      option = new None<number>();
    });

    it('should return false for isSome', () => {
      expect(option.isSome()).toBe(false);
    });

    it('should return true for isNone', () => {
      expect(option.isNone()).toBe(true);
    });

    it('should throw Panic when unwrap is called', () => {
      expect(() => option.unwrap()).toThrow(Panic);
      expect(() => option.unwrap()).toThrow(
        "called `Option::unwrap()` on a `None` value"
      );
    });

    it('should call none callback in match', () => {
      const value = option.match({
        some: (v) => v * 2,
        none: () => -1,
      });
      expect(value).toBe(-1);
    });
  });

  describe('Pattern Matching', () => {
    it('should handle Some pattern matching with string', () => {
      const option: Option<string> = new Some('data');
      const result = option.match({
        some: (value) => value,
        none: () => 'empty',
      });
      expect(result).toBe('data');
    });

    it('should handle None pattern matching with string', () => {
      const option: Option<string> = new None();
      const result = option.match({
        some: (value) => value,
        none: () => 'empty data',
      });
      expect(result).toBe('empty data');
    });

    it('should handle complex type transformations', () => {
      const option: Option<number> = new Some(10);
      const doubled = option.match({
        some: (v) => new Some(v * 2),
        none: () => new None<number>(),
      });
      expect(doubled.unwrap()).toBe(20);
    });
  });
});

