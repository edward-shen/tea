import { ObjectID } from 'bson';
import MongoClient from '../common/MongoClient';
import Report from '../common/Report';
import Sections from '../frontend/views/reports/Sections';

const reportClient = new MongoClient('report');
const classClient = new MongoClient('class');
const profClient = new MongoClient('prof');

/**
 * The post processor will handle various post-processing tasks, to transform
 * data for serving use.
 */
class PostProcessor {
  public async process() {
    await this.generateClassCollection();
    await this.generateProfessorCollection();
    await this.linkClassToProfessor();
    reportClient.close();
    classClient.close();
    profClient.close();
  }

  /**
   * Generates the class collection by mapping over the report collection
   */
  private async generateClassCollection() {
    reportClient.collection.find().forEach((report: Report & {_id: ObjectID}) => {
      classClient.collection.find({
        subject: report.subject,
        number: report.number,
      }).upsert().update({
        subject: report.subject,
        number: report.number,
        $push: {
          reports: {
            _id: report._id,
            professor: `${report.instructorFirstName} ${report.instructorLastName}`,
            professorID: report.instructorId,
            term: report.termTitle,
            termID: report.termId,
            ratings: [
              [Sections.CLASS, report.questions.class.summary],
              [Sections.EFFECTIVENESS, report.questions.effectiveness.summary],
              [Sections.INSTRUCTOR, report.questions.instructor.summary],
              [Sections.LEARNABILITY, report.questions.learning.summary],
            ],
          },
        },
      });
    });
  }

  private async generateProfessorCollection() {
    //
  }

  private async linkClassToProfessor() {
    //
  }
}

export default new PostProcessor();
