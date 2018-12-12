import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import Colors from '../Colors';

interface ReportMetadataProps {
  responses: number;
  declines: number;
  enrollment: number;
}

class ReportMetadata extends React.Component<ReportMetadataProps, {}> {
  public render() {
    const unanswered = this.props.enrollment - this.props.responses - this.props.declines;
    return <Pie data={{
      datasets: [{
        data: [this.props.responses, this.props.declines, unanswered],
        backgroundColor: [Colors.GREAT, Colors.TERRIBLE],
      }],
      labels: ['Responded', 'Declined', 'No Response'],
    }}/>;
  }
}

export default ReportMetadata;
