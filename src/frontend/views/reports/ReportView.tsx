import * as React from 'react';
import Report from '../../../common/Report';
import BaseProps from '../BaseProps';
import ReportHeader from './ReportHeader';

import ReportBody from './ReportBody';
import Sections from './Sections';
interface ReportViewState {
  data: Report;
}

class ReportView extends React.Component<BaseProps, ReportViewState> {
  public constructor(props) {
    super(props);
    this.state = { data: null };
  }

  public async componentDidMount() {
    const info = await (
      await fetch(
        `/api/report?id=${this.props.match.params.id}&prof=${this.props.match.params.prof}`))
        .json();
    this.setState({
      data: info,
    });
  }

  public render() {
    if (!this.state.data) {
      return null;
    }

    const ratingsToShow = [
      { name: Sections.CLASS, ...this.state.data.questions.learning.summary },
      { name: Sections.LEARNABILITY, ...this.state.data.questions.learning.summary },
      { name: Sections.INSTRUCTOR, ...this.state.data.questions.instructor.summary },
      { name: Sections.EFFECTIVENESS, ...this.state.data.questions.effectiveness.summary },
    ];

    return (
      <main className='reportview'>
        <ReportHeader
          subject={this.state.data.subject}
          number={this.state.data.number}
          name={this.state.data.name}
          ratings={ratingsToShow}
        />
        <ReportBody {...this.state.data} />
      </main>);
  }
}

export default ReportView;
