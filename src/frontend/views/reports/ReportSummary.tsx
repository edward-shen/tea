import * as React from 'react';

// Shouldn't I make an interface for this in the scraper...?
interface ReportSummaryProps {
  subject: string;
  number: number;
  name: string;
  ratings: [{
    name: string;
    mean: number;
    deptMean: number;
  }];
}

class ReportSummary extends React.Component<ReportSummaryProps, {}> {
  public constructor(props) {
    super(props);
    this.state = { data: {} };
  }

  public render() {
    return (
      <header>
        <h1>{this.props.subject} {this.props.number}: {this.props.name}</h1>
      </header>);
  }
}

export default ReportSummary;
