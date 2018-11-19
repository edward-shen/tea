import loadConfig from './config';
import Driver from './driver';

const {username, password} = loadConfig();

async function main() {
  const driver = new Driver(username, password);
  await driver.init();

  await driver.updateCache();
}

main();
