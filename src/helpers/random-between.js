/**
 * Generate random number between two number
 *
 * @param   {Number}  min  Min number
 * @param   {Number}  max  Max number
 *
 * @return  {Number}       Generated number
 */
export function randomBetween(min = 0, max = 0) {
  // check for equal
  if (min == max) {
    return min;
  }

  // check if min greater
  if (max < min) {
    const x = parseInt(max, 10);
    max = parseInt(min, 10);
    min = x;
  }

  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default randomBetween;
