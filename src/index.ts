import loadConfig from './config';
import Driver from './driver';


async function main() {
  const {username, password} = loadConfig();

  if (!username) {
    process.exit(-1);
  }

  const driver = new Driver(username, password);
  await driver.init();

  await driver.checkCache();
}

main();
