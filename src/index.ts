import CacheStatus from './cache/CacheStatus';
import metacache from './cache/metacache';
import loadConfig from './config';
import Driver from './driver';

async function main() {
  const {username, password} = loadConfig();

  if (!username || !password) {
    process.exit(-1);
  }

  const driver = new Driver(username, password);
  await driver.auth();
  const status = await driver.checkCache();
  if (status === CacheStatus.OUT_OF_DATE) {
    await metacache.updateCache(driver, await driver.latestSize());
  }

  // const pdf = driver.getPdf(37436, 517, 86);
}

main();
