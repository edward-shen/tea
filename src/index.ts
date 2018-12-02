import CacheStatus from './cache/CacheStatus';
import ClassCache from './cache/ClassCache';
import metacache from './cache/MetaCache';
import RequestPool from './cache/RequestPool';
import loadConfig from './Config';
import Driver from './Driver';
import { parseExcel } from './parsers/excel';
import { parsePdf, PDFData } from './parsers/pdf';
import ProgressBar from './ProgressBar';

async function main() {
  const {username, password} = loadConfig();

  if (!username || !password) {
    process.exit(-1);
  }

  await Driver.auth();
  console.log('Driver has been authenticated!');

  const numClasses = await Driver.latestSize();
  if (await Driver.checkCache() === CacheStatus.OUT_OF_DATE) {
    await metacache.updateCache(numClasses);
  }

  const meta = await metacache.getReportData();
  const metaSize = await ClassCache.size();
  const pool = new RequestPool();
  if (metaSize === numClasses) {
    console.log('Class DB up to date!');
  } else {
    console.log('Class DB not up to date, updating!');
    const bar = new ProgressBar(Object.values(meta).length);
    bar.start();

    for (const data of Object.values(meta)) {
      // These must be blocking, and must be located here to avoid the race
      // condition where all iterations are waiting for a request to get pdf data.
      // In other words, this operation must be atomic.
      await pool.request();
      await pool.request();
      Driver.getExcel(data.id, data.instructorId, data.termId).then((rawExcel) => {
        const [excel, responses, declines] = parseExcel(rawExcel);
        Driver.getPdf(data.id, data.instructorId, data.termId).then(async (rawPdf) => {
          // Once both requests have been completed, return the request to the
          // pool as fast as possible
          pool.return();
          pool.return();

          // PDF parsing is very flaky.
          let pdf = await parsePdf(rawPdf);
          if (!pdf) {
            console.log(`PDF Parsing failed for ${data.id}, ${data.instructorId}, ${data.termId}`);
            // Continue. We'll lose central tendencies but they're not critical.
            pdf = {} as PDFData;
          }

          // Merge the excel data into the pdf data
          for (const question of excel) {
            const id = question.id;
            delete question.id;
            pdf[id] = {
              ...pdf[id],
              ...question,
            };
          }

          // Merge the remaining meta data into the final data.
          const toAdd = {
            ...pdf,
            responses,
            declines,
          };

          ClassCache.put(data.id, toAdd);
        });
      });

      bar.increment();
    }

    await pool.barrier();

    bar.stop();
    console.log('Class Cache generated!');
  }
}

main();
