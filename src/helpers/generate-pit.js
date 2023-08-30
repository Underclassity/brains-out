import { Group, BoxGeometry, Mesh, MeshBasicMaterial } from "three";

import generateGrid from "./generate-grid.js";

/**
 * Generate pit
 *
 * @param   {Number}  width   Pit width
 * @param   {height}  height  Pit height
 * @param   {Number}  depth   Pit depth
 * @param   {Number}  color   Grid color
 *
 * @return  {Object}          Group object
 */
export function generatePit(
  width = 5,
  height = 5,
  depth = 12,
  color = 0x808080
) {
  const pit = new Group();

  pit.userData.name = "Pit";

  const bottomPlane = generateGrid(width, height, color);
  bottomPlane.position.z = -depth;

  const downPlane = generateGrid(width, depth, color);
  downPlane.rotateX(Math.PI / 2);
  downPlane.position.z = -depth / 2;
  downPlane.position.y = -height / 2;

  const upPlane = generateGrid(width, depth, color);
  upPlane.rotateX(Math.PI / 2);
  upPlane.position.z = -depth / 2;
  upPlane.position.y = height / 2;

  const leftPlane = generateGrid(height, depth, color);
  leftPlane.rotateY(Math.PI / 2);
  leftPlane.rotateZ(Math.PI / 2);
  leftPlane.position.z = -depth / 2;
  leftPlane.position.x = -width / 2;

  const rightPlane = generateGrid(height, depth, color);
  rightPlane.rotateY(Math.PI / 2);
  rightPlane.rotateZ(Math.PI / 2);
  rightPlane.position.z = -depth / 2;
  rightPlane.position.x = width / 2;

  const rightBgPlane = generateGrid(100, 100, color);
  rightBgPlane.position.y = height / 2;
  rightBgPlane.position.x = width / 2 + 100 / 2;

  const leftBgPlane = generateGrid(100, 100, color);
  leftBgPlane.position.y = height / 2;
  leftBgPlane.position.x = -width / 2 - 100 / 2;

  const topBgPlane = generateGrid(width, 50, color);
  topBgPlane.position.y = 50 / 2 + height / 2;

  const bottomBgPlane = generateGrid(width, 50 - height, color);
  bottomBgPlane.position.y = -50 / 2;

  pit.add(bottomPlane);
  pit.add(downPlane);
  pit.add(upPlane);
  pit.add(leftPlane);
  pit.add(rightPlane);

  pit.add(leftBgPlane);
  pit.add(rightBgPlane);
  pit.add(topBgPlane);
  pit.add(bottomBgPlane);

  const geometry = new BoxGeometry(width, height, depth);
  const material = new MeshBasicMaterial({
    color: 0xfa_fa_fa,
    transparent: true,
    opacity: 0.1,
  });
  const cube = new Mesh(geometry, material);
  cube.name = "pit";

  cube.position.z = -depth / 2;

  pit.add(cube);

  return pit;
}

export default generatePit;
