/**
 * Sum - returns sum of arguments if they can be converted to a number
 * @param {number} n value
 * @returns {number | function}
 */
export function sum(a) {

  let currentSum = a !== undefined ? a : 0;

  function f(b) {
    currentSum += b !== undefined ? b : 0;
    return f;
  }

  f.toString = function() {
    return currentSum;
  };

  return f;
}

 

