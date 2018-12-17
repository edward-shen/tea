import * as React from 'react';

interface RatingBoxProps {
  rating?: string | number;
  delta?: string | number;
  desc?: string;
  subtext?: string | string[];
  href?: string;
  style?: React.CSSProperties;
}

class RatingBox extends React.Component<RatingBoxProps> {

  public render() {
    let subTexts;
    if (this.props.subtext instanceof Array) {
      subTexts = this.props.subtext.map((text) => {
        return <p className='rating-small'>{text}</p>;
      });
    } else {
      subTexts = <p className='rating-small'>{this.props.subtext}</p>;
    }

    const returnVal = (
      <section className='rating rounded hover-shadow'>
          <span className='rating-with-delta'>
            <h1>{this.props.rating}</h1>
            { this.props.delta && <span
              style={this.props.style}
              className='rating-difference rounded'>
              {this.props.delta}
            </span> }
          </span>
          {subTexts}
        <p>{this.props.desc}</p>
      </section>);

    if (this.props.href) {
      return <a href={this.props.href} >{returnVal}</a>;
    }

    return returnVal;
  }
}

export default RatingBox;
