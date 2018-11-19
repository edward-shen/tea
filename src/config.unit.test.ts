import loadConfig from './config';

jest.mock('./config');``

describe('loading environment variables', () => {

  beforeEach(() => {
    delete process.env.TEA_USERNAME;
    delete process.env.TEA_PASSWORD;
  });

  it('should accept environment variables when both are present', () => {
    const expected = { username: "testuser", password: "testpass" };

    process.env.TEA_USERNAME = expected.username;
    process.env.TEA_PASSWORD = expected.password;

    expect(loadConfig()).toStrictEqual(expected);
  });

  it('should try to load config file if username env var is missing', () => {
    const expected = { username: "fileuser", password: "filepass" };

    process.env.TEA_PASSWORD = "testpass";

    console.log(loadConfig());
    expect(loadConfig()).toStrictEqual(expected);
  });

  it('should try to load config file if password env var is missing', () => {

  });

  it('should try to load config file if both env vars are missing', () => {

  });
});

describe('config file generation', () => {
  it(`should generate a config file if it doesn't exist`, () => {

  });
});
