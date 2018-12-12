import * as React from 'react';
import Report from '../../../common/Report';
import BaseProps from '../BaseProps';
import ReportSummary from './ReportSummary';

import '../../css/reports/ReportView.scss';
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

    const ratingsToShow = [
      { name: 'Class Rating', ...this.state.data.courseSum },
      { name: 'Learnability', ...this.state.data.learningSum },
      { name: 'Instructor Performance', ...this.state.data.instructorSum },
      { name: 'Effectiveness', ...this.state.data.effectivenessSum },
    ];

    return (
      <main>
        <ReportSummary
          subject={this.state.data.subject}
          number={this.state.data.number}
          name={this.state.data.name}
          ratings={ratingsToShow}
        />
      </main>);
  }
}

export default ReportView;
