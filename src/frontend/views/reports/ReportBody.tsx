import * as React from 'react';

import Report from '../../../common/Report';
import ReportMetadata from './ReportMetadata';
import ReportSection from './ReportSection';
import Sections from './Sections';
class ReportBody extends React.Component<Report> {
  public render() {
    return [
      <ReportMetadata key={'metadata'} {...this.props}/>,
      this.splitReport().map((data) => {
        const { name, summary, ...info } = data;
        return (
          <ReportSection
            key={name}
            summary={summary}
            title={name}
            data={info}
            responses={this.props.responses}
          />);
      }),
    ];
  }

  private splitReport() {
    const sections = [];
    // Parallel Data structure, this is a problem for the backend to solve.
    sections[0] = {
      name: Sections.CLASS,
      summary: this.props.courseSum,
      1: this.props[1],
      2: this.props[2],
      3: this.props[3],
      4: this.props[4],
      5: this.props[5],
      6: this.props[6],
      7: this.props[7],
      348: this.props[348],
      350: this.props[350],
      351: this.props[351],
      352: this.props[352],
      8: this.props[8],
    };

    sections[1] = {
      name: Sections.LEARNABILITY,
      summary: this.props.learningSum,
      10: this.props[10],
      11: this.props[11],
      12: this.props[12],
      13: this.props[13],
    };

    sections[2] = {
      name: Sections.INSTRUCTOR,
      summary: this.props.instructorSum,
      15: this.props[15],
      16: this.props[16],
      17: this.props[17],
      18: this.props[18],
      19: this.props[19],
      20: this.props[20],
      21: this.props[21],
      22: this.props[22],
      23: this.props[23],
      24: this.props[24],
      25: this.props[25],
      26: this.props[26],
      27: this.props[27],
    };

    sections[3] = {
      name: Sections.EFFECTIVENESS,
      summary: this.props.effectivenessSum,
      87: this.props[87],
    };

    return sections;
  }
}

export default ReportBody;
