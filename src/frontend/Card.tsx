import * as React from 'react';
import { Link } from 'react-router-dom';

import CardType from '../common/types/CardType';

import './css/Card.scss';

class Card extends React.Component<CardType> {
  public render() {
    return (
      <section className='card hover-shadow rounded'>
        <Link className='card-top' to={`/report/${this.props.bodyLink}`}>
          <header>
            <h2>{this.props.header}</h2>
            <h3>{this.props.subheader}</h3>
          </header>
        </Link>
        <footer>
          <Link to={this.props.leftTextLink}>
            <em>{this.props.leftText}</em>
          </Link>
          <Link to={`/prof/`}>
            <p>{this.props.rightText}</p>
          </Link>
        </footer>
      </section>
    );
  }
}

export default Card;
