import {
  BETTER_AUTH_AFTER_HOOK,
  BETTER_AUTH_BEFORE_HOOK,
  BETTER_AUTH_HOOK,
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.symbols';

describe('BetterAuth Symbols', () => {
  describe('BETTER_AUTH_BEFORE_HOOK', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_BEFORE_HOOK).toBeDefined();
    });

    it('should be a symbol', () => {
      expect(typeof BETTER_AUTH_BEFORE_HOOK).toBe('symbol');
    });

    it('should have the correct description', () => {
      expect(BETTER_AUTH_BEFORE_HOOK.toString()).toBe(
        'Symbol(BETTER_AUTH_BEFORE_HOOK)',
      );
    });
  });

  describe('BETTER_AUTH_AFTER_HOOK', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_AFTER_HOOK).toBeDefined();
    });

    it('should be a symbol', () => {
      expect(typeof BETTER_AUTH_AFTER_HOOK).toBe('symbol');
    });

    it('should have the correct description', () => {
      expect(BETTER_AUTH_AFTER_HOOK.toString()).toBe(
        'Symbol(BETTER_AUTH_AFTER_HOOK)',
      );
    });
  });

  describe('BETTER_AUTH_HOOK', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_HOOK).toBeDefined();
    });

    it('should be a symbol', () => {
      expect(typeof BETTER_AUTH_HOOK).toBe('symbol');
    });

    it('should have the correct description', () => {
      expect(BETTER_AUTH_HOOK.toString()).toBe('Symbol(BETTER_AUTH_HOOK)');
    });
  });

  describe('BETTER_AUTH_INSTANCE', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_INSTANCE).toBeDefined();
    });

    it('should be a symbol', () => {
      expect(typeof BETTER_AUTH_INSTANCE).toBe('symbol');
    });

    it('should have the correct description', () => {
      expect(BETTER_AUTH_INSTANCE.toString()).toBe(
        'Symbol(BETTER_AUTH_INSTANCE)',
      );
    });
  });

  describe('BETTER_AUTH_OPTIONS', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_OPTIONS).toBeDefined();
    });

    it('should be a symbol', () => {
      expect(typeof BETTER_AUTH_OPTIONS).toBe('symbol');
    });

    it('should have the correct description', () => {
      expect(BETTER_AUTH_OPTIONS.toString()).toBe(
        'Symbol(BETTER_AUTH_OPTIONS)',
      );
    });
  });

  describe('Symbol uniqueness', () => {
    it('should have unique symbol values', () => {
      const symbols = [
        BETTER_AUTH_BEFORE_HOOK,
        BETTER_AUTH_AFTER_HOOK,
        BETTER_AUTH_HOOK,
        BETTER_AUTH_INSTANCE,
        BETTER_AUTH_OPTIONS,
      ];

      // Check that all symbols are unique
      const uniqueSymbols = new Set(symbols);
      expect(uniqueSymbols.size).toBe(symbols.length);
    });

    it('should not be equal to each other', () => {
      expect(BETTER_AUTH_BEFORE_HOOK).not.toBe(BETTER_AUTH_AFTER_HOOK);
      expect(BETTER_AUTH_BEFORE_HOOK).not.toBe(BETTER_AUTH_HOOK);
      expect(BETTER_AUTH_BEFORE_HOOK).not.toBe(BETTER_AUTH_INSTANCE);
      expect(BETTER_AUTH_BEFORE_HOOK).not.toBe(BETTER_AUTH_OPTIONS);
      expect(BETTER_AUTH_AFTER_HOOK).not.toBe(BETTER_AUTH_HOOK);
      expect(BETTER_AUTH_AFTER_HOOK).not.toBe(BETTER_AUTH_INSTANCE);
      expect(BETTER_AUTH_AFTER_HOOK).not.toBe(BETTER_AUTH_OPTIONS);
      expect(BETTER_AUTH_HOOK).not.toBe(BETTER_AUTH_INSTANCE);
      expect(BETTER_AUTH_HOOK).not.toBe(BETTER_AUTH_OPTIONS);
      expect(BETTER_AUTH_INSTANCE).not.toBe(BETTER_AUTH_OPTIONS);
    });
  });
});
