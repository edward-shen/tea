import { HoursQuestion, NAQuestion, Question } from './ExcelTypes';
import { PDFQuestion, PDFSummary } from './PDFTypes';

interface BaseQuestions {
  summary: PDFSummary;
}

interface SectionQuestions extends BaseQuestions {
  questions: Array<NAQuestion & PDFQuestion>;
}
interface EffectivenessQuestions extends BaseQuestions {
  questions: Array<Question & PDFQuestion>;
}

interface WorkloadQuestion {
  hours: HoursQuestion;
}

export {
  SectionQuestions,
  EffectivenessQuestions,
  WorkloadQuestion,
};
