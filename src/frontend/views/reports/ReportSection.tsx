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
import ReportSectionData from './ReportSectionData';

interface ReportSectionProps {
  data: ClassQuestions | EffectivenessQuestions | InstructorQuestions |
    LearnabilityQuestions | WorkloadQuestions;
  summary: PDFSummary;
  title: string;
}

class ReportSection extends React.Component<ReportSectionProps> {
  public render() {
    return (
      <section id={this.props.title.toLowerCase().replace(' ', '-')}>
        <h2>{this.props.title}</h2>
        <ReportSectionData {...this.props.data} />
      </section>
    );
  }
}

export default ReportSection;
