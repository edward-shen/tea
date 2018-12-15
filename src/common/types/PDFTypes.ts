/**
 * This class contains all type declarations for the PDF scraper. This file acts
 * as the API definitions between the PDF part of the scraper and dependents on
 * its data.
 *
 * When post-scraping processes are implemented, this definition should change,
 * and internal PDF types should be handled in the PDF parsing class.
 */

 /**
  * Central tendencies of the summaries scraped from the PDF. There should only
  * be four of these objects: a course sum, learning sum, instructor sum, and
  * effectiveness sum. All values are relative to the term, and are not all time
  * values.
  */
interface PDFSummary {
  mean: number;
  deptMean: number;
  univMean: number;
  median: number;
  deptMedian: number;
  univMedian: number;
  stdev: number;
}

/**
 * The central tendencies extracted from the PDF for a single question. All
 * values are relative to the term, and are not all time values.
 */
interface PDFQuestion {
  courseMean: number;
  deptMean: number;
  univMean: number;
}

/**
 * POD Object declaration for what the PDF scraper will return.
 */
interface PDFData {
  courseSum: PDFSummary;
  learningSum: PDFSummary;
  instructorSum: PDFSummary;
  effectivenessSum: PDFSummary;
  [key: number]: PDFQuestion;
}

export { PDFData, PDFQuestion, PDFSummary };
