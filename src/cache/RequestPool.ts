import * as Deque from 'double-ended-queue';

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
 */
class RequestPool {
  public readonly MAX_SIMULTANEOUS_REQUESTS = 50;

  private numAvailable = this.MAX_SIMULTANEOUS_REQUESTS;
  private queue = new Deque();
  private barrierQueue = new Deque();

  /**
   * Requests to make a request to the outgoing server. Will return immediately
   * if there we haven't reached the maximum number of in-air requests.
   * Otherwise, the promise will resolve whenever a slot becomes available.
   */
  public async request() {
    return new Promise((resolve) => {
      if (this.numAvailable > 0) {
        this.numAvailable -= 1;
        resolve();
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
  public async return() {
    // Check for waiting resolves, pop one instead if it's not empty.
    if (this.numAvailable === 0 && !this.queue.isEmpty()) {
      this.queue.pop()();
    } else {
      this.numAvailable += 1;
      if (this.numAvailable === this.MAX_SIMULTANEOUS_REQUESTS) {
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
}

export default RequestPool;
