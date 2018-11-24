import { Bar, Presets } from 'cli-progress';
import CacheStatus from './cache/CacheStatus';
import ClassCache from './cache/ClassCache';
import metacache from './cache/MetaCache';
import RequestPool from './cache/RequestPool';
import loadConfig from './Config';
import Driver from './Driver';
import { parseExcel } from './parsers/excel';
import { parsePdf, PDFData } from './parsers/pdf';

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
    // These must be blocking, and must be located here to avoid the race
    // condition where all iterations are waiting for a request to get pdf data.
    // In other words, this operation must be atomic.
    await pool.request();
    await pool.request();
    driver.getExcel(data.id, data.instructorId, data.termId).then((rawExcel) => {
      const excel = parseExcel(rawExcel);
      driver.getPdf(data.id, data.instructorId, data.termId).then(async (rawPdf) => {
        pool.return();
        pool.return();
        let pdf = await parsePdf(rawPdf);
        if (!pdf) {
          console.log(`PDF Parsing failed for ${data.id}, ${data.instructorId}, ${data.termId}`);
          pdf = {} as PDFData;
        }

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
      });
    });

    bar.increment(1);
  }

  await pool.barrier();
  bar.stop();
  console.log('class cache generated!');
}

main();
