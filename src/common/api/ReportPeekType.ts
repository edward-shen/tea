import { ObjectID } from 'bson';
import SectionNames from '../../frontend/views/reports/SectionNames';

interface ReportPeekType {
  _id: ObjectID;
  professor: string;
  professorID: number;
  term: string;
  termID: number;
  ratings: Array<[SectionNames, number]>;
}

export default ReportPeekType;
