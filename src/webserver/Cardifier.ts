import Report from '../common/Report';
import CardType from '../common/types/CardType';

function toReportCard(data: Report[]): CardType[] {
  return data.map((report: Report): CardType => {
    return {
      header: `${report.subject} ${report.number}`,
      subheader: report.name,
      bodyLink: `/report/${report.id}`,
      leftText: report.instructorLastName,
      leftTextLink: `/prof/${report.instructorId}`,
      rightText: report.termTitle.slice(report.termTitle.indexOf(':') + 1),
    };
  });
}

export { toReportCard };
