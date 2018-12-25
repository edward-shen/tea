import MongoClient from '../../common/MongoClient';
import Report from '../../common/Report';
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
    const rpp = 10; // 10 is more responsive than 100, but slower.
    const bar = new ProgressBar(remoteSize);

    bar.start(start);
    const pool = new RequestPool();
    const loopStart = start === 0 ? 0 : start / rpp + 1;

    for (let page = loopStart; page <= Math.ceil(remoteSize / rpp); page += 1) {
      const threadId = await pool.request();
      Driver.getMetaPage(page, rpp).then((res) => {
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
          } as Report);
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

function restructureQuestionData(questions: PDFData) {
  return {
    class: {
      summary: questions.courseSum,
      questions: [
        questions[1],
        questions[2],
        questions[3],
        questions[4],
        questions[5],
        questions[6],
        questions[7],
        questions[348],
        questions[350],
        questions[351],
        questions[352],
        questions[8],
      ],
    },
    learning: {
      summary: questions.learningSum,
      questions: [
        questions[10],
        questions[11],
        questions[12],
        questions[13],
      ],
    },
    instructor: {
      summary: questions.instructorSum,
      questions: [
        questions[15],
        questions[16],
        questions[17],
        questions[18],
        questions[19],
        questions[20],
        questions[21],
        questions[22],
        questions[23],
        questions[24],
        questions[25],
        questions[26],
        questions[27],
      ],
    },
    effectiveness: {
      summary: questions.effectivenessSum,
      questions: [questions[87]],
    },
    workload: {
      ...questions[9],
    },
  };
}

function cleanupDB() {
  mongoClient.close();
}

export { updateClassCache, updateMetaCache, cleanupDB };
