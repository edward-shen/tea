import Driver from '../Driver';
import ProgressBar from '../ProgressBar';
import CacheStatus from './CacheStatus';
import MetaCache from './MetaCache';
import RequestPool from './RequestPool';

async function updateMetaCache() {
  if (await Driver.checkCache() === CacheStatus.OUT_OF_DATE) {
    await MetaCache.finishInit();

    /**
     * TODO: So this code is under the assumption that we will always add $rpp
     * amounts every time, and that the database is consistent to every $rpp
     * reports. This might not be the case, so we need to delete entries until
     * we hit a multiple of $rpp, and then start fetching from there.
     * There isn't really a clean way to do this otherwise because of the
     * limitations of the API.
     */

     // Might be better to work backwards.

    const start = await MetaCache.size();
    const toFetch: number = await Driver.latestSize() - start;
    const rpp = 100;
    const bar = new ProgressBar(Math.ceil(toFetch / rpp));

    bar.start();
    const pool = new RequestPool();

    // No need to ceil this
    for (let i = 1; i < toFetch / rpp; i++) {
      await pool.request();
      Driver.getMetaPage(i, rpp).then((res) => {
        MetaCache.addToCache(res.data);
        bar.increment();
        pool.return();
      });
    }

    await pool.barrier();
    bar.stop();
  }
}

export { updateMetaCache };
