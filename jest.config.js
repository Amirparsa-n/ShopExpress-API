/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@routes/(.*)$': '<rootDir>/src/routes/$1',
        '^@data/(.*)$': '<rootDir>/src/data/$1',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@configs/(.*)$': '<rootDir>/src/configs/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    moduleFileExtensions: ['ts', 'js'],
    roots: ['<rootDir>/src'],
};
