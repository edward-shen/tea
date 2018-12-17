import * as React from 'react';
import { PDFSummary } from '../../../common/types/PDFTypes';
import {
  ClassQuestions,
  EffectivenessQuestions,
  InstructorQuestions,
  LearnabilityQuestions,
  WorkloadQuestions,
} from '../../../common/types/Questions';

import 'react-table/react-table.css';
import RatingBox from './RatingBox';
import ReportSectionData from './ReportSectionData';

interface ReportSectionProps {
  data: ClassQuestions | EffectivenessQuestions | InstructorQuestions |
    LearnabilityQuestions | WorkloadQuestions;
  summary: PDFSummary;
  title: string;
  responses: number;
}

class ReportSection extends React.Component<ReportSectionProps> {
  public render() {
    return (
      <section id={this.props.title.toLowerCase().replace(' ', '-')}>
        <h2>{this.props.title}</h2>
        <div className='ratings'>
          <RatingBox
            rating={this.props.summary.mean.toFixed(1)}
            subtext={
              `Median: ${this.props.summary.median} | σ: ${this.props.summary.stdev.toFixed(1)}`
            }
            desc='Section Mean'/>
          <RatingBox
            rating={this.props.summary.deptMean.toFixed(1)}
            subtext={`Median: ${this.props.summary.deptMedian}`}
            desc='Department Mean'/>
          <RatingBox
            rating={this.props.summary.univMean.toFixed(1)}
            subtext={`Median: ${this.props.summary.univMedian}`}
            desc='University Mean'/>
        </div>
        <ReportSectionData {...this.props.data} responses={this.props.responses} />
      </section>
    );
  }
}

export default ReportSection;
