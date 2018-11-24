import { read, utils } from 'xlsx';

import { zip } from '../utils';

interface Base {
  id: number;
  abbrev: string;
  question: string;
  respCount: number;
}

interface Question extends Base {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
  mean: number;
  median: number;
  stdDev: number;
  respRate: number;
}

interface TRACEQuestion extends Question {
  '-1': number;
}

interface HoursQuestion extends Base {
  '17-20': number;
  '13-16': number;
  '9-12': number;
  '5-8': number;
  '1-4': number;
}

const questionColIDs = [
  'id', 'abbrev', 'question',
  '5', '4', '3', '2', '1', '-1',
  'mean', 'median', 'stdDev',
  'respCount', 'respRate',
];

const teacherColIDs = [
  'id', 'abbrev', 'question',
  '5', '4', '3', '2', '1',
  'mean', 'median', 'stdDev',
  'respCount', 'respRate',
];

const hoursColIDs = [
  'id', 'abbrev', 'question',
  '17-20', '13-16', '9-12', '5-8', '1-4',
  'respCount',
];

function parseExcel(excelBuffer) {
  const parsed = read(excelBuffer);
  const data = utils.sheet_to_json(parsed.Sheets[parsed.SheetNames[0]]);
  const responseInclDeclines = Object.values(Object.values(data)[4])[1];
  const declines = Object.values(Object.values(data)[5])[1];

  const questions = Object.values(data)
    .map((row) => Object.values(row))
    .filter((row) => typeof row[0] === 'number')
    .map((row) => {
      if (row.length === 14) {
        return zip(questionColIDs, row);
      } else if (row.length === 13) {
        return zip(teacherColIDs, row);
      } else {
        return zip(hoursColIDs, row);
      }
    }) as Array<Question | TRACEQuestion | HoursQuestion>;

  return [questions, responseInclDeclines, declines];
}

export { parseExcel };
