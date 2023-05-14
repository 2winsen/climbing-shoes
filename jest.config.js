// eslint-disable-next-line  no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper:{
    '\\.(html\\?raw)$': '<rootDir>/__mocks__/fileMock.js'
}
};
