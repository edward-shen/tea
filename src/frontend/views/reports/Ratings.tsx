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
      this.props.ratings.map((rating, index) => {
        return (
          <section key={index} // Static data so this is ok.
            className='rating rounded hover-shadow'>
            <span>
              <span className='test'>
                <h1>{rating.mean ? rating.mean.toFixed(1) : 'N/A' }</h1>
                { rating.mean && <span
                  style={this.getBackgroundColor(rating.mean, rating.deptMean)}
                  className='rating-difference rounded'>
                  {this.getDifference(rating.mean, rating.deptMean)}
                </span> }
              </span>
              <p className='rating-small'>
                {rating.deptMean ? `Dept. Avg: ${rating.deptMean.toFixed(1)}` : 'No available data'}
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
