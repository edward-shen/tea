import { readFileSync } from 'fs';
import { read, utils } from 'xlsx';

import { zip } from '../utils';

const questionColIDs = [
  'id', 'abbrev', 'question',
  '5', '4', '3', '2', '1', '-1',
  'mean', 'median', 'stdDev',
  'respCount', 'respRate',
];

const hoursColIDs = [
  'id', 'abbrev', 'question',
  '17-20', '13-16', '9-12', '5-8', '1-4',
  'respCount',
];

function parse(excelBuffer) {
  const lol = readFileSync('/home/edward/Downloads/xls.xls');
  const parsed = read(lol);
  const data = utils.sheet_to_json(parsed.Sheets[parsed.SheetNames[0]]);

  const questions = Object.values(data)
    .map((row) => Object.values(row))
    .filter((row) => typeof row[0] === 'number')
    .map((row) => {
      if (row.length === 14) {
        return zip(questionColIDs, row);
      } else {
        return zip(hoursColIDs, row);
      }
    });

  console.log();
}

export { parse };
