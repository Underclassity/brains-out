import { Group, PlaneGeometry, LineBasicMaterial, LineSegments } from "three";

import ToQuads from "./to-quads.js";
// import log from "./log.js";

/**
 * Generate grid plane
 *
 * @param   {Number}   width    Plane width
 * @param   {Number}   height   Plane height
 * @param   {Number}   color    Lines color
 *
 * @return  {Object}            Grid plane
 */
export function generateGrid(width = 10, height = 10, color = 0x808080) {
  // log(`Generate grid ${width}x${height}`);

  const group = new Group();

  const gXY = new PlaneGeometry(width, height, width, height);
  ToQuads(gXY);
  const mXY = new LineBasicMaterial({ color });

  const grXY = new LineSegments(gXY, mXY);

  group.add(grXY);

  return grXY;
}

export default generateGrid;
