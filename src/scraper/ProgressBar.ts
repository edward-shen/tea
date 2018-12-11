import { Bar, Presets } from 'cli-progress';
import { green } from 'colors';

/**
 * Wrapper class for the progress bar module. It also standardizes the look of
 * the progress bar.
 */
class ProgressBar {
  private readonly bar = new Bar({
    format: '{bar} {percentage}% '
      + `(${green('{value}')}/{total})`
      + ` | {duration_formatted}}`,
  },                             Presets.shades_classic);
  private readonly maxValue;

  public constructor(maxValue) {
    this.maxValue = maxValue;
  }

  public start(initVal = 0): void {
    this.bar.start(this.maxValue, initVal);
  }

  public increment(): void {
    this.bar.increment(1);
  }

  public stop(): void {
    this.bar.stop();
  }
}

export default ProgressBar;
