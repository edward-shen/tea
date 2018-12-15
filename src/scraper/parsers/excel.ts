import { read, utils } from 'xlsx';

import { HoursQuestion, NAQuestion, Question } from '../../common/types/ExcelTypes';
import { zip } from '../utils';

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
    .map(row => Object.values(row))
    .filter(row => typeof row[0] === 'number')
    .map((row) => {
      if (row.length === 14) {
        return zip(questionColIDs, row);
      }

      if (row.length === 13) {
        return zip(teacherColIDs, row);
      }

      return zip(hoursColIDs, row);
    }) as Array<Question | NAQuestion | HoursQuestion>;

  return [questions, responseInclDeclines, declines];
}

export { parseExcel, NAQuestion };
