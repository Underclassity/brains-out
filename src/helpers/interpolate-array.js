/**
 * Interpolate array
 *
 * @param   {[Number]}     data          Input array of number
 * @param   {Number}       fitCount      Fit count
 *
 * @return  {[Number]}                   Interpolated array
 */
export function interpolateArray(data = [], fitCount = 0) {
  if (!data?.length) {
    return [];
  }

  if (!fitCount) {
    return [];
  }

  const linearInterpolate = (before, after, atPoint) =>
    before + (after - before) * atPoint;

  const newData = new Array();
  const springFactor = new Number((data.length - 1) / (fitCount - 1));

  newData[0] = data[0]; // for new allocation

  for (let i = 1; i < fitCount - 1; i++) {
    const tmp = i * springFactor;
    const before = new Number(Math.floor(tmp)).toFixed();
    const after = new Number(Math.ceil(tmp)).toFixed();
    const atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
  }

  newData[fitCount - 1] = data[data.length - 1]; // for new allocation

  return newData;
}

export default interpolateArray;
