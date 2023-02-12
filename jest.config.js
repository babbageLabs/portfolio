const esModules = ['@jest'].join('|');

module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  transformIgnorePatterns: [`node_modules/(?!${esModules}/)`],
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
