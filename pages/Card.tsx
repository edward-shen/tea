import * as React from 'react';
import Link from 'next/link';

import CardType from '../src/common/api/CardType';

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
        <Link href={this.props.bodyLink}>
          <a className='card-top'>{header}</a>
        </Link>);
    }

    if (this.props.leftTextLink) {
      left = <Link href={this.props.leftTextLink}><a>{left}</a></Link>;
    }

    if (this.props.rightTextLink) {
      right = <Link href={this.props.rightTextLink}><a>{right}</a></Link>;
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
