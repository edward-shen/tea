import loadConfig from './config';
import Driver from './driver';


async function main() {
  const {username, password} = loadConfig();
  const driver = new Driver(username, password);
  await driver.init();

  await driver.updateCache();
}

main();
