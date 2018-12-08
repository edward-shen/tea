import Config from '../src/Config';

jest.mock('fs');

// tslint:disable-next-line:no-var-requires
const fs = require('fs');

const envExpected = { username: 'testuser', password: 'testpass' };
const fileExpected = { username: 'fileuser', password: 'filepass' };
const mockFiles = {
  'config.toml': `[driver]\nusername = "fileuser"\npassword = "filepass"\n`,
};

describe('loading environment variables', () => {

  beforeAll(() => {
    fs.__setMockFiles(mockFiles);
  });

  beforeEach(() => {
    delete process.env.TEA_USERNAME;
    delete process.env.TEA_PASSWORD;
  });

  it('should accept environment variables when both are present', () => {
    process.env.TEA_USERNAME = envExpected.username;
    process.env.TEA_PASSWORD = envExpected.password;

    expect(Config).toStrictEqual(envExpected);
  });

  it('should try to load config file if username env var is missing', () => {
    process.env.TEA_PASSWORD = 'testpass';

    expect(Config).toStrictEqual(fileExpected);
  });

  it('should try to load config file if password env var is missing', () => {
    process.env.TEA_USERNAME = 'testuser';

    expect(Config).toStrictEqual(fileExpected);
  });

  it('should try to load config file if both env vars are missing', () => {
    expect(Config).toStrictEqual(fileExpected);
  });
});

describe('config file confuckery', () => {
  const expected = { username: 'fileuser', password: 'filepass' };

  it('should load the config if it exists', () => {
    fs.__setMockFiles(mockFiles);

    expect(Config).toStrictEqual(expected);
  });

  it(`should exit after generating a file if it doesn't exist`, () => {
    fs.__setMockFiles();
    expect(Config).toBe(undefined);
    expect(fs.existsSync('config.toml')).toBeDefined();
  });

  it('should throw an error if there was a parse error', () => {
    fs.__setMockFiles({ 'config.toml': 'potato' });
    expect(Config).toThrowError('Parsing error');
  });
});
