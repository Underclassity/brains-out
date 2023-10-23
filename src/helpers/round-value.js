/**
 * Round to fixed value helper
 *
 * @param   {Number}  value        Input number
 * @param   {Number}  [numbers=3]  Delimeter count
 *
 * @return  {Number}               Rounded to fixed number
 */
export function roundValue(value, numbers = 3) {
  const divider = 10 ** numbers;

  return Math.round(value * divider) / divider;
}

export default roundValue;
