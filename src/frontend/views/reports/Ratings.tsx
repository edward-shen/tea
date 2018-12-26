import * as React from 'react';

import { BackgroundColors } from '../Colors';
import RatingBox from './RatingBox';
import Sections, { getLink } from './Sections';

interface Rating {
  name: Sections;
  mean: number;
  deptMean: number;
}

/**
 * Displays a list of ratings as a row of rating boxes. Will provide
 * automatically colorize the delta values by an arbitrary value.
 */
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
            delta={this.getDifferenceText(rating.mean, rating.deptMean)}
            subtext={`Dept. Avg: ${rating.deptMean.toFixed(1)}`}
            style={this.getBackgroundColor(rating.mean, rating.deptMean)}/>
        );
      })
    );
  }

  // Generates the background color given the difference
  private getBackgroundColor(mean: number, deptMean: number) {
    // I was getting floating point errors so I converted them to integers.
    const difference = Math.round(10 * (mean - deptMean));

    const style = { backgroundColor: null };

    if (difference >= 3) {
      style.backgroundColor = BackgroundColors.GREAT;
    } else if (difference >= 1) {
      style.backgroundColor = BackgroundColors.GOOD;
    } else if (difference >= 0) {
      style.backgroundColor = BackgroundColors.NEUTRAL;
    } else if (difference >= -3) {
      style.backgroundColor = BackgroundColors.BAD;
    } else {
      style.backgroundColor = BackgroundColors.TERRIBLE;
    }
    return style;
  }

  /**
   * Generates text with (-, ±, or +) of the difference between two numbers,
   * rounded to the tenth.
   *
   * @param center The value to use as the anchor point.
   * @param value The value to find the difference of.
   */
  private getDifferenceText(center: number, value: number) {
    const difference = (center - value).toFixed(1);

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
