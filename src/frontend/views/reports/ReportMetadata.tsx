import * as React from 'react';
import { HorizontalBar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

import { HoursQuestion } from '../../../common/types/ExcelTypes';
import Colors from '../Colors';

interface ReportMetadataProps {
  responses: number;
  declines: number;
  enrollment: number;
  instructorFirstName: string;
  instructorLastName: string;
  instructorId: number;
  type: string;
  level: string;
  termTitle: string;
  9: HoursQuestion;
}

class ReportMetadata extends React.Component<ReportMetadataProps, {}> {
  public render() {
    const unanswered = this.props.enrollment - this.props.responses - this.props.declines;
    return (
      <section className='reportview-data'>
        <h2>Report Overview</h2>
        <table className='reportview-data-table'>
          <tbody>
            <tr>
              <td>Professor</td>
              <td>
                <Link to={`/prof/${this.props.instructorId}`}>
                  {this.props.instructorFirstName} {this.props.instructorLastName}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Term</td>
              <td>{this.props.termTitle}</td>
            </tr>
            <tr>
              <td>Enrollment</td>
              <td>{this.props.enrollment}</td>
            </tr>
            <tr>
              <td>Responses</td>
              <td>{this.props.responses}</td>
            </tr>
            <tr>
              <td>Declines</td>
              <td>{this.props.declines}</td>
            </tr>
            <tr>
              <td>Abstains</td>
              <td>{unanswered}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{this.props.type}</td>
            </tr>
            <tr>
              <td>Graduate Course</td>
              <td>{this.props.enrollment && 'No'}</td>
            </tr>
          </tbody>
        </table>,
        <div className='reportview-data-graphs'>
          <HorizontalBar
            key='hours'
            options={{
              title: {
                display: true,
                text: 'Workload Distribution',
                fontFamily: `'Montserrat'`,
                fontSize: 24,
                fontColor: '#000',
              },
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    suggestedMax: this.props.responses,
                  },
                  display: false,
                  stacked: true,
                }],
                yAxes: [{
                  ticks: { beginAtZero: true },
                  stacked: true,
                  display: false,
                }],
              },
            }}
            legend={{ position: 'bottom' }}
            data={{
              datasets: [
                { backgroundColor: Colors.GREAT, label: '1-4', data: [this.props[9]['1-4']] },
                { backgroundColor: Colors.GOOD, label: '5-8', data: [this.props[9]['5-8']] },
                { backgroundColor: '#dedede', label: '9-12', data: [this.props[9]['9-12']] },
                { backgroundColor: Colors.BAD, label: '13-16', data: [this.props[9]['13-16']] },
                { backgroundColor: Colors.TERRIBLE, label: '17-20', data: [this.props[9]['17-20']] },
              ],
            }}
          />
          <Pie
            data={{
              datasets: [{
                data: [this.props.responses, unanswered, this.props.declines],
                backgroundColor: [Colors.GREAT, '#ccc', Colors.TERRIBLE],
              }],
              labels: ['Responses', 'Abstains', 'Declines'],
            }}
            legend={{
              position: 'bottom',
            }}
            options={{
              title: {
                display: true,
                text: 'Response Distribution',
                fontFamily: `'Montserrat'`,
                fontSize: 24,
                fontColor: '#000',
              },
            }}
          />
        </div>
    </section>);
  }
}

export default ReportMetadata;
