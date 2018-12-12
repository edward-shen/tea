import * as React from 'react';
import Ratings, { Rating } from './Ratings';

// Shouldn't I make an interface for this in the scraper...?
interface ReportSummaryProps {
  subject: string;
  number: number;
  name: string;
  ratings: Rating[];
}

class ReportSummary extends React.Component<ReportSummaryProps> {
  public constructor(props) {
    super(props);
    this.state = { data: {} };
  }

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

export default ReportSummary;
