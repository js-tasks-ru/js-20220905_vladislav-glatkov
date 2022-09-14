/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) return string;
  let counter = 0;
  let currentSymbol = string[0];
  let result = '';

  for (const elem of string) {
    if (elem === currentSymbol) {
      counter++;
      counter <= size ? result += elem : result;
    } else {
      currentSymbol = elem;
      counter = 1;
      counter <= size ? result += elem : result;
    }
  }
  return result;
}
 

