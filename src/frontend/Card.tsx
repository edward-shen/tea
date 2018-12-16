import * as React from 'react';
import { Link } from 'react-router-dom';

import CardType from '../common/api/CardType';

import './css/Card.scss';

class Card extends React.Component<CardType> {
  public render() {
    let header = (
      <header>
        {this.props.header && <h2>{this.props.header}</h2>}
        {this.props.subheader && <h3>{this.props.subheader}</h3>}
      </header>);
    let left = <em>{this.props.leftText}</em>;
    let right = <p>{this.props.rightText}</p>;

    if (this.props.bodyLink) {
      header = (
        <Link className='card-top' to={this.props.bodyLink}>
          {header}
        </Link>);
    }

    if (this.props.leftTextLink) {
      left = <Link to={this.props.leftTextLink}>{left}</Link>;
    }

    if (this.props.rightTextLink) {
      right = <Link to={this.props.rightTextLink}>{right}</Link>;
    }

    return (
      <section className='card hover-shadow rounded'>
        {header}
        <footer>
          {this.props.leftText && left}
          {this.props.rightText && right}
        </footer>
      </section>
    );
  }
}

export default Card;
