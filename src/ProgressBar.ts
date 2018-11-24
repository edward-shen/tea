import { Bar, Presets } from 'cli-progress';

class ProgressBar {
  private readonly bar = new Bar({}, Presets.shades_classic);
  private readonly maxValue;

  public constructor(maxValue) {
    this.maxValue = maxValue;
  }

  public start(): void {
    this.bar.start(this.maxValue, 0);
  }
  public increment(): void {
    this.bar.increment(1);
  }

  public stop(): void {
    this.bar.stop();
  }
}

export default ProgressBar;
