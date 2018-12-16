import { ObjectID } from 'bson';
import Sections from '../../frontend/views/reports/Sections';

interface ProfessorPeekType {
  _id: ObjectID;
  name: string;
  count: number;
  id: number;
  ratings: Array<[Sections, number]>;
}

export default ProfessorPeekType;
