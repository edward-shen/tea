
import * as React from 'react';
import Card, { CardProps } from './Card';

import './css/CardView.scss';

interface CardViewState {
  search: CardProps[];
}

class CardView extends React.Component<{}, CardViewState> {

  public constructor(props) {
    super(props);
    this.state = {search: []};
  }

  public componentDidMount() {
    fetch('api/search')
      .then(res => res.json())
      .then(res => this.setState({search: res}));
  }

  public render() {
    return (
    <main className="main-view">
      { this.state.search.map((cardData) => {
        return <Card header={cardData.header} subheader={cardData.subheader} />
      }) }
    </main>
    );
  }
}

export default CardView;
