const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/*.ts',
    '!<rootDir>/src/modules/**/schemas/*.ts',
    '!<rootDir>/src/modules/**/routes/*.ts',
    '!<rootDir>/src/**/i-*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  setupFiles: ['<rootDir>/jest-setup.js'],
  clearMocks: true,
  coverageProvider: 'v8',
  coverageReporters: ['text-summary', 'lcov'],
};
