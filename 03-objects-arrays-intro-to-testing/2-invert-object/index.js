/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export const invertObj = (obj) => {
  if (obj === undefined) {
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj).map(
      ([key, value]) => [value, key]
    )
  );
};
