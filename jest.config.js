module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    '\\.html$': '<rootDir>/node_modules/jest-preset-angular/build/legacyHTMLLoader.js'
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json']
};
