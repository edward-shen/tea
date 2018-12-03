import * as Deque from 'double-ended-queue';

const MAX_SIMULTANEOUS_REQUESTS = 50;
const RTT_NEW_WEIGHT_MODIFIER = 0.2;
const MAX_AVG_RTT_MILLIS = 10000;
const RESET_TIMEOUT_MILLIS = 60000; // 1 minute

/**
 * <rant>
 * I really should need to make this class. Turns out, if you send 271 requests
 * to the TRACE server, you'll just cause whatever puny server that it's hosted
 * on to drop everything and just return a 500. But not because you sent too
 * many requests at the same time (well, yes, because of that), but because
 * there's a nested exception where the spring framework they're using can't
 * create a Transaction.
 *
 * If you're going to fail, at least fail in the way that you don't have
 * stacktrace enabled. Basic security principles, people!
 *
 * So here I am, making a class that limits the number of fucking simultaneous
 * requests. Hell, it doesn't really do anything but keep track of requesters.
 * </rant>
 *
 * Well, regardless, making a custom pool will let me have finer control over
 * stuff like displaying progress bars.
 *
 * This pool will
 */
class RequestPool {

  private available: Deque<number>  = new Deque(MAX_SIMULTANEOUS_REQUESTS);
  private queue: Deque<(id: any) => void> = new Deque();
  private barrierQueue: Deque<() => void> = new Deque();

  private checkoutTimes = new Array(MAX_SIMULTANEOUS_REQUESTS);
  private runningRTTAvg = 0;

  constructor() {
    for (let i = 0; i < MAX_SIMULTANEOUS_REQUESTS; i++) {
      this.available.push(i);
    }
  }

  /**
   * Requests to make a request to the outgoing server. Will return immediately
   * if there we haven't reached the maximum number of in-air requests.
   * Otherwise, the promise will resolve whenever a slot becomes available.
   */
  public async request(): Promise<number> {
    return new Promise<number>(async (resolve) => {
      if (!this.available.isEmpty()) {
        resolve(await this.checkout());
      } else {
        this.queue.push(resolve);
      }
    });
  }

  /**
   * Signal that the request is no longer in air and that another request can
   * be made. This will immediately resolve the longest-waiting request, or if
   * no requests are waiting, increment the number of available requests.
   *
   * If the pool is fully replenished, resolve all barrier promises.
   */
  public async return(id: number) {
    const difference = Date.now() - this.checkoutTimes[id];
    this.runningRTTAvg = this.runningRTTAvg * (1 - RTT_NEW_WEIGHT_MODIFIER)
      + difference * RTT_NEW_WEIGHT_MODIFIER;

    // Check for waiting resolves, pop one instead if it's not empty.
    if (!this.available.isEmpty() && !this.queue.isEmpty()) {
      this.queue.pop()(await this.checkout());
    } else {
      this.available.push(id);
      if (this.available.toArray().length === MAX_SIMULTANEOUS_REQUESTS) {
        while (!this.barrierQueue.isEmpty()) {
          this.barrierQueue.pop()();
        }
      }
    }
  }

  /**
   * Returns the status of the pool.
   *
   * @returns whether or not the pool has slots available.
   */
  public get status(): boolean {
    return this.queue.isEmpty();
  }

  /**
   * Waits for the pool to be completely replenished before resolving. This is
   * very similar to OMP's `#pragma barrier`.
   */
  public async barrier() {
    return new Promise((resolve) => this.barrierQueue.push(resolve));
  }

  /**
   * Performs the bookkeeping needed to "checkout" a request. If the RTT time is
   * greater than the allowed value, wait until checking out.
   */
  private async checkout(): Promise<number> {
    if (this.runningRTTAvg >= MAX_AVG_RTT_MILLIS) {
      console.warn('Average RTT exceeded limit, waiting timeout before continuing!');
      await new Promise((resolve) => setTimeout(() => resolve(), RESET_TIMEOUT_MILLIS));
      this.runningRTTAvg = 0;
      console.log('Resuming after timeout');
    }

    const threadId = this.available.pop();
    this.checkoutTimes[threadId] = Date.now();
    return threadId;
  }
}

export default RequestPool;
