import CacheStatus from './cache/CacheStatus';
import metacache from './cache/MetaCache';
import loadConfig from './Config';
import Driver from './Driver';
import { parseExcel } from './parsers/excel';
import { parsePdf } from './parsers/pdf';

async function main() {
  const {username, password} = loadConfig();

  if (!username || !password) {
    process.exit(-1);
  }

  const driver = new Driver(username, password);
  await driver.auth();

  if (await driver.checkCache() === CacheStatus.OUT_OF_DATE) {
    await metacache.updateCache(driver, await driver.latestSize());
  }

  const excel = await driver.getExcel(37436, 517, 86);
  console.log(parseExcel(excel));

  const pdf = await driver.getPdf(37436, 517, 86);
  console.log(await parsePdf(pdf));
}

main();
