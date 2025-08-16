import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';

describe('BetterAuth Constants', () => {
  describe('BETTER_AUTH_OPTIONS', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_OPTIONS).toBeDefined();
    });

    it('should be a symbol token', () => {
      expect(typeof BETTER_AUTH_OPTIONS).toBe('symbol');
    });

    it('should have the correct description', () => {
      expect(BETTER_AUTH_OPTIONS.toString()).toBe(
        'Symbol(BETTER_AUTH_OPTIONS)',
      );
    });
  });

  describe('BETTER_AUTH_INSTANCE', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_INSTANCE).toBeDefined();
    });

    it('should be a symbol token', () => {
      expect(typeof BETTER_AUTH_INSTANCE).toBe('symbol');
    });

    it('should have the correct description', () => {
      expect(BETTER_AUTH_INSTANCE.toString()).toBe(
        'Symbol(BETTER_AUTH_INSTANCE)',
      );
    });
  });

  describe('Constants uniqueness', () => {
    it('should have unique values', () => {
      expect(BETTER_AUTH_OPTIONS).not.toBe(BETTER_AUTH_INSTANCE);
    });
  });
});
