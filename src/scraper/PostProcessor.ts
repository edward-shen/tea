import MongoClient from '../common/MongoClient';
import Report from '../common/Report';
import Sections from '../frontend/views/reports/Sections';
import ProgressBar from './ProgressBar';

const reportClient = new MongoClient('report');
const classClient = new MongoClient('class');
const profClient = new MongoClient('prof');

/**
 * The post processor will handle various post-processing tasks, to transform
 * data for serving use.
 */
class PostProcessor {
  private size: number;

  public async process() {
    this.size = await reportClient.size();
    const shouldUpdateClasses = await classClient.size() < this.size;
    const shouldUpdateProfs = await profClient.size() < this.size;

    if (shouldUpdateClasses) {
      console.log(`Generating Class Collections... This shouldn't take long.`);
      await this.generateClassCollection();
    }

    if (shouldUpdateProfs) {
      console.log(`Generating Professor Collections... This shouldn't take long.`);
      await this.generateProfessorCollection();
    }

    if (shouldUpdateClasses && shouldUpdateProfs) {
      console.log(`Linking professor collection to class collections...`);
      await this.linkClassToProfessor();
    }

    reportClient.close();
    classClient.close();
    profClient.close();
  }

  /**
   * Generates the class collection by mapping over the report collection
   */
  private async generateClassCollection() {
    const bar = new ProgressBar(this.size);
    bar.start();
    await reportClient.collection.find().forEach((report: Report) => {
      classClient.collection.updateOne(
        {
          subject: report.subject,
          number: report.number,
        },
        {
          $set: {
            subject: report.subject,
            number: report.number,
          },
          $push: {
            reports: {
              id: report.id,
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
        },
        { upsert: true });
      bar.increment();
    });
    bar.stop();
  }

  private async generateProfessorCollection() {
    console.log('NOOP');
    return;
  }

  private async linkClassToProfessor() {
    const bar = new ProgressBar(this.size);

    bar.start();
    await classClient.collection.find().forEach((classData) => {
      const name = `class.${classData.subject}${classData.number}`;
      classData.reports.forEach((report) => {
        const dataToSet = {};
        dataToSet[name] = 1;
        profClient.collection.updateOne(
          {
            id: report.professorID,
          },
          {
            $inc: {
              ...dataToSet,
            },
          },
          { upsert: true });
      });
      bar.increment();
    });

    bar.stop();
  }
}

export default new PostProcessor();
