import { PDFData } from '../common/types/PDFTypes';
import FilteredMetadata from '../scraper/cache/FilteredMetadata';
import {
  SectionQuestions,
  EffectivenessQuestions,
  WorkloadQuestion,
} from './types/Questions';

/**
 * Typing for a report object.
 */
interface Report extends FilteredMetadata {
  questions: {
    class: SectionQuestions,
    learning: SectionQuestions,
    instructor: SectionQuestions,
    effectiveness: EffectivenessQuestions,
    workload: WorkloadQuestion,
  };
}

export default Report;
