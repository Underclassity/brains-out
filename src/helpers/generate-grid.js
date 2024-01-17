import {
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
} from "three";

import ToQuads from "./to-quads.js";
// import log from "./log.js";

const pitBgMaterial = new MeshBasicMaterial({
  color: 0xfa_fa_fa,
  transparent: true,
  opacity: 0.1,
});
pitBgMaterial.name = "pit-bg-material";

/**
 * Generate grid plane
 *
 * @param   {Number}    [width=10]            Plane width
 * @param   {Number}    [height=10]           Plane height
 * @param   {Number}    [color=0x80_80_80]    Lines color
 * @param   {Boolean}   [bg=false]            BG plane flag
 *
 * @return  {Object}            Grid plane
 */
export function generateGrid(
  width = 10,
  height = 10,
  color = 0x80_80_80,
  bg = false
) {
  // log(`Generate grid ${width}x${height}`);

  const gXY = new PlaneGeometry(width, height, width, height);
  ToQuads(gXY);
  const mXY = new LineBasicMaterial({ color, transparent: true });

  const grXY = new LineSegments(gXY, mXY);

  if (!bg) {
    return grXY;
  }

  const group = new Group();

  const bgPlane = new PlaneGeometry(width, height, width, height);
  const bgMesh = new Mesh(bgPlane, pitBgMaterial);

  group.add(grXY);
  group.add(bgMesh);

  return group;
}

export default generateGrid;
