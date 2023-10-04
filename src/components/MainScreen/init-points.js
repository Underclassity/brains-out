/**
 * Init points array helpers
 *
 * @return  {Boolean}  Result
 */
export function initPoints() {
  const { pitWidth, pitHeight, pitDepth, size } = this;

  // Reset points array
  this.xCPoints = [];
  this.yCPoints = [];
  this.zCPoints = [];
  this.xPoints = [];
  this.yPoints = [];
  this.zPoints = [];

  let firstPoint = -pitWidth / 2 + size / 2;

  for (let i = 0; i < pitWidth; i++) {
    this.xCPoints.push(firstPoint + i);
  }

  firstPoint = -pitHeight / 2 + size / 2;

  for (let i = 0; i < pitHeight; i++) {
    this.yCPoints.push(firstPoint + i);
  }

  firstPoint = -pitWidth / 2;

  for (let i = 0; i <= pitWidth; i++) {
    this.xPoints.push(firstPoint + i);
  }

  firstPoint = -pitHeight / 2;

  for (let i = 0; i <= pitHeight; i++) {
    this.yPoints.push(firstPoint + i);
  }

  firstPoint = -size / 2;

  for (let i = 0; i < pitDepth; i++) {
    this.zPoints.push(firstPoint - i);
  }

  firstPoint = 0;

  for (let i = 0; i < pitDepth; i++) {
    this.zCPoints.push(firstPoint - i);
  }

  return true;
}

export default initPoints;
