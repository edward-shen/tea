import { Bar, Presets } from 'cli-progress';
import CacheStatus from './cache/CacheStatus';
import ClassCache from './cache/ClassCache';
import metacache from './cache/MetaCache';
import RequestPool from './cache/RequestPool';
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

  const meta = await metacache.getReportData();
  const pool = new RequestPool();
  console.log('Generating class db');

  const bar = new Bar({}, Presets.shades_classic);
  bar.start(Object.values(meta).length, 0);

  for (const data of Object.values(meta)) {
    await pool.request();
    await pool.request();

    const excel = parseExcel(await driver.getExcel(data.id, data.instructorId, data.termId));
    const pdf = await parsePdf(await driver.getPdf(data.id, data.instructorId, data.termId));

    for (const question of excel) {
      pdf[question['id']] = {
        ...pdf[question['id']],
        ...question,
      };

      delete pdf[question['id']]['id'];
    }

    pdf['resps'] = excel['resps'];
    pdf['declines'] = excel['declines'];

    ClassCache.put(data.id, pdf);

    pool.return();
    pool.return();
    bar.increment(1);
  }

  await pool.barrier();
  bar.stop();
  console.log('class cache generated!');
}

main();
