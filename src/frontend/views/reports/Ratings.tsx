import * as React from 'react';

import Colors from '../Colors';
import RatingBox from './RatingBox';
import Sections, { getLink } from './Sections';

interface Rating {
  name: Sections;
  mean: number;
  deptMean: number;
}

class Ratings extends React.Component<{ ratings: Rating[] }> {
  public render() {
    return (
      this.props.ratings.map((rating, index) => {
        return (
          <RatingBox
            key={index}
            rating={rating.mean.toFixed(1)}
            href={`#${getLink(rating.name)}`}
            desc={rating.name}
            delta={this.getDifference(rating.mean, rating.deptMean)}
            subtext={`Dept. Avg: ${rating.deptMean.toFixed(1)}`}
            style={this.getBackgroundColor(rating.mean, rating.deptMean)}/>
        );
      })
    );
  }

  private getBackgroundColor(mean: number, deptMean: number) {
    // I was getting floating point errors so I converted them to integers.
    const difference = Math.round(10 * (mean - deptMean));

    const style = { backgroundColor: null };

    if (difference >= 3) {
      style.backgroundColor = Colors.GREAT;
    } else if (difference >= 1) {
      style.backgroundColor = Colors.GOOD;
    } else if (difference >= 0) {
      style.backgroundColor = Colors.NEUTRAL;
    } else if (difference >= -3) {
      style.backgroundColor = Colors.BAD;
    } else {
      style.backgroundColor = Colors.TERRIBLE;
    }
    return style;
  }

  private getDifference(mean: number, deptMean: number) {
    const difference = (mean - deptMean).toFixed(1);

    if (difference[0] === '-') {
      return difference;
    }

    if (difference === '0.0') {
      return `±${difference}`;
    }

    return `+${difference}`;
  }
}

export default Ratings;
export { Rating };
