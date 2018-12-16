import { ObjectID } from 'bson';
import Sections from '../../frontend/views/reports/Sections';

interface ReportPeekType {
  _id: ObjectID;
  professor: string;
  professorID: number;
  term: string;
  termID: number;
  ratings: Array<[Sections, number]>;
}

export default ReportPeekType;
