import loadConfig from './config';

jest.mock('fs');

const fs = require('fs');

const env_expected = { username: "testuser", password: "testpass" };
const file_expected = { username: "fileuser", password: "filepass" };

describe('loading environment variables', () => {

  beforeAll(() => {
    fs.__setMockFiles(
      { 'config.toml': `username = "fileuser"\npassword = "filepass"\n` }
    );
  })

  beforeEach(() => {
    delete process.env.TEA_USERNAME;
    delete process.env.TEA_PASSWORD;
  });

  it('should accept environment variables when both are present', () => {
    process.env.TEA_USERNAME = env_expected.username;
    process.env.TEA_PASSWORD = env_expected.password;

    expect(loadConfig()).toStrictEqual(env_expected);
  });

  it('should try to load config file if username env var is missing', () => {
    process.env.TEA_PASSWORD = "testpass";

    expect(loadConfig()).toStrictEqual(file_expected);
  });

  it('should try to load config file if password env var is missing', () => {
    process.env.TEA_USERNAME = "testuser";

    expect(loadConfig()).toStrictEqual(file_expected);
  });

  it('should try to load config file if both env vars are missing', () => {
    expect(loadConfig()).toStrictEqual(file_expected);
  });
});

describe('config file confuckery', () => {
  const expected = { username: "fileuser", password: "filepass" };

  it('should load the config if it exists', () => {
    fs.__setMockFiles(
      { 'config.toml': `username = "fileuser"\npassword = "filepass"\n` }
    );

    expect(loadConfig()).toStrictEqual(expected);
  });

  it(`should exit after generating a file if it doesn't exist`, () => {
    fs.__setMockFiles();
    expect(loadConfig()).toBe(null);
    expect(fs.existsSync('config.toml')).toBeDefined();
  });

  it('should throw an error if there was a parse error', () => {
    fs.__setMockFiles({ 'config.toml': 'potato' });
    expect(loadConfig).toThrowError('Parsing error');
  });
});
