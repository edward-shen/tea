import CardType from '../common/types/CardType';

function toCard(data): CardType {
  return data.map((report) => {
    return {
      header: `${report.subject} ${report.number}`,
      subheader: report.name,
      instructor: report.instructorLastName,
      term: report.termTitle.slice(report.termTitle.indexOf(':') + 1),
      classId: report.id,
      instructorId: report.instructorId,
    };
  });
}

export default toCard;
