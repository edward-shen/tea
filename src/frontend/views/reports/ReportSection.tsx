import * as React from 'react';
import { PDFSummary } from '../../../common/types/PDFTypes';
import {
  ClassQuestions,
  EffectivenessQuestions,
  InstructorQuestions,
  LearnabilityQuestions,
  WorkloadQuestion,
} from '../../../common/types/Questions';

interface ReportSectionProps {
  data: ClassQuestions | EffectivenessQuestions | InstructorQuestions |
    LearnabilityQuestions | WorkloadQuestion;
  summary: PDFSummary;
  title: string;
}

class ReportSection extends React.Component<ReportSectionProps> {
  public render() {
    return (
      <section id={this.props.title.toLowerCase().replace(' ', '-')}>
        {this.props.title}
      </section>
    );
  }
}

export default ReportSection;
