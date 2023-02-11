/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@App/*': ['src/*'],
    },
  },
};
