import * as pdf from 'pdf-parse';

import { PDFData } from '../../common/types/PDFTypes';
import { zip } from '../utils';
import questionIDs from './questionIDs';

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
    // It's possible for the PDF to be empty. If so, don't try to parse data.
    return null;
  }

  const summary = [
    'courseSum',
    'learningSum',
    'instructorSum',
    'effectivenessSum',
  ];

  const summaryIterator = summary[Symbol.iterator]();
  const questionIterator = questionIDs[Symbol.iterator]();

  // The keys to associate row values with.
  const summaryKeys = [
    'mean',
    'deptMean',
    'univMean',
    'median',
    'deptMedian',
    'univMedian',
    'stdev',
  ];
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

export { parsePdf };
