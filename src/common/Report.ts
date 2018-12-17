import { PDFData } from '../common/types/PDFTypes';
import FilteredMetadata from '../scraper/cache/FilteredMetadata';
import {
  ClassQuestions,
  EffectivenessQuestions,
  InstructorQuestions,
  LearnabilityQuestions,
  WorkloadQuestions,
} from './types/Questions';

/**
 * Typing for a report object.
 */
interface Report extends FilteredMetadata {
  questions: {
    class: ClassQuestions,
    learning: LearnabilityQuestions,
    instructor: InstructorQuestions,
    effectiveness: EffectivenessQuestions,
    workload: WorkloadQuestions,
  };
}

export default Report;
