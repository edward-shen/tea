import { ObjectID } from 'bson';
import SectionNames from '../../frontend/views/reports/SectionNames';

interface ProfessorPeekType {
  _id: ObjectID;
  name: string;
  count: number;
  id: number;
  ratings: Array<[SectionNames, number]>;
}

export default ProfessorPeekType;
