/**
 * This class contains all type declarations for the Excel scraper. This file
 * acts as the API definitions between the Excel part of the scraper and
 * dependents on its data.
 *
 * When post-scraping processes are implemented, this definition should change,
 * and internal Excel types should be handled in the Excel parsing class.
 */

 /**
  * All questions scraped from the Excel spreadsheet will contain the following
  * fields.
  */
interface Base {
  id: number;
  abbrev: string;
  question: string;
  respCount: number;
}

/**
 * Declaration of fields for a TRACE question that does not have an NA Field.
 * Surprisingly, as of writing this, there exists only one question that is
 * applicable to this interface.
 */
interface Question extends Base {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
  mean: number;
  median: number;
  stdDev: number;
  respRate: number;
}

/**
 * A TRACE question with an "Not applicable" field. Most questions extracted
 * from the Excel sheet will contain this field.
 */
interface NAQuestion extends Question {
  '-1': number;
}

/**
 * Special interface for the "hours worked" question, as it's formatted as a
 * demographic question, rather than a standard question.
 */
interface HoursQuestion extends Base {
  '17-20': number;
  '13-16': number;
  '9-12': number;
  '5-8': number;
  '1-4': number;
}

export { Question, NAQuestion, HoursQuestion };
