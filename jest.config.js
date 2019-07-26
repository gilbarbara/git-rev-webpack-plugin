module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
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
