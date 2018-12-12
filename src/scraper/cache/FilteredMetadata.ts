/**
 * A interface for metadata we actually want.
 */
interface FilteredMetadata {
  id: number;
  instructorId: number;
  termId: number;
  subject: string;
  number: number;
  termTitle: string;
  name: string;
  instructorFirstName: string;
  instructorLastName: string;
  termEndDate: number;
  enrollment: number;
  sourceId: number;
  type: string;
  level: any;
}

export default FilteredMetadata;
