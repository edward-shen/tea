const ignore_paths = ['dist'];

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ignore_paths,
  coveragePathIgnorePatterns: ignore_paths,
  modulePathIgnorePatterns: ignore_paths,
  watchPathIgnorePatterns: ignore_paths,
};
