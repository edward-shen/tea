import { existsSync, readFileSync, writeFileSync } from 'fs';
import { parse } from 'toml';

interface Config {
  username: string;
  password: string;
}

const CONFIG_FILENAME = 'config.toml';

/**
 * Loads a username and password from the config file. If it fails to properly
 * load the config file, then it will exit.
 */
function loadConfig(): Config {

  if (process.env.TEA_USERNAME && process.env.TEA_PASSWORD) {
    return {
      username: process.env.TEA_USERNAME,
      password: process.env.TEA_PASSWORD,
    };
  }

  let config: string;

  // Attempt to load from config file.
  if (existsSync(CONFIG_FILENAME)) {
    config = readFileSync(CONFIG_FILENAME, 'utf8');
  } else {
    writeFileSync(CONFIG_FILENAME, 'username = \npassword = \n');
    console.error(`Config not found. Please fill out ${CONFIG_FILENAME}`);
    return;
  }

  // Attempt to parse config file
  try {
    return parse(config);
  } catch (e) {
    throw Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`);
  }
}

export default loadConfig;
