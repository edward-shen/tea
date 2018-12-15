import { NAQuestion } from '../common/types/ExcelTypes';
import { PDFData, PDFQuestion } from '../common/types/PDFTypes';
import FilteredMetadata from '../scraper/cache/FilteredMetadata';

/**
 * Typing for a report object.
 * Unforunately, it does not support exclusion, and we will need to manually
 * cast the following questions as follows:
 *
 * 9: PDFQuestion & HoursQuestion;
 * 87: PDFQuestion & Question;
 */
interface Report extends PDFData, FilteredMetadata {
  [key: number]: PDFQuestion & NAQuestion;
}

export default Report;
