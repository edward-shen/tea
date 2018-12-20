import * as React from 'react';
import Ratings, { Rating } from './Ratings';

// Shouldn't I make an interface for this in the scraper...?
interface ReportHeaderProps {
  subject: string;
  number: number;
  name: string;
  ratings: Rating[];
}

/**
 * Contains logic for rendering the top row of the report, including the title
 * and overall summaries of the sections.
 */
class ReportHeader extends React.Component<ReportHeaderProps> {
  public render() {
    return (
      <header className='reportview-header'>
        <div className='reportview-title'>
          <h1>{this.props.subject} {this.props.number}: {this.props.name}</h1>
        </div>
        <aside className='ratings'>
          <Ratings ratings={this.props.ratings}/>
        </aside>
      </header>);
  }
}

export default ReportHeader;
