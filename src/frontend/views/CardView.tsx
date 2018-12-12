
import * as objectHash from 'object-hash';
import * as React from 'react';

import Card, { CardData } from '../Card';

import '../css/CardView.scss';

interface CardViewState {
  search: CardData[];
}

class CardView extends React.Component<{}, CardViewState> {

  public constructor(props) {
    super(props);
    this.state = { search: [] };
  }

  public componentDidMount() {
    fetch('api/search')
      .then(res => res.json())
      .then(res => this.setState({ search: res }));
  }

  public render() {
    return (
    <main className='cardview'>
      { this.state.search.map((cardData) => {
        return <Card key={objectHash.MD5(cardData)} data={cardData}/>;
      }) }
    </main>
    );
  }
}

export default CardView;
