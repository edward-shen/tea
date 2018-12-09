import { resolve } from 'path';
import Config from '../common/Config';

const DATABASE_LOCATION = resolve(__dirname, `../../${Config.database.location}`);

/**
 * Returns an object with key-value pairs. This will fill as many key-value
 * pairs as possible, and ignores extra values on each side.
 *
 * @param keys A list of keys
 * @param values A list of values.
 */
function zip(keys: any[], values: any[]) {
  const ret = {};

  if (!keys || !values) {
    return {};
  }

  values.map((v, i) => {
    if (keys[i]) {
      ret[keys[i]] = v;
    }
  });
  return ret;
}

/**
 * Delays execution for the provided length.
 *
 * @param millis The number of milliseconds to delay.
 */
async function delay(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export { DATABASE_LOCATION, delay, zip };
