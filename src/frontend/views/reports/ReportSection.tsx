import * as React from 'react';
import { NAQuestion, Question } from '../../../common/types/ExcelTypes';
import { PDFSummary } from '../../../common/types/PDFTypes';

interface ReportSectionProps {
  questions: Array<Question | NAQuestion>;
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
