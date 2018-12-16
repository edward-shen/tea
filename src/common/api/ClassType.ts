import ProfessorPeekType from './ProfessorPeekType';
import ReportPeekType from './ReportPeekType';

interface ClassType {
  // To be initialize by mapping over report data
  subject: string;
  number: number;
  reports: ReportPeekType[];

  // To be initialized by mapping over
  professors: Array<{
    count: number;
  } & ProfessorPeekType>;
}

export default ClassType;
