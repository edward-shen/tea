import Driver from '../Driver';
import { parseExcel } from '../parsers/excel';
import { parsePdf, PDFData } from '../parsers/pdf';
import ProgressBar from '../ProgressBar';
import CacheStatus from './CacheStatus';
import ClassCache from './ClassCache';
import MetaCache from './MetaCache';
import RequestPool from './RequestPool';

async function updateMetaCache() {
  if (await Driver.checkCache() === CacheStatus.OUT_OF_DATE) {
    await MetaCache.finishInit();

    /**
     * TODO: So this code is under the assumption that we will always add $rpp
     * amounts every time, and that the database is consistent to every $rpp
     * reports. This might not be the case, so we need to delete entries until
     * we hit a multiple of $rpp, and then start fetching from there.
     * There isn't really a clean way to do this otherwise because of the
     * limitations of the API.
     */

     // Might be better to work backwards.

    const start = await MetaCache.size();
    const toFetch: number = await Driver.latestSize() - start;
    const rpp = 100;
    const bar = new ProgressBar(Math.ceil(toFetch / rpp));

    bar.start();
    const pool = new RequestPool();

    // No need to ceil this
    for (let i = 1; i < toFetch / rpp; i++) {
      await pool.request();
      Driver.getMetaPage(i, rpp).then((res) => {
        MetaCache.addToCache(res.data);
        bar.increment();
        pool.return();
      });
    }

    await pool.barrier();
    bar.stop();
  }
}

async function updateClassCache() {
  const meta = await MetaCache.getReportData();
  const metaSize = await ClassCache.size();
  const pool = new RequestPool();

  const numClasses = await Driver.latestSize();
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

export { updateClassCache, updateMetaCache  };
