import { readFileSync } from 'fs';
import * as pdf from 'pdf-parse';

import ids from './questionIDs';

interface Summary {
  mean: number;
  deptMean: number;
  univMean: number;
  median: number;
  deptMedian: number;
  univMedian: number;
  stdev: number;
}

interface QuestionMeta {
  courseMean: number;
  deptMean: number;
  univMean: number;
}

/**
 * Structures data from a PDF file. Returns an object containing a mapping from
 * a quesiton ID to the parsed variant. It also contains overall central
 * tendencies.
 *
 * In many ways, due to how we're scraping data from a pdf file, this is very
 * brittle. If NEU decides to change their questions, then this will likely
 * fail.
 *
 * @param pdfBuffer A binary pdf file.
 */
async function parse(pdfBuffer: Buffer) {
  const pdfData = (await pdf(pdfBuffer)).text;
  // The magic of regex <3
  const matched = pdfData.match(/(?<=%)[.\d]+/g);

  const summaryGenerator = [
    'courseSum',
    'learningSum',
    'instructorSum',
    'effectivenessSum',
  ][Symbol.iterator]();
  const questionGenerator = ids[Symbol.iterator]();

  const summaryKeys = ['mean', 'deptMean', 'univMean', 'median',
  'deptMedian', 'univMedian', 'stdev'];
  const questionKeys = ['courseMean', 'deptMean', 'univMean'];

  const ret = {};
  matched.map((str) => {
    const row = [];
    for (let i = 0; i < str.length; i += 3) {
      row.push(Number(str.slice(i, i + 3)));
    }
    if (row.length === 7) {
      ret[summaryGenerator.next().value] = handleRow(summaryKeys, row);
    } else {
      ret[questionGenerator.next().value] = handleRow(questionKeys, row);
    }
  });

  return ret;
}

function handleRow(keys: string[], row) {
  const ret = {};
  row.map((v, i) => ret[keys[i]] = v);
  return ret;
}

export {
  parse,
};
