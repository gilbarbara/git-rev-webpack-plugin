module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  moduleDirectories: ['node_modules', 'src', './'],
  moduleFileExtensions: ['js', 'ts'],
  testRegex: '/test/.*?\\.(test|spec)\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
};
