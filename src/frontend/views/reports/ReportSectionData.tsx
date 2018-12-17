import * as React from 'react';
import { Bar } from 'react-chartjs-2';
// tslint:disable-next-line:import-name
import ReactTable from 'react-table';

import { Question } from '../../../common/types/ExcelTypes';
import {
  ClassQuestions,
  EffectivenessQuestions,
  InstructorQuestions,
  LearnabilityQuestions,
  WorkloadQuestions,
} from '../../../common/types/Questions';
import { PRIMARY } from '../Colors';

class ReportSectionData extends React.Component<ClassQuestions |
  EffectivenessQuestions | InstructorQuestions | LearnabilityQuestions | WorkloadQuestions> {
  public render() {
    return <ReactTable
      data={Object.values(this.props).map((row: Question) => {
        const newRow = row as any;
        newRow.stdDev = Number(row.stdDev).toFixed(2);
        if (newRow.courseMean === 0) {
          newRow.courseMean = 'N/A';
          newRow.deptMean = null;
          newRow.univMean = null;
          newRow.stdDev = null;
        }

        return newRow;
      })}
      defaultSortMethod={(a, b) => {
        if (!Number(b) || Number(a) > Number(b)) {
          console.log(a, b);
          return 1;
        }
        if (!Number(a) || Number(a) < Number(b)) {
          console.log(a, b);
          return -1;
        }

        return 0;
      }}
      showPagination={false}
      minRows={0}
      columns={[
        {
          Header: 'Question',
          accessor: 'question',
          sortable: false,
        },
        {
          Header: 'Mean',
          accessor: 'courseMean',
        },
        {
          Header: 'Dept. Mean',
          accessor: 'deptMean',
        },
        {
          Header: 'Univ. Mean',
          accessor: 'univMean',
        },
        {
          Header: 'Standard Deviation',
          accessor: 'stdDev',
        },
      ]}
      SubComponent={(row) => {
        console.log(row);
        const maxValue = row.original[1]
          + row.original[2]
          + row.original[3]
          + row.original[4]
          + row.original[5];

        if (maxValue) {
          return (
            <Bar
              options={{
                title: { display: true, text: 'Response breakdown', fontFamily: `'Montserrat'` },
                scales: {
                  yAxes: [{ ticks: { min: 0, stepSize: 1, max: maxValue } }],
                },
              }}
              legend={{ display: false }}
              data={{
                labels: [1, 2, 3, 4, 5],
                datasets: [{
                  backgroundColor: PRIMARY,
                  data: [
                    row.original[1],
                    row.original[2],
                    row.original[3],
                    row.original[4],
                    row.original[5],
                  ],
                }],
              }}
            />
          );
        }
      }}/>;
  }
}

export default ReportSectionData;
