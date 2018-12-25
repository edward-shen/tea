import * as React from 'react';

import RatingBox from './RatingBox';
import ReportSectionData from './ReportSectionData';

interface ReportSectionProps {
  title: string;
  data: any;
  responses: number;
}

/**
 * A single section of the report, containing the title, ratings, and the
 * actual table of questions.
 */
class ReportSection extends React.Component<ReportSectionProps> {
  public render() {
    return (
      <section id={this.props.title.toLowerCase().replace(' ', '-')}>
        <h2>{this.props.title}</h2>
        <div className='ratings'>
          <RatingBox
            rating={this.props.data.summary.mean.toFixed(1)}
            subtext={
              `Median: ${this.props.data.summary.median} | ` +
              `σ: ${this.props.data.summary.stdev.toFixed(1)}`
            }
            desc='Section Mean'/>
          <RatingBox
            rating={this.props.data.summary.deptMean.toFixed(1)}
            subtext={`Median: ${this.props.data.summary.deptMedian}`}
            desc='Department Mean'/>
          <RatingBox
            rating={this.props.data.summary.univMean.toFixed(1)}
            subtext={`Median: ${this.props.data.summary.univMedian}`}
            desc='University Mean'/>
        </div>
        <ReportSectionData {...this.props.data} responses={this.props.responses} />
      </section>
    );
  }
}

export default ReportSection;
