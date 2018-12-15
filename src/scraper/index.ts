import { cleanupDB, updateClassCache, updateMetaCache } from './cache/CacheManager';
import Driver from './Driver';
import PostProcessor from './PostProcessor';
import { delay } from './utils';

async function main() {
  await Driver.auth();

  await updateMetaCache();
  await updateClassCache();

  await PostProcessor.process();

  await delay(1000);

  // Close DBs when we're done
  cleanupDB();
}

main();
