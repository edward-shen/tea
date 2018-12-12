import * as React from 'react';
import Report from '../../../common/Report';
import BaseProps from '../BaseProps';
import ReportHeader from './ReportHeader';

import '../../css/reports/ReportView.scss';
import ReportBody from './ReportBody';
interface ReportViewState {
  data: Report;
}

class ReportView extends React.Component<BaseProps, ReportViewState> {
  public constructor(props) {
    super(props);
    this.state = { data: null };
  }

  public async componentDidMount() {
    const info = await (await fetch(`/api/report?id=${this.props.match.params.id}`)).json();
    console.log(info);
    this.setState({
      data: info,
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
      <main className='reportview'>
        <ReportHeader
          subject={this.state.data.subject}
          number={this.state.data.number}
          name={this.state.data.name}
          ratings={ratingsToShow}
        />
        <ReportBody data={this.state.data} />
      </main>);
  }
}

export default ReportView;
