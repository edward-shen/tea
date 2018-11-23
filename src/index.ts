import CacheStatus from './cache/CacheStatus';
import metacache from './cache/metacache';
import loadConfig from './config';
import Driver from './driver';
import { parse } from './parsers/pdf';

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

  const http = await driver.getPdf(37436, 517, 86);

  console.log(await parse(http));
}

main();
