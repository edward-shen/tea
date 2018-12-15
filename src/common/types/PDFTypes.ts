
interface PDFSummary {
  mean: number;
  deptMean: number;
  univMean: number;
  median: number;
  deptMedian: number;
  univMedian: number;
  stdev: number;
}

interface PDFQuestion {
  courseMean: number;
  deptMean: number;
  univMean: number;
}

interface PDFData {
  courseSum: PDFSummary;
  learningSum: PDFSummary;
  instructorSum: PDFSummary;
  effectivenessSum: PDFSummary;
  [key: number]: PDFQuestion;
}

export { PDFData, PDFQuestion, PDFSummary };
