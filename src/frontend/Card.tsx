import * as React from 'react';

import './css/Card.scss';

interface CardProps {
  header: string;
  subheader: string;
}

class Card extends React.Component<CardProps, {}> {
  public render() {
    return (
      <section className='card hover-shadow'>
        <header>
          <h2>{this.props.header}</h2>
          <h3>{this.props.subheader}</h3>
        </header>
        <footer>some footer data</footer>
      </section>
    );
  }
}

export default Card;
