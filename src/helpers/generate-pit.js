import {
  BoxGeometry,
  BoxHelper,
  Color,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  Vector3,
} from "three";

import generateGrid from "./generate-grid.js";
import getRandom from "./random.js";
import log from "./log.js";
import shuffle from "./shuffle.js";

import { grassColorPalette } from "../components/MainScreen/color-palette.js";
import randomBetween from "./random-between.js";
import splitNParts from "./split-n-parts.js";

const axisTypes = ["x", "y", "z"];
const angleTypes = [0, 90, 180, 270];

const xAxis = new Vector3(1, 0, 0).normalize();
const yAxis = new Vector3(0, 1, 0).normalize();
const zAxis = new Vector3(0, 0, 1).normalize();

/**
 * Random rotate element
 *
 * @param   {Object}  element  Element
 *
 * @return  {Object}           Rotated element
 */
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

  return element;
}

/**
 * Generate instanced mesh from part mesh
 *
 * @param   {Object}  part   Part mesh
 * @param   {Number}  count  Draw call count
 *
 * @return  {Object}         New instanced mesh
 */
function getMesh(part, count) {
  const mesh = new InstancedMesh(part.geometry, part.material, count);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);

  return mesh;
}

/**
 * Update instanced mesh position
 *
 * @param   {Object}   mesh                      Instanced mesh
 * @param   {Object}   dummy                     Object3D dummy
 * @param   {Number}   counter                   Mesh counter
 * @param   {Number}   [x=0]                     X position
 * @param   {Number}   [y=0]                     Y position
 * @param   {Number}   [z=0]                     Z position
 * @param   {Boolean}  [randomRotation=true]     Random rotate object flag
 *
 * @return  {Number}                             Updated mesh counter
 */
function updateInstancedMesh(
  mesh,
  dummy,
  counter,
  x = 0,
  y = 0,
  z = 0,
  randomRotation = true,
  gridColor = false
) {
  dummy.position.set(x, y, z);

  if (randomRotation) {
    randomRotate(dummy);
    randomRotate(dummy);
  }

  if (gridColor) {
    mesh.setColorAt(counter, gridColor);
  }

  dummy.updateMatrix();

  mesh.setMatrixAt(counter, dummy.matrix);
  counter++;

  return counter;
}

/**
 * Put mesh helper
 *
 * @param   {Boolean}  [isInstanced=true]       Instanced flag
 * @param   {Object}   instancedMesh            Instanced mesh
 * @param   {Object}   part                     Part mesh
 * @param   {Object}   dummy                    Object3D dummy
 * @param   {Object}   group                    Group object
 * @param   {String}   color                    Color
 * @param   {Number}   counter                  Mesh counter
 * @param   {Number}   [x=0]                    X position
 * @param   {Number}   [y=0]                    Y position
 * @param   {Number}   [z=0]                    Z position
 * @param   {Boolean}  [randomRotation=true]    Random rotate object flag
 *
 * @return  {Number}                            Updated counter
 */
function putMeshHelper(
  isInstanced = true,
  instancedMesh,
  part,
  dummy,
  group,
  color,
  counter,
  x = 0,
  y = 0,
  z = 0,
  randomRotation = true,
  gridColor = false
) {
  // Reset dummy
  dummy.position.set(0, 0, 0);
  dummy.rotation.set(0, 0, 0);

  if (isInstanced) {
    return updateInstancedMesh(
      instancedMesh,
      dummy,
      counter,
      x,
      y,
      z,
      randomRotation,
      gridColor
    );
  }

  const mesh = part.clone();
  mesh.frustumCulled = false;

  mesh.position.set(x, y, z);

  if (randomRotation) {
    randomRotate(mesh);
    randomRotate(mesh);
  }

  group.add(mesh);
  group.add(new BoxHelper(mesh, color));

  return counter;
}

/**
 * Add planes helpers
 *
 * @param   {Number}  width   Pit width
 * @param   {Number}  height  Pit height
 * @param   {Number}  depth   Pit depth
 * @param   {Number}  size    Block size
 * @param   {Object}  pit     Group object
 *
 * @return  {Boolean}         Result
 */
export function addPlaneHelpers(width, height, depth, size, pit) {
  const pitMaterial = new MeshBasicMaterial({
    color: new Color(0x38_14_02),
  });

  const bottomGeometry = new PlaneGeometry(width, height);
  const pitBottomMesh = new Mesh(bottomGeometry, pitMaterial);
  const leftRightGeometry = new PlaneGeometry(depth, height);
  const topBottomGeometry = new PlaneGeometry(depth, width);

  const leftMesh = new Mesh(leftRightGeometry, pitMaterial);
  const rightMesh = new Mesh(leftRightGeometry, pitMaterial);
  const topMesh = new Mesh(topBottomGeometry, pitMaterial);
  const bottomMesh = new Mesh(topBottomGeometry, pitMaterial);

  pitBottomMesh.position.setZ(-depth * 1.5);

  leftMesh.rotateY(MathUtils.degToRad(90));
  rightMesh.rotateY(MathUtils.degToRad(-90));
  topMesh.rotateY(MathUtils.degToRad(90));
  topMesh.rotateX(MathUtils.degToRad(90));
  bottomMesh.rotateY(MathUtils.degToRad(90));
  bottomMesh.rotateX(MathUtils.degToRad(-90));

  leftMesh.position.setX(-width / 2 - size);
  rightMesh.position.setX(width / 2 + size);
  topMesh.position.setY(height / 2 + size);
  bottomMesh.position.setY(-height / 2 - size);
  leftMesh.position.setZ(-depth / 2);
  rightMesh.position.setZ(-depth / 2);
  topMesh.position.setZ(-depth / 2);
  bottomMesh.position.setZ(-depth / 2);

  pit.add(pitBottomMesh);
  pit.add(leftMesh);
  pit.add(rightMesh);
  pit.add(topMesh);
  pit.add(bottomMesh);

  const grassPlaneMaterial = new MeshBasicMaterial({
    color: new Color(0x18_ba_4b),
  });

  const topBottomGrassGeometry = new PlaneGeometry(10 * 2 + width, 9);
  const leftRightGrassGeometry = new PlaneGeometry(10 - 1, height + 2);

  const topGrassMesh = new Mesh(topBottomGrassGeometry, grassPlaneMaterial);
  const bottomGrassMesh = new Mesh(topBottomGrassGeometry, grassPlaneMaterial);
  const leftGrassMesh = new Mesh(leftRightGrassGeometry, grassPlaneMaterial);
  const rightGrassMesh = new Mesh(leftRightGrassGeometry, grassPlaneMaterial);

  topGrassMesh.position.setY(height / 2 + 10 / 2 + size / 2);
  bottomGrassMesh.position.setY(-height / 2 - 10 / 2 - size / 2);
  leftGrassMesh.position.setX(-width / 2 - 10 / 2 - size / 2);
  rightGrassMesh.position.setX(width / 2 + 10 / 2 + size / 2);
  topGrassMesh.position.setZ(-size / 2);
  bottomGrassMesh.position.setZ(-size / 2);
  leftGrassMesh.position.setZ(-size / 2);
  rightGrassMesh.position.setZ(-size / 2);

  pit.add(topGrassMesh);
  pit.add(bottomGrassMesh);
  pit.add(leftGrassMesh);
  pit.add(rightGrassMesh);

  return true;
}

/**
 * Generate pit
 *
 * @param   {Number}    [width=5]               Pit width
 * @param   {height}    [height=5]              Pit height
 * @param   {Number}    [depth=12]              Pit depth
 * @param   {Number}    [color=0x808080]        Grid color
 * @param   {Array}     [pitParts=[]]           Pit parts
 * @param   {Boolean}   [simple=false]          Simple view
 * @param   {Boolean}   viewWidth               View width
 * @param   {Number}    viewHeight              View height
 * @param   {Boolean}   [pitGrid=false]         Add pit grid colors
 *
 * @return  {Object}               Group object
 */
export function generatePit(
  width = 5,
  height = 5,
  depth = 12,
  size = 1,
  color = 0x80_80_80,
  pitParts = [],
  simple = false,
  isInstanced = false,
  viewWidth,
  viewHeight,
  pitGrid = false
) {
  width = parseInt(width, 10);
  height = parseInt(height, 10);
  depth = parseInt(depth, 10);

  const pit = new Group();
  pit.userData.name = "Pit";

  if (simple) {
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
  } else {
    const groundPart = pitParts.find((item) => item.name == "G_Ground");
    const grassPart = pitParts.find((item) => item.name == "G_Grass");
    const groundAndGrassPart = pitParts.find(
      (item) => item.name == "G_GrassToGround"
    );

    // Set scale
    groundPart.scale.set(1, 1, 1);
    grassPart.scale.set(1, 1, 1);
    groundAndGrassPart.scale.set(1, 1, 1);

    const hHeight = height / 2;
    const hSize = size / 2;
    const hWidth = width / 2;

    // const box = new BoxGeometry(1, 1);

    // const groundMaterial = new MeshBasicMaterial({ color: 0x3a_2e_27 });
    // const grassMaterial = new MeshBasicMaterial({ color: 0x3a_7c_25 });
    // const groundAndGrassMaterial = new MeshBasicMaterial({ color: 0x43_5c_61 });

    // const groundPart = new Mesh(box, groundMaterial);
    // const grassPart = new Mesh(box, grassMaterial);
    // const groundAndGrassPart = new Mesh(box, groundAndGrassMaterial);

    const pitGroup = new Group();

    const dummy = new Object3D();

    const xArr = [];
    const yArr = [];

    const groundGrassCount = width * 2 + height * 2 + 4;
    const groundCount =
      width * height +
      2 * width * (depth - 1) +
      2 * height * (depth - 1) +
      4 * depth +
      (width + height) * 2;
    // const grassCount =
    //   (width + 20) * (height + 20) -
    //   width * height -
    //   width * 2 -
    //   height * 2 -
    //   4;

    const widthDiff = Math.round((viewWidth - width) / 2);
    const heightDiff = Math.round((viewHeight - height) / 2);

    const grassCount =
      2 * (width + widthDiff * 2) * heightDiff +
      2 * widthDiff * height -
      width * 2 -
      height * 2 -
      4;

    log("Ground", groundCount);
    log("Grass", grassCount);
    log("Ground and grass", groundGrassCount);

    let grassColorCounter = splitNParts(grassCount, grassColorPalette.length);

    grassColorCounter = grassColorCounter.filter((item) => item > 0);

    const grassParts = [];
    const grassMeshes = [];
    const grassPartsCounter = {};

    // Shuffle color before use
    const grassColors = shuffle(grassColorPalette);

    grassColorCounter.forEach((count, index) => {
      // Clone part
      const part = grassPart.clone();

      // Change material color from palette
      // part.material.color = grassColorPalette[index];
      part.material = new MeshPhongMaterial({
        color: grassColors[index],
      });
      part.material.flatShading = true;

      // Save grass part
      grassParts[index] = part;
      grassMeshes[index] = getMesh(part, count);
      grassMeshes[index].name = `grass-${index}`;
      grassPartsCounter[index] = 0;

      pitGroup.add(grassMeshes[index]);
    });

    let groundCounter = 0;
    // let grassCounter = 0;
    let groundAndGrassCounter = 0;

    // const grassMesh = getMesh(grassPart, grassCount);
    const groundMesh = getMesh(groundPart, groundCount);
    const groundAndGrassMesh = getMesh(groundAndGrassPart, groundGrassCount);

    // grassMesh.name = "grass";
    groundMesh.name = "ground";
    groundAndGrassMesh.name = "groundAndGrass";

    if (isInstanced) {
      // pitGroup.add(grassMesh);
      pitGroup.add(groundMesh);
      pitGroup.add(groundAndGrassMesh);
    }

    groundMesh.material.color = new Color(0xffffff);

    const firstColor = new Color(0x886a5c);
    const secondColor = new Color(0xaa8573);

    let counter = 1;

    // Generate bottom
    for (let x = -hWidth + hSize; x < hWidth; x++) {
      for (let y = -hHeight + hSize; y < hHeight; y++) {
        xArr.push(x);
        yArr.push(y);

        groundCounter = putMeshHelper(
          isInstanced,
          groundMesh,
          groundPart,
          dummy,
          pitGroup,
          color,
          groundCounter,
          x,
          y,
          -depth,
          true,
          counter % 2 == 0 && pitGrid ? firstColor : secondColor
        );
        counter++;
      }
    }

    counter = 1;

    for (let z = -depth + 1; z < 0; z++) {
      // Generate left and right walls
      for (let y = -hHeight + hSize; y < hHeight; y++) {
        let x = -hWidth - hSize;

        groundCounter = putMeshHelper(
          isInstanced,
          groundMesh,
          groundPart,
          dummy,
          pitGroup,
          color,
          groundCounter,
          x,
          y,
          z,
          true,
          counter % 2 == 0 && pitGrid ? firstColor : secondColor
        );

        x = hWidth + hSize;

        groundCounter = putMeshHelper(
          isInstanced,
          groundMesh,
          groundPart,
          dummy,
          pitGroup,
          color,
          groundCounter,
          x,
          y,
          z,
          true,
          counter % 2 == 0 && pitGrid ? firstColor : secondColor
        );

        counter++;
      }
    }

    counter = 0;

    for (let z = -depth + 1; z < 0; z++) {
      // Generate top and bottom walls
      for (let x = -hWidth + hSize; x < hWidth; x++) {
        let y = -hHeight - hSize;

        groundCounter = putMeshHelper(
          isInstanced,
          groundMesh,
          groundPart,
          dummy,
          pitGroup,
          color,
          groundCounter,
          x,
          y,
          z,
          true,
          counter % 2 == 0 && pitGrid ? firstColor : secondColor
        );

        y = hHeight + hSize;

        groundCounter = putMeshHelper(
          isInstanced,
          groundMesh,
          groundPart,
          dummy,
          pitGroup,
          color,
          groundCounter,
          x,
          y,
          z,
          true,
          counter % 2 == 0 && pitGrid ? firstColor : secondColor
        );

        counter++;
      }
    }

    // Hide blocks
    for (let z = -depth + 1; z < 0; z++) {
      let x = -hWidth - hSize;
      let y = -hHeight - hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        z,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );

      counter++;

      x = hWidth + hSize;
      y = hHeight + hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        z,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );

      x = -hWidth - hSize;
      y = hHeight + hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        z,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );

      x = hWidth + hSize;
      y = -hHeight - hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        z,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );
    }

    for (let x = -hWidth + hSize - 1; x < hWidth + 1; x++) {
      let y = -hHeight - hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        -depth,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );

      y = hHeight + hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        -depth,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );
    }

    for (let y = -hHeight + hSize; y < hHeight; y++) {
      let x = -hWidth - hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        -depth,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );

      x = hWidth + hSize;

      groundCounter = putMeshHelper(
        isInstanced,
        groundMesh,
        groundPart,
        dummy,
        pitGroup,
        color,
        groundCounter,
        x,
        y,
        -depth,
        true,
        x % 2 == 0 && y % 2 == 0 ? firstColor : secondColor
      );
    }

    for (let x = -hWidth + hSize - widthDiff; x < hWidth + widthDiff; x++) {
      for (
        let y = -hHeight + hSize - heightDiff;
        y < hHeight + heightDiff;
        y++
      ) {
        if (xArr.includes(x) && yArr.includes(y)) {
          continue;
        }

        if (
          (x == -hWidth - hSize &&
            y >= -hHeight + hSize &&
            y <= hHeight - hSize) ||
          (x == hWidth + hSize &&
            y >= -hHeight + hSize &&
            y <= hHeight - hSize) ||
          (x >= -hWidth - hSize &&
            x <= hWidth + hSize &&
            y == hHeight + hSize) ||
          (x >= -hWidth - hSize && x <= hWidth + hSize && y == -hHeight - hSize)
        ) {
          groundAndGrassCounter = putMeshHelper(
            isInstanced,
            groundAndGrassMesh,
            groundAndGrassPart,
            dummy,
            pitGroup,
            color,
            groundAndGrassCounter,
            x,
            y,
            0,
            false
          );
        } else {
          let index = randomBetween(0, grassParts.length - 1);

          if (grassPartsCounter[index] >= grassColorCounter[index]) {
            while (grassPartsCounter[index] >= grassColorCounter[index]) {
              index = randomBetween(0, grassParts.length - 1);
            }
          }

          grassPartsCounter[index] = putMeshHelper(
            isInstanced,
            grassMeshes[index],
            grassParts[index],
            dummy,
            pitGroup,
            color,
            grassPartsCounter[index],
            x,
            y,
            0
          );
        }
      }
    }

    addPlaneHelpers(width, height, depth, size, pit);

    pit.add(pitGroup);
  }

  return pit;
}

export default generatePit;
