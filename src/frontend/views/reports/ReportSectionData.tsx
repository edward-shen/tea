import * as React from 'react';
// tslint:disable-next-line:import-name
import ReactTable from 'react-table';
import Report from '../../../common/Report';
import {
  ClassQuestions,
  EffectivenessQuestions,
  InstructorQuestions,
  LearnabilityQuestions,
  WorkloadQuestions,
} from '../../../common/types/Questions';

class ReportSectionData extends React.Component<ClassQuestions |
  EffectivenessQuestions | InstructorQuestions | LearnabilityQuestions | WorkloadQuestions> {
  public render() {
    return <ReactTable
      data={Object.values(this.props)}
      showPagination={false}
      defaultPageSize={Object.values(this.props).length}
      columns={[
        {
          Header: 'Question',
          accessor: 'question',
        },
        {
          Header: '1',
          accessor: '1',
        },
        {
          Header: '2',
          accessor: '2',
        },
        {
          Header: '3',
          accessor: '3',
        },
        {
          Header: '4',
          accessor: '4',
        },
        {
          Header: '5',
          accessor: '5',
        },
        {
          Header: 'N/A',
          accessor: '-1',
        },
        {
          Header: '1',
          accessor: '1',
        },
      ]}/>;
  }
}

export default ReportSectionData;
