import {
  BoxGeometry,
  BoxHelper,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from "three";

import generateGrid from "./generate-grid.js";
import getRandom from "./random.js";

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
 * @param   {Object}  mesh     Instanced mesh
 * @param   {Object}  dummy    Object3D dummy
 * @param   {Number}  counter  Mesh counter
 * @param   {Number}  [x=0]    X position
 * @param   {Number}  [y=0]    Y position
 * @param   {Number}  [z=0]    Z position
 *
 * @return  {Number}           Updated mesh counter
 */
function updateInstancedMesh(mesh, dummy, counter, x = 0, y = 0, z = 0) {
  dummy.position.set(x, y, z);

  randomRotate(dummy);
  randomRotate(dummy);

  dummy.updateMatrix();

  mesh.setMatrixAt(counter, dummy.matrix);
  counter++;

  return counter;
}

/**
 * Generate pit
 *
 * @param   {Number}    width      Pit width
 * @param   {height}    height     Pit height
 * @param   {Number}    depth      Pit depth
 * @param   {Number}    color      Grid color
 * @param   {Array}     pitParts   Pit parts
 * @param   {Boolean}   simple     Simple view
 *
 * @return  {Object}               Group object
 */
export function generatePit(
  width = 5,
  height = 5,
  depth = 12,
  size = 1,
  color = 0x808080,
  pitParts = [],
  simple = false,
  isInstanced = false
) {
  const pit = new Group();
  pit.userData.name = "Pit";

  // for (const part of pitParts) {
  //   if (!part.isObject3D) {
  //     suzanne = part;
  //     continue;
  //   }

  //   if (Array.isArray(part.material)) {
  //     part.material.forEach((item, index) => {
  //       if (item.isMeshPhongMaterial) {
  //         part.material[index] = new MeshBasicMaterial({ color: item.color });
  //       }
  //     });
  //   } else if (part.material.isMeshPhongMaterial) {
  //     part.material = new MeshBasicMaterial({ color: part.material.color });
  //   }
  // }

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
    const groundCount = width * height + 2 * width * depth + 2 * height * depth;
    const grassCount =
      (width + 20) * (height + 20) -
      width * height -
      width * 2 -
      height * 2 -
      4;

    console.log("Ground", groundCount);
    console.log("Grass", grassCount);
    console.log("Ground and grass", groundGrassCount);

    let groundCounter = 0;
    let grassCounter = 0;
    let groundAndGrassCounter = 0;

    const grassMesh = getMesh(grassPart, grassCount);
    const groundMesh = getMesh(groundPart, groundCount);
    const groundAndGrassMesh = getMesh(groundAndGrassPart, groundGrassCount);

    grassMesh.name = "grass";
    groundMesh.name = "ground";
    groundAndGrassMesh.name = "groundAndGrass";

    if (isInstanced) {
      pitGroup.add(grassMesh);
      pitGroup.add(groundMesh);
      pitGroup.add(groundAndGrassMesh);
    }

    // Generate bottom
    for (let x = -hWidth + hSize; x < hWidth; x++) {
      for (let y = -hHeight + hSize; y < hHeight; y++) {
        xArr.push(x);
        yArr.push(y);

        if (isInstanced) {
          groundCounter = updateInstancedMesh(
            groundMesh,
            dummy,
            groundCounter,
            x,
            y,
            -depth - size
          );
        } else {
          const mesh = groundPart.clone();
          mesh.frustumCulled = false;

          mesh.position.set(x, y, -depth - size);

          randomRotate(mesh);
          randomRotate(mesh);

          pitGroup.add(mesh);
          pitGroup.add(new BoxHelper(mesh, color));
        }
      }
    }

    // Generate top and bottom walls
    for (let x = -hWidth + hSize; x < hWidth; x++) {
      for (let z = -depth; z < 0; z++) {
        if (isInstanced) {
          groundCounter = updateInstancedMesh(
            groundMesh,
            dummy,
            groundCounter,
            x,
            -hHeight - hSize,
            z
          );
        } else {
          const mesh = groundPart.clone();
          mesh.frustumCulled = false;

          mesh.position.set(x, -hHeight - hSize, z);

          randomRotate(mesh);
          randomRotate(mesh);

          pitGroup.add(mesh);
          pitGroup.add(new BoxHelper(mesh, color));
        }

        if (isInstanced) {
          groundCounter = updateInstancedMesh(
            groundMesh,
            dummy,
            groundCounter,
            x,
            hHeight + hSize,
            z
          );
        } else {
          const mesh = groundPart.clone();
          mesh.frustumCulled = false;

          mesh.position.set(x, hHeight + hSize, z);

          randomRotate(mesh);
          randomRotate(mesh);

          pitGroup.add(mesh);
          pitGroup.add(new BoxHelper(mesh, color));
        }
      }
    }

    // Generate left and right walls
    for (let y = -hHeight + hSize; y < hHeight; y++) {
      for (let z = -depth; z < 0; z++) {
        if (isInstanced) {
          groundCounter = updateInstancedMesh(
            groundMesh,
            dummy,
            groundCounter,
            -hWidth - hSize,
            y,
            z
          );
        } else {
          const mesh = groundPart.clone();
          mesh.frustumCulled = false;

          mesh.position.set(-hWidth - hSize, y, z);

          randomRotate(mesh);
          randomRotate(mesh);

          pitGroup.add(mesh);
          pitGroup.add(new BoxHelper(mesh, color));
        }

        if (isInstanced) {
          groundCounter = updateInstancedMesh(
            groundMesh,
            dummy,
            groundCounter,
            hWidth + hSize,
            y,
            z
          );
        } else {
          const mesh = groundPart.clone();
          mesh.frustumCulled = false;

          mesh.position.set(hWidth + hSize, y, z);

          randomRotate(mesh);
          randomRotate(mesh);

          pitGroup.add(mesh);
          pitGroup.add(new BoxHelper(mesh, color));
        }
      }
    }

    for (let x = -hWidth + hSize - 10; x < hWidth + 10; x++) {
      for (let y = -hHeight + hSize - 10; y < hHeight + 10; y++) {
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
          if (isInstanced) {
            groundAndGrassCounter = updateInstancedMesh(
              groundAndGrassMesh,
              dummy,
              groundAndGrassCounter,
              x,
              y,
              0
            );
          } else {
            const mesh = groundAndGrassPart.clone();
            mesh.frustumCulled = false;

            mesh.position.set(x, y, 0);

            randomRotate(mesh);
            randomRotate(mesh);

            pitGroup.add(mesh);
            pitGroup.add(new BoxHelper(mesh, color));
          }
        } else {
          if (isInstanced) {
            grassCounter = updateInstancedMesh(
              grassMesh,
              dummy,
              grassCounter,
              x,
              y,
              0
            );
          } else {
            const mesh = grassPart.clone();
            mesh.frustumCulled = false;

            mesh.position.set(x, y, 0);

            randomRotate(mesh);
            randomRotate(mesh);

            pitGroup.add(mesh);
            pitGroup.add(new BoxHelper(mesh, color));
          }
        }
      }
    }

    pit.add(pitGroup);
  }

  return pit;
}

export default generatePit;
