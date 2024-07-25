// eslint-disable-next-line  no-undef
module.exports = {
  testEnvironment: 'node',
  transform: {
    '\\.tsx?$': ['./jestMetaTransformer', 'ts-jest'],
  },
  moduleNameMapper: {
    '\\.(html\\?raw)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
