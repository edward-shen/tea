
import * as React from 'react';
import Card from './Card';

import './css/CardView.scss';

class CardView extends React.Component<{}, {}> {
  public render() {
    const data = [{header: "CS 2500", subheader:"Fundamentals of Computer Science I"}, {header: "CS 2510", subheader:"Fundamentals of Computer Science II"}];
    return (
    <main className="main-view">
      { data.map((cardData) => {
        return <Card header={cardData.header} subheader={cardData.subheader} />
      }) }
    </main>
    );
  }
}

export default CardView;
