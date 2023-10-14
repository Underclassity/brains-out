/**
 * Split number to numbers with same sum (https://stackoverflow.com/questions/45652867/how-to-divide-number-n-in-javascript-into-x-parts-where-the-sum-of-all-the-part)
 *
 * @param   {Number}  num    Input number
 * @param   {Number}  parts  Parts length
 *
 * @return  {Array}          Numbers array
 */
export function splitNParts(num, parts) {
  const result = [];

  for (let i = 0; i < parts; i++) {
    result[i] = Math.floor(num / parts);
  }

  const sum = result.reduce((prev, curr) => prev + curr, 0);

  if (num - sum > 0) {
    result[result.length - 1] += num - sum;
  }

  return result;
}

export default splitNParts;
