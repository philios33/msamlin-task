module.exports = {
    testEnvironment: 'jsdom',
    moduleDirectories: ['./node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/src/jest-setup.js'],
    moduleNameMapper: {
        '\\.(scss)$': '<rootDir>/src/styleMock.ts',
    }
}
