import * as React from 'react';
import { NAQuestion, Question } from '../../../common/types/ExcelTypes';
import { PDFSummary } from '../../../common/types/PDFTypes';

interface ReportSectionProps {
  questions: Array<Question | NAQuestion>;
  summary: PDFSummary;
}

abstract class ReportSection extends React.Component<ReportSectionProps> {
  public constructor(props) {
    super(props);
  }
}

export default ReportSection;
