import * as React from 'react';
import Colors from '../Colors';

interface Rating {
  name: string;
  mean: number;
  deptMean: number;
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
