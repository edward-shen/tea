import * as React from 'react';

import Report from '../../../common/Report';
import ReportMetadata from './ReportMetadata';
import ReportSection from './ReportSection';
import Sections from './Sections';
class ReportBody extends React.Component<Report> {
  public render() {
    return [
      <ReportMetadata key={'metadata'} {...this.props}/>,
      this.getSections().map((data) => {
        return (
          <ReportSection
            key={data.name}
            title={data.name}
            data={data.data}
            responses={this.props.responses}
          />);
      }),
    ];
  }

  private getSections() {
    return [
      {
        name: Sections.CLASS,
        data: this.props.questions.class,
      },
      {
        name: Sections.LEARNABILITY,
        data: this.props.questions.learning,
      },
      {
        name: Sections.INSTRUCTOR,
        data: this.props.questions.instructor,
      },
      {
        name: Sections.EFFECTIVENESS,
        data: this.props.questions.effectiveness,
      },
    ];
  }
}

export default ReportBody;
