import * as pdf from 'pdf-parse';

import { zip } from '../utils';
import questionIDs from './questionIDs';

interface PDFSummary {
  mean: number;
  deptMean: number;
  univMean: number;
  median: number;
  deptMedian: number;
  univMedian: number;
  stdev: number;
}

interface PDFQuestion {
  courseMean: number;
  deptMean: number;
  univMean: number;
}

interface PDFData {
  courseSum: PDFSummary;
  learningSum: PDFSummary;
  instructorSum: PDFSummary;
  effectivenessSum: PDFSummary;
  [key: number]: PDFQuestion;
}

/**
 * Structures data from a PDF file. Returns an object containing a mapping from
 * a question ID to the parsed variant. It also contains overall central
 * tendencies.
 *
 * In many ways, due to how we're scraping data from a pdf file, this is very
 * brittle. If NEU decides to change their questions, then this will likely
 * fail.
 *
 * @param pdfBuffer A pdf file, in binary.
 */
async function parsePdf(pdfBuffer): Promise<PDFData> {
  let parsed = { text: '' };
  try {
    parsed = await pdf(pdfBuffer);
  } catch (e) {
    console.error('Could not even load pdf!', e);
    return null;
  }
  const pdfData = parsed.text;
  const matched = pdfData.match(/(?<=%)[.\d]+/g); // The magic of regex <3

  if (!matched) {
    // PDF regex did not match anything, apparently this is common.
    console.warn('PDF did not match anything!');
    return null;
  }

  const summaryIterator = [
    'courseSum',
    'learningSum',
    'instructorSum',
    'effectivenessSum',
  ][Symbol.iterator]();

  const questionIterator = summaryIterator[Symbol.iterator]();

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

  return ret as PDFData;
}

export {
  PDFSummary,
  PDFQuestion,
  PDFData,
  parsePdf,
};
