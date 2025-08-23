// Jest setup file for API tests
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock console methods to reduce test noise
global.console = {
  ...console,
  // Keep console.log and console.error for debugging
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Set test environment
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Mock API tokens for tests
process.env.NOTION_TOKEN = 'secret_test_token_12345678901234567890123456';
process.env.AIRTABLE_TOKEN = 'patTEST123456789.1234567890123456789012345678901234567890';

// Global test timeout
jest.setTimeout(30000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

export {};