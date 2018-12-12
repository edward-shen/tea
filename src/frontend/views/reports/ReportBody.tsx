import * as React from 'react';

import Report from '../../../common/Report';
import ReportMetadata from './ReportMetadata';

interface ReportBodyProps {
  data: Report;
}

class ReportBody extends React.Component<ReportBodyProps> {
  public render() {
    return (
      <ReportMetadata
        responses={this.props.data.responses}
        declines={this.props.data.declines}
        enrollment={this.props.data.enrollment}
      />);
  }
}

export default ReportBody;
