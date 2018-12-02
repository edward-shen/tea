import { updateClassCache, updateMetaCache } from './cache/CacheManager';
import loadConfig from './Config';
import Driver from './Driver';

async function main() {
  const {username, password} = loadConfig();

  if (!username || !password) {
    process.exit(-1);
  }

  await Driver.auth();
  console.log('Driver has been authenticated!');

  await updateMetaCache();
  await updateClassCache();
}

main();
