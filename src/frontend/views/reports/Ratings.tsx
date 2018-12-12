import * as React from 'react';

interface Rating {
  name: string;
  mean: number;
  deptMean: number;
}

// Colors were chosen here: https://www.colorhexa.com/d5f1fb
enum BackgroundColors {
  AMAZING = '#6dfcfc',
  GREAT = '#d5f1fb',
  GOOD = '#d5fbdf',
  NEUTRAL = 'inherit',
  BAD = '#fbdfd5',
  TERRIBLE = '#fbd5de',
  HORRENDOUS = '#f48fa7',
}

class Ratings extends React.Component<{ ratings: Rating[] }> {
  public render() {
    return (
      this.props.ratings.map((rating) => {
        return (
          <section
            className='rating rounded hover-shadow'
            style={this.getBackgroundColor(rating.mean, rating.deptMean)}>
            <h1>{rating.mean}</h1>
            <p className='rating-small'>Dept. Avg: {rating.deptMean}</p>
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
      style.backgroundColor = BackgroundColors.AMAZING;
    } else if (difference >= 2) {
      style.backgroundColor = BackgroundColors.GREAT;
    } else if (difference >= 1) {
      style.backgroundColor = BackgroundColors.GOOD;
    } else if (difference >= 0) {
      style.backgroundColor = BackgroundColors.NEUTRAL;
    } else if (difference >= -1) {
      style.backgroundColor = BackgroundColors.BAD;
    } else if (difference >= -2) {
      style.backgroundColor = BackgroundColors.TERRIBLE;
    } else {
      style.backgroundColor = BackgroundColors.HORRENDOUS;
    }

    return style;
  }
}

export default Ratings;
export { Rating };
