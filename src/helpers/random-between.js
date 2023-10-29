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

/**
 * Generate random float number between two float number
 *
 * @param   {Number}  min  Min float number
 * @param   {Number}  max  Max float number
 *
 * @return  {Number}       Generated float number
 */
export function randomBetweenFloats(min = 0, max = 0) {
  // check for equal
  if (min == max) {
    return min;
  }

  // check if min greater
  if (max < min) {
    const x = max;
    max = min;
    min = x;
  }

  // min and max included
  return Math.random() * (max - min) + min;
}

export default randomBetween;
