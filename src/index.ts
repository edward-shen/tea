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

  const numClasses = await driver.latestSize();
  if (await driver.checkCache() === CacheStatus.OUT_OF_DATE) {
    await metacache.updateCache(driver, numClasses);
  }

  const meta = await metacache.getReportData();
  const pool = new RequestPool();
  if (await ClassCache.size() === numClasses) {
    console.log('Class DB up to date!');
  } else {
    console.log('Class DB not up to date, updating!');
    const bar = new Bar({}, Presets.shades_classic);
    bar.start(Object.values(meta).length, 0);

    for (const data of Object.values(meta)) {
      // These must be blocking, and must be located here to avoid the race
      // condition where all iterations are waiting for a request to get pdf data.
      // In other words, this operation must be atomic.
      await pool.request();
      await pool.request();
      driver.getExcel(data.id, data.instructorId, data.termId).then((rawExcel) => {
        const [excel, responses, declines] = parseExcel(rawExcel);
        driver.getPdf(data.id, data.instructorId, data.termId).then(async (rawPdf) => {
          // Once both requests have been completed, return the request to the
          // pool as fast as possible
          pool.return();
          pool.return();
          let pdf = await parsePdf(rawPdf);
          if (!pdf) {
            console.log(`PDF Parsing failed for ${data.id}, ${data.instructorId}, ${data.termId}`);
            pdf = {} as PDFData;
          }

          for (const question of excel) {
            const id = question.id;
            delete question.id;
            pdf[id] = {
              ...pdf[question.id],
              ...question,
            };
          }

          const toAdd = {
            ...pdf,
            responses,
            declines,
          };

          ClassCache.put(data.id, toAdd);
        });
      });

      bar.increment(1);
    }

    await pool.barrier();

    bar.stop();
    console.log('Class Cache generated!');
  }
}

main();
