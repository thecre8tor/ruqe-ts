import { describe, it, expect } from 'vitest';
import { Panic } from '../panic';

describe('Panic', () => {
  it('should be an instance of Error', () => {
    const panic = new Panic('test error');
    expect(panic).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const panic = new Panic('test error');
    expect(panic.name).toBe('Panic');
  });

  it('should have the correct message', () => {
    const panic = new Panic('test error message');
    expect(panic.message).toBe('test error message');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new Panic('critical error');
    }).toThrow('critical error');
  });

  it('should be catchable as Panic', () => {
    try {
      throw new Panic('test');
    } catch (e) {
      expect(e).toBeInstanceOf(Panic);
      if (e instanceof Panic) {
        expect(e.message).toBe('test');
      }
    }
  });
});

