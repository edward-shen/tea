import FilteredMetadata from '../scraper/cache/FilteredMetadata';
import { TRACEQuestion } from '../scraper/parsers/excel';
import { PDFData, PDFQuestion } from '../scraper/parsers/pdf';

/**
 * Typing for a report object.
 * Unforunately, it does not support exclusion, and we will need to manually
 * cast the following questions as follows:
 *
 * 9: PDFQuestion & HoursQuestion;
 * 87: PDFQuestion & Question;
 */
interface Report extends PDFData, FilteredMetadata {
  [key: number]: PDFQuestion & TRACEQuestion;
}

export default Report;
