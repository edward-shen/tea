import { HoursQuestion, NAQuestion, Question } from './ExcelTypes';
import { PDFQuestion } from './PDFTypes';

interface ClassQuestions {
  1: NAQuestion & PDFQuestion;
  2: NAQuestion & PDFQuestion;
  3: NAQuestion & PDFQuestion;
  4: NAQuestion & PDFQuestion;
  5: NAQuestion & PDFQuestion;
  6: NAQuestion & PDFQuestion;
  7: NAQuestion & PDFQuestion;
  348: NAQuestion & PDFQuestion;
  350: NAQuestion & PDFQuestion;
  351: NAQuestion & PDFQuestion;
  352: NAQuestion & PDFQuestion;
  8: NAQuestion & PDFQuestion;
}

interface LearnabilityQuestions {
  10: NAQuestion & PDFQuestion;
  11: NAQuestion & PDFQuestion;
  12: NAQuestion & PDFQuestion;
  13: NAQuestion & PDFQuestion;
}

interface InstructorQuestions {
  15: NAQuestion & PDFQuestion;
  16: NAQuestion & PDFQuestion;
  17: NAQuestion & PDFQuestion;
  18: NAQuestion & PDFQuestion;
  19: NAQuestion & PDFQuestion;
  20: NAQuestion & PDFQuestion;
  21: NAQuestion & PDFQuestion;
  22: NAQuestion & PDFQuestion;
  23: NAQuestion & PDFQuestion;
  24: NAQuestion & PDFQuestion;
  25: NAQuestion & PDFQuestion;
  26: NAQuestion & PDFQuestion;
  27: NAQuestion & PDFQuestion;
}

interface EffectivenessQuestions {
  87: Question & PDFQuestion;
}

interface WorkloadQuestions {
  9: HoursQuestion;
}

export {
  ClassQuestions,
  LearnabilityQuestions,
  InstructorQuestions,
  EffectivenessQuestions,
  WorkloadQuestions,
};
