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
  const matched = pdfData.match(/(?<=%)[.\d]+/g); // The magic of regex <3
  const summaryIterator = [
    'courseSum',
    'learningSum',
    'instructorSum',
    'effectivenessSum',
  ][Symbol.iterator]();
  const questionIterator = ids[Symbol.iterator]();

  // The keys to associate row values with.
  const summaryKeys = ['mean', 'deptMean', 'univMean', 'median',
  'deptMedian', 'univMedian', 'stdev'];
  const questionKeys = ['courseMean', 'deptMean', 'univMean'];

  const ret = {};
  matched.map((str) => {
    // Each data is in the form of (\d\.\d)*, which needs to be split up.
    const row = [];
    for (let i = 0; i < str.length; i += 3) {
      row.push(Number(str.slice(i, i + 3)));
    }

    // Handle each row based on their length.
    if (row.length === 7) {
      ret[summaryIterator.next().value] = zip(summaryKeys, row);
    } else {
      ret[questionIterator.next().value] = zip(questionKeys, row);
    }
  });

  return ret;
}

/**
 * Returns an object with key-value pairs. This will fill as many key-value
 * pairs as possible, and ignores extra values on each side.
 *
 * @param keys A list of keys
 * @param values A list of values.
 */
function zip(keys: string[], values) {
  const ret = {};
  values.map((v, i) => ret[keys[i]] = v);
  return ret;
}

export {
  parse,
};
