import * as React from 'react';
import Ratings, { Rating } from './Ratings';
import Warning from '../../Warning';

// Shouldn't I make an interface for this in the scraper...?
interface ReportHeaderProps {
  subject: string;
  number: number;
  name: string;
  ratings: Rating[];
  responses: number;
  enrollment: number;
}

/**
 * Contains logic for rendering the top row of the report, including the title
 * and overall summaries of the sections.
 */
class ReportHeader extends React.Component<ReportHeaderProps> {
  public render() {
    console.log(this.props.enrollment, this.props.responses);
    return (
      <header className='reportview-header'>
        <div className='reportview-title'>
          <h1>{this.props.subject} {this.props.number}: {this.props.name}</h1>
          { this.props.responses / this.props.enrollment < 0.5 &&
            <Warning
              button
              level='warn'
              text='This report has a low response rate. Take values with caution.'
              />}
        </div>
        <aside className='ratings'>
          <Ratings ratings={this.props.ratings}/>
        </aside>
      </header>);
  }
}

export default ReportHeader;
