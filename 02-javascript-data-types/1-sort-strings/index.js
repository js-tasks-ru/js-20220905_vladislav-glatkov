/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  if (param !== 'asc' && param !== 'desc') {
    console.log('sort.error');
    return; 
  }

  let direction = 1;

  if (param === 'desc') {
    direction = -1;
  }
  return [...arr].sort((a, b)=> {
    return direction * a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
  });
}
