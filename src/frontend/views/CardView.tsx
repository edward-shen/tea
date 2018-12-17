
import * as objectHash from 'object-hash';
import * as React from 'react';
import * as InfiniteScroller from 'react-infinite-scroller';

import CardType from '../../common/api/CardType';
import Card from '../Card';

interface CardViewState {
  results: CardType[];
}

class CardView extends React.Component<{}, CardViewState> {

  public constructor(props) {
    super(props);
    this.state = { results: [] };
  }

  public render() {
    return (
      <InfiniteScroller
        className='cardview'
        hasMore={true}
        pageStart={0}
        loader={<div className='loader' key={0}>Loading ...</div>}
        loadMore={this.getMore.bind(this)}>
        {this.state.results}
      </InfiniteScroller>
    );
  }

  private async getMore(pageNo: number) {
    const moreCards = await (await fetch(`/api/search?page=${pageNo}`)).json();
    const newResults = [
      ...this.state.results,
      ...moreCards.map((cardData) => {
        return <Card key={objectHash.MD5(cardData)} {...cardData}/>;
      }),
    ];

    this.setState({ results: newResults });
  }
}

export default CardView;
