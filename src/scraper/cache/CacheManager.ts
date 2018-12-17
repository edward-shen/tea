import MongoClient from '../../common/MongoClient';
import { PDFData } from '../../common/types/PDFTypes';
import Driver from '../Driver';
import { parseExcel } from '../parsers/excel';
import { parsePdf } from '../parsers/pdf';
import ProgressBar from '../ProgressBar';
import CacheStatus from './CacheStatus';
import MetaCache from './MetaCache';
import RequestPool from './RequestPool';

const mongoClient = new MongoClient('report');

/**
 * Asynchronously update the metacache, if it's not up to date.
 */
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
    const remoteSize = await Driver.latestSize();
    const toFetch: number = remoteSize - start;
    const rpp = 10; // 10 is more responsive than 100, but slower.
    const bar = new ProgressBar(remoteSize);

    bar.start(start);
    const pool = new RequestPool();

    // No need to ceil this
    for (let i = 1; i <= toFetch / rpp; i += 1) {
      const threadId = await pool.request();
      Driver.getMetaPage(i, rpp).then((res) => {
        MetaCache.addToCache(res.data);
        bar.increment(res.data.length);
        pool.return(threadId);
      });
    }

    await pool.barrier();
    bar.stop();
  }
}

/**
 * Asynchronously updates the class cache, if it's not up to date.
 */
async function updateClassCache() {
  const meta = await MetaCache.getReportData();
  const classSize = await mongoClient.size();
  const pool = new RequestPool();

  const numClasses = await Driver.latestSize();
  if (classSize === numClasses) {
    console.log('Class DB up to date!');
  } else {
    console.log('Class DB not up to date. Updating. This process takes around 45 minutes.');
    const bar = new ProgressBar(Object.values(meta).length);
    bar.start(classSize);

    const bad = [];
    const metaDatas = Object.values(meta).slice(classSize);
    for (const metaData of metaDatas) {
      // These must be blocking, and must be located here to avoid the race
      // condition where all iterations are waiting for a request to get pdf data.
      // In other words, this operation must be atomic as possible.
      const threadId1 = await pool.request();
      const threadId2 = await pool.request();
      Driver.getExcel(metaData.id, metaData.instructorId, metaData.termId).then((rawExcel) => {
        const [excel, responses, declines] = parseExcel(rawExcel);
        Driver.getPdf(metaData.id, metaData.instructorId, metaData.termId).then(async (rawPdf) => {
          // Once both requests have been completed, return the request to the
          // pool as fast as possible
          pool.return(threadId1);
          pool.return(threadId2);

          // PDF parsing is very flaky.
          let pdf = await parsePdf(rawPdf);
          if (!pdf) {
            bad.push({
              id: metaData.id,
              instructorId: metaData.instructorId,
              termId: metaData.termId,
            });
            // Continue. We'll lose central tendencies but they're not critical.
            pdf = {} as PDFData;
          }

          // Merge the excel data into the pdf data
          for (const question of excel) {
            const { id, ...excelData } = question;
            pdf[id] = {
              ...pdf[id],
              ...excelData,
            };
          }

          // Merge the remaining meta data into the final data.
          mongoClient.put({
            responses,
            declines,
            questions: restructureQuestionData(pdf),
            ...metaData,
          });
        });
      });

      bar.increment();
    }

    await pool.barrier();

    bar.stop();
    console.log('Class Cache generated!');

    if (bad.length !== 0) {
      console.warn(`Could not parse info for ${bad.length} entries:`);
      console.warn(JSON.stringify(bad));
    }
  }
}

function restructureQuestionData(questions) {
  return {
    class: {
      summary: questions.courseSum,
      1: questions[1],
      2: questions[2],
      3: questions[3],
      4: questions[4],
      5: questions[5],
      6: questions[6],
      7: questions[7],
      348: questions[348],
      350: questions[350],
      351: questions[351],
      352: questions[352],
      8: questions[8],
    },
    learning: {
      summary: questions.learningSum,
      10: questions[10],
      11: questions[11],
      12: questions[12],
      13: questions[13],
    },
    instructor: {
      summary: questions.instructorSum,
      15: questions[15],
      16: questions[16],
      17: questions[17],
      18: questions[18],
      19: questions[19],
      20: questions[20],
      21: questions[21],
      22: questions[22],
      23: questions[23],
      24: questions[24],
      25: questions[25],
      26: questions[26],
      27: questions[27],
    },
    effectiveness: {
      summary: questions.effectivenessSum,
      87: questions[87],
    },
  };
}

function cleanupDB() {
  mongoClient.close();
}

export { updateClassCache, updateMetaCache, cleanupDB };
