import { resolve } from 'path';

const DATABASE_LOCATION = resolve(__dirname, '../cache/');

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

export { DATABASE_LOCATION, zip };
