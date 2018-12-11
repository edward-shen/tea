import * as React from 'react';

import './css/Card.scss';
import { Link } from 'react-router-dom';

interface CardData {
  header: string;
  subheader: string;
  instructor: string;
  term: string;
  classId: number;
  instructorId: number;
}

class Card extends React.Component<{data: CardData}, {}> {
  public render() {
    return (
      <Link className='card hover-shadow rounded' to={`/report/${this.props.data.classId}`}>
        <header>
          <h2>{this.props.data.header}</h2>
          <h3>{this.props.data.subheader}</h3>
        </header>
        <footer>
          <Link to={`/prof/${this.props.data.instructorId}`}>
            <em>{this.props.data.instructor}</em>
          </Link>
          <p>{this.props.data.term}</p>
        </footer>
      </Link>
    );
  }
}

export default Card;
export { CardData };
