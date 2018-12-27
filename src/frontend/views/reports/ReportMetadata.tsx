import * as React from 'react';
import { HorizontalBar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

import { BackgroundColors, ErrorColors } from '../Colors';
import Report from '../../../common/Report';

/**
 * Generates the metadata section of the reports, including the repsonse pie
 * chart and workload distribution chart.
 */
class ReportMetadata extends React.Component<Report> {
  public render() {
    const unanswered = this.props.enrollment - this.props.responses - this.props.declines;
    return (
      <section className='reportview-data'>
        <h2>Report Overview</h2>
        <table>
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
        </table>
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
                  ticks: { beginAtZero: true },
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
                {
                  backgroundColor: BackgroundColors.GREAT,
                  label: '1-4',
                  data: [this.props.questions.workload.hours[0]],
                },
                {
                  backgroundColor: BackgroundColors.GOOD,
                  label: '5-8',
                  data: [this.props.questions.workload.hours[1]],
                },
                {
                  backgroundColor: ErrorColors.INFO,
                  label: '9-12',
                  data: [this.props.questions.workload.hours[2]],
                },
                {
                  backgroundColor: BackgroundColors.BAD,
                  label: '13-16',
                  data: [this.props.questions.workload.hours[3]],
                },
                {
                  backgroundColor: BackgroundColors.TERRIBLE,
                  label: '17-20',
                  data: [this.props.questions.workload.hours[4]],
                },
              ],
            }}
          />
          <Pie
            data={{
              datasets: [{
                data: [this.props.responses, unanswered, this.props.declines],
                backgroundColor: [
                  BackgroundColors.GREAT,
                  ErrorColors.INFO,
                  BackgroundColors.TERRIBLE,
                ],
              }],
              labels: ['Responses', 'Abstains', 'Declines'],
            }}
            legend={{ position: 'bottom' }}
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
