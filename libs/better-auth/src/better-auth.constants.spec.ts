import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';

describe('BetterAuth Constants', () => {
  describe('BETTER_AUTH_OPTIONS', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_OPTIONS).toBeDefined();
    });

    it('should be a string token', () => {
      expect(typeof BETTER_AUTH_OPTIONS).toBe('string');
    });

    it('should have the correct value', () => {
      expect(BETTER_AUTH_OPTIONS).toBe('BETTER_AUTH_OPTIONS');
    });
  });

  describe('BETTER_AUTH_INSTANCE', () => {
    it('should be defined', () => {
      expect(BETTER_AUTH_INSTANCE).toBeDefined();
    });

    it('should be a string token', () => {
      expect(typeof BETTER_AUTH_INSTANCE).toBe('string');
    });

    it('should have the correct value', () => {
      expect(BETTER_AUTH_INSTANCE).toBe('BETTER_AUTH_INSTANCE');
    });
  });

  describe('Constants uniqueness', () => {
    it('should have unique values', () => {
      expect(BETTER_AUTH_OPTIONS).not.toBe(BETTER_AUTH_INSTANCE);
    });
  });
});
