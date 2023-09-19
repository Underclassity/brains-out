/**
 * Round to fixed value helper
 *
 * @param   {Number}  value  Input number
 *
 * @return  {Number}         Rounded to fixed number
 */
export function roundValue(value) {
  return Math.round(value * 1000) / 1000;
}

export default roundValue;
