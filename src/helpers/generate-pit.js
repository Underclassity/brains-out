import {
  BoxGeometry,
  BoxHelper,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

import generateGrid from "./generate-grid.js";
import getRandom from "./random.js";

const axisTypes = ["x", "y", "z"];
const angleTypes = [0, 90, 180, 270];

const xAxis = new Vector3(1, 0, 0).normalize();
const yAxis = new Vector3(0, 1, 0).normalize();
const zAxis = new Vector3(0, 0, 1).normalize();

export function randomRotate(element) {
  const rotateAxis = getRandom(axisTypes)[0];
  const rotateAngle = getRandom(angleTypes)[0];

  switch (rotateAxis) {
    case "x":
      element.rotateOnWorldAxis(xAxis, MathUtils.degToRad(rotateAngle));
      break;
    case "y":
      element.rotateOnWorldAxis(yAxis, MathUtils.degToRad(rotateAngle));
      break;
    case "z":
      element.rotateOnWorldAxis(zAxis, MathUtils.degToRad(rotateAngle));
      break;
  }

  console.log(rotateAxis, rotateAngle);

  return element;
}

export function generateGridFromParts(width, height, size, part, gridColor) {
  const group = new Group();

  for (let x = -width / 2 + size / 2; x < width / 2; x++) {
    for (let y = -height / 2 + size / 2; y < height / 2; y++) {
      const meshGroup = new Group();

      const mesh = part.clone();
      mesh.position.set(x, y, 0);

      randomRotate(mesh);
      randomRotate(mesh);

      const box = new BoxHelper(mesh, gridColor);
      box.position.set(x, y, 0);

      meshGroup.add(mesh);
      meshGroup.add(box);

      group.add(meshGroup);
    }
  }

  return group;
}

/**
 * Generate pit
 *
 * @param   {Number}  width      Pit width
 * @param   {height}  height     Pit height
 * @param   {Number}  depth      Pit depth
 * @param   {Number}  color      Grid color
 * @param   {Array}   pitParts   Pit parts
 *
 * @return  {Object}             Group object
 */
export function generatePit(
  width = 5,
  height = 5,
  depth = 12,
  size = 1,
  color = 0x808080,
  pitParts = []
) {
  const pit = new Group();

  pit.userData.name = "Pit";

  const groundPart = pitParts.find((item) => item.name == "G_Ground");
  const grassPart = pitParts.find((item) => item.name == "G_Grass");
  const grassToGround = pitParts.find((item) => item.name == "G_GrassToGround");

  // const bottomPlane = generateGrid(width, height, color);
  // bottomPlane.position.z = -depth;

  const downGroup = generateGridFromParts(
    width,
    height,
    size,
    groundPart,
    color
  );
  downGroup.position.setZ(-depth - size / 2);

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

  pit.add(downGroup);

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
