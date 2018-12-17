import * as React from 'react';
import { Bar } from 'react-chartjs-2';
// tslint:disable-next-line:import-name
import ReactTable from 'react-table';

import { Question } from '../../../common/types/ExcelTypes';
import { PDFQuestion } from '../../../common/types/PDFTypes';
import {
  ClassQuestions,
  EffectivenessQuestions,
  InstructorQuestions,
  LearnabilityQuestions,
  WorkloadQuestions,
} from '../../../common/types/Questions';
import { PRIMARY } from '../Colors';

class ReportSectionData extends React.Component<{ responses: number } & (ClassQuestions |
  EffectivenessQuestions | InstructorQuestions | LearnabilityQuestions | WorkloadQuestions)> {
  public render() {

    const { responses, ...questions } = this.props;
    return <ReactTable
      data={Object.values(questions).map((row: Question & PDFQuestion) => {
        const newRow = row as any;
        if (newRow.courseMean === 0) {
          newRow.courseMean = 'N/A';
          newRow.deptMean = null;
          newRow.univMean = null;
          newRow.stdDev = null;
        } else {
          newRow.courseMean = Number(row.courseMean).toFixed(1);
          newRow.deptMean = Number(row.deptMean).toFixed(1);
          newRow.univMean = Number(row.univMean).toFixed(1);
          newRow.stdDev = Number(row.stdDev).toFixed(2);
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
          Header: 'Course Mean',
          accessor: 'courseMean',
          maxWidth: 128,
          style: {
            'text-align': 'right',
          },
        },
        {
          Header: 'Dept. Mean',
          accessor: 'deptMean',
          maxWidth: 128,
          style: {
            'text-align': 'right',
          },
        },
        {
          Header: 'Univ. Mean',
          accessor: 'univMean',
          maxWidth: 128,
          style: {
            'text-align': 'right',
          },
        },
        {
          Header: 'Standard Deviation',
          accessor: 'stdDev',
          maxWidth: 196,
          style: {
            'text-align': 'right',
          },
        },
      ]}
      SubComponent={(row) => {
        const totalCount = row.original[1]
         + row.original[2]
         + row.original[3]
         + row.original[4]
         + row.original[5];

        if (totalCount) {
          return (
            <Bar
              options={{
                title: { display: true, text: 'Response breakdown', fontFamily: `'Montserrat'` },
                scales: {
                  yAxes: [{ ticks: { min: 0, stepSize: [1, 2, 5], suggestedMax: responses } }],
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

        return <em>Not applicable</em>;
      }}/>;
  }
}

export default ReportSectionData;
