import RequestPool, { MAX_SIMULTANEOUS_REQUESTS } from '../../src/cache/RequestPool';

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
    for (let i = 0; i < MAX_SIMULTANEOUS_REQUESTS / 2; i++) {
      requestPool.request().then((id) => {
        count++;
        requestPool.return(id);
      });
    }

    await requestPool.barrier();

    expect(count).toBe(Math.floor(MAX_SIMULTANEOUS_REQUESTS / 2));
  });

  it('should resolve a barrier request immediately if clean', async () => {
    await requestPool.barrier();
  }, 10);

  it('should wait on returning if there are none to hand out.', async () => {
    let singleId;
    for (let i = 0; i < MAX_SIMULTANEOUS_REQUESTS; i++) {
      singleId = await requestPool.request();
    }

    // Now there aren't any more slots available, force something to be added
    requestPool.request();
    expect(requestPool.status).toBeFalsy();

    // Returning one should make show that there is no queue.
    requestPool.return(singleId);
    expect(requestPool.status).toBeTruthy();
  });
});
