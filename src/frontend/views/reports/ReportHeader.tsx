import * as React from 'react';
import Ratings, { Rating } from './Ratings';

// Shouldn't I make an interface for this in the scraper...?
interface ReportHeaderProps {
  subject: string;
  number: number;
  name: string;
  ratings: Rating[];
}

class ReportHeader extends React.Component<ReportHeaderProps> {
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

export default ReportHeader;
