import RequestPool from '../../src/cache/RequestPool';

describe('Requesting requests should work', () => {

  let requestPool;

  beforeEach(() => {
    requestPool = new RequestPool();
  });

  it('should immediately resolve all available requests', async () => {
    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS; i++) {
      await requestPool.request();
    }

    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS; i++) {
      requestPool.return();
    }
  }, 100);

  it('should be able properly hand out and return requests', async () => {
    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS; i++) {
      await requestPool.request();
    }

    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS; i++) {
      requestPool.return();
    }

    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS; i++) {
      await requestPool.request();
    }

    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS; i++) {
      requestPool.return();
    }
  }, 100);

  it('should hold off until all resolve with a barrier', async () => {
    let count = 0;
    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS / 2; i++) {
      requestPool.request().then(() => {
        count++;
        requestPool.return();
      });
    }

    await requestPool.barrier();

    expect(count).toBe(Math.floor(requestPool.MAX_SIMULTANEOUS_REQUESTS / 2));
  });

  it('should wait on returning if there are none to hand out.', async () => {
    for (let i = 0; i < requestPool.MAX_SIMULTANEOUS_REQUESTS; i++) {
      await requestPool.request();
    }

    // Now there aren't any more slots available, force something to be added
    requestPool.request();

    expect(requestPool.status).toBeFalsy();

    requestPool.return();

    expect(requestPool.status).toBeTruthy();
  });
});
