import * as React from 'react';
import { Link } from 'react-router-dom';

import './css/Card.scss';

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
      <section className='card hover-shadow rounded'>
        <Link className='card-top' to={`/report/${this.props.data.classId}`}>
          <header>
            <h2>{this.props.data.header}</h2>
            <h3>{this.props.data.subheader}</h3>
          </header>
        </Link>
        <footer>
          <Link to={`/prof/${this.props.data.instructorId}`}>
            <em>{this.props.data.instructor}</em>
          </Link>
          <p>{this.props.data.term}</p>
        </footer>
      </section>
    );
  }
}

export default Card;
export { CardData };
