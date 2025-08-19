import { AuthRequired, AUTH_METADATA_KEY } from './auth.decorator';
import { Reflector } from '@nestjs/core';

describe('AuthRequired Decorator', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('should set auth metadata', () => {
    class TestController {
      @AuthRequired()
      testMethod() {
        return 'test';
      }
    }

    const metadata = reflector.get(AUTH_METADATA_KEY, TestController.prototype.testMethod);
    expect(metadata).toBe(true);
  });

  it('should work on class level', () => {
    @AuthRequired()
    class TestController {
      testMethod() {
        return 'test';
      }
    }

    const metadata = reflector.get(AUTH_METADATA_KEY, TestController);
    expect(metadata).toBe(true);
  });
});