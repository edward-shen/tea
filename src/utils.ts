/**
 * Returns an object with key-value pairs. This will fill as many key-value
 * pairs as possible, and ignores extra values on each side.
 *
 * @param keys A list of keys
 * @param values A list of values.
 */
function zip(keys: string[], values) {
  const ret = {};
  values.map((v, i) => ret[keys[i]] = v);
  return ret;
}

export { zip };
