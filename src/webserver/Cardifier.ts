import CardType from '../common/api/CardType';
import Report from '../common/Report';

function toReportCard(data: Report[]): CardType[] {
  return data.map((report: Report): CardType => {
    return {
      header: `${report.subject} ${report.number}`,
      subheader: report.name,
      bodyLink: `/report/${report.id}/${report.instructorId}`,
      leftText: report.instructorLastName,
      leftTextLink: `/prof/${report.instructorId}`,
      rightText: report.termTitle.slice(report.termTitle.indexOf(':') + 1),
    };
  });
}

export { toReportCard };
