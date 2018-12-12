import * as React from 'react';
import Report from '../../../common/Report';
import BaseProps from '../BaseProps';
import ReportSummary from './ReportSummary';

interface ReportViewState {
  data: Report;
}

class ReportView extends React.Component<BaseProps, ReportViewState> {
  public constructor(props) {
    super(props);
    this.state = { data: null };
  }

  public async componentDidMount() {
    this.setState({
      data: await (await fetch(`/api/report?id=${this.props.match.params.id}`)).json(),
    });
  }

  public render() {
    if (!this.state.data) {
      return null;
    }

    return (
      <main>
        <ReportSummary
          subject={this.state.data.subject}
          number={this.state.data.number}
          name={this.state.data.name}
          ratings={[
            {
              name: 'Class Rating',
              mean: this.state.data.courseSum.mean,
              deptMean: this.state.data.courseSum.deptMean,
            },
          ]}
        />
      </main>);
  }
}

export default ReportView;
