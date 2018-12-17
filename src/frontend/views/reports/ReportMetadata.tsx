import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

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
        </table>
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
            fontFamily: `'Montserrat'`,
          }}
          options={{
            title: {
              display: true,
              text: 'Response distribution',
              fontFamily: `'Montserrat'`,
            },
          }}/>
    </section>);
  }
}

export default ReportMetadata;
