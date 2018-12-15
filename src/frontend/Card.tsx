import * as React from 'react';
import { Link } from 'react-router-dom';

import CardType from '../common/types/CardType';

import './css/Card.scss';

class Card extends React.Component<CardType> {
  public render() {
    return (
      <section className='card hover-shadow rounded'>
        <Link className='card-top' to={`/report/${this.props.classId}`}>
          <header>
            <h2>{this.props.header}</h2>
            <h3>{this.props.subheader}</h3>
          </header>
        </Link>
        <footer>
          <Link to={`/prof/${this.props.instructorId}`}>
            <em>{this.props.instructor}</em>
          </Link>
          <p>{this.props.term}</p>
        </footer>
      </section>
    );
  }
}

export default Card;
