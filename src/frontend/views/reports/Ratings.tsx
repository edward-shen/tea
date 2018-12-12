import * as React from 'react';

interface Rating {
  name: string;
  mean: number;
  deptMean: number;
}

// Colors were chosen here: https://www.colorhexa.com/d5f1fb
enum BackgroundColors {
  GREAT = '#8ff4aa',
  GOOD = '#d5fbdf',
  NEUTRAL = 'inherit',
  BAD = '#fbd5de',
  TERRIBLE = '#f7a6b9',
}

class Ratings extends React.Component<{ ratings: Rating[] }> {
  public render() {
    return (
      this.props.ratings.map((rating) => {
        return (
          <section
            className='rating rounded hover-shadow'>
            <span>
              <h1>{rating.mean}</h1>
              <p className='rating-small'>Dept. Avg: {rating.deptMean}</p>
              <p
                style={this.getBackgroundColor(rating.mean, rating.deptMean)}
                className='rating-difference'>
                {this.getDifference(rating.mean, rating.deptMean)}
              </p>
            </span>
            <p>{rating.name}</p>
          </section>
        );
      })
    );
  }

  private getBackgroundColor(mean: number, deptMean: number) {
    // I was getting floating point errors so I converted them to integers.
    const difference = Math.round(10 * (mean - deptMean));
    console.log(difference);

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
