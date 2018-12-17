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
interface Report extends ClassQuestions, LearnabilityQuestions,
  InstructorQuestions, EffectivenessQuestions, WorkloadQuestions,
  FilteredMetadata, PDFData {
}

export default Report;
