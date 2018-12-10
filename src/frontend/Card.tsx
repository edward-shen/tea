import * as React from 'react';

import './css/Card.scss';

interface CardProps {
  header: string;
  subheader: string;
}

class Card extends React.Component<CardProps, {}> {
  public render() {
    return (
      <section className='card'>
        <header>{this.props.header}</header>
        <main>{this.props.subheader}</main>
        <footer>some footer data</footer>
      </section>
    );
  }
}

export default Card;
