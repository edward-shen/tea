import { existsSync, readFileSync } from 'fs';
import { copyFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'toml';

import ExitCode from './ExitCodes';
interface Config {
  driver: {
    username: string;
    password: string;
  };
  database: {
    location: string;
  };
  mongodb: {
    address: string;
    port: number;
  };
}

const CONFIG_FILENAME = 'config.toml';

/**
 * Loads a username and password from the config file. If it fails to properly
 * load the config file, then it will exit.
 */
function loadConfig(): Config {

  let envData = null;

  if (process.env.TEA_USERNAME && process.env.TEA_PASSWORD) {
    envData = {
      driver: {
        username: process.env.TEA_USERNAME,
        password: process.env.TEA_PASSWORD,
      },
    };
  }

  let config: string;

  // Attempt to load from config file.
  if (existsSync(CONFIG_FILENAME)) {
    config = readFileSync(CONFIG_FILENAME, 'utf8');
  } else {
    copyFileSync(
      resolve(__dirname, `example_${CONFIG_FILENAME}`),
      resolve(__dirname, CONFIG_FILENAME));
    console.error(`Config not found. Please fill out ${CONFIG_FILENAME}.`);
    process.exit(ExitCode.CONFIG_NOT_FOUND);
  }

  // Attempt to parse config file
  try {
    return {
      ...parse(config),
      ...envData,
    };
  } catch (e) {
    console.error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`);
    process.exit(ExitCode.CONFIG_PARSE_ERR);
  }
}

export default loadConfig();
export { Config };
