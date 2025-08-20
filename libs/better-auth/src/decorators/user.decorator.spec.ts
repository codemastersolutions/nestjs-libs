import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from './user.decorator';

describe('User Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;
  let decoratorFunction: any;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    // Extract the decorator function for testing
    decoratorFunction = (User as any).factory;
  });

  it('should return the entire user object when no data parameter is provided', () => {
    const result = decoratorFunction(undefined, mockExecutionContext);
    
    expect(result).toEqual({
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should return specific user property when data parameter is provided', () => {
    const result = decoratorFunction('email', mockExecutionContext);
    
    expect(result).toBe('test@example.com');
  });

  it('should return specific user property (id) when data parameter is provided', () => {
    const result = decoratorFunction('id', mockExecutionContext);
    
    expect(result).toBe('123');
  });

  it('should return undefined when user property does not exist', () => {
    const result = decoratorFunction('nonexistent', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should return undefined when user is not present in request', () => {
    mockRequest.user = undefined;
    
    const result = decoratorFunction(undefined, mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should return undefined when user is null and data parameter is provided', () => {
    mockRequest.user = null;
    
    const result = decoratorFunction('email', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should handle empty user object', () => {
    mockRequest.user = {};
    
    const result = decoratorFunction('email', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should return empty object when user is empty and no data parameter', () => {
    mockRequest.user = {};
    
    const result = decoratorFunction(undefined, mockExecutionContext);
    
    expect(result).toEqual({});
  });
});