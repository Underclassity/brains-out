import { BoxGeometry, BoxHelper, Mesh, MeshBasicMaterial } from "three";

import log from "../../helpers/log.js";

/**
 * Init layer helper
 *
 * @param   {Number}  z  Layer index
 *
 * @return  {Boolean}    Result
 */
export function initLayer(z) {
  // log(`Init layer ${z}`);

  const { pitWidth, pitHeight } = this;

  this.layers[z] = [];
  this.layersElements[z] = new Array(pitWidth * pitHeight);
  this.layersHelpers[z] = new Array(pitWidth * pitHeight);

  for (let x = 0; x < pitWidth; x++) {
    this.layers[z][x] = [];
    this.layersHelpers[z][x] = [];

    for (let y = 0; y < pitHeight; y++) {
      this.setLayerPoint(x, y, z, 0);
      // this.layers[z][x][y] = 0;
    }
  }

  return true;
}

/**
 * Init layers objects and arrays
 *
 * @return  {Boolean}  Result
 */
export function initLayers() {
  log("Init layers");

  const { pitWidth, pitHeight, pitDepth } = this;

  log(`Init layers: ${pitDepth}-${pitWidth}-${pitHeight}`);

  this.layers = [];
  this.layersElements = [];
  this.layersHelpers = [];

  for (let z = 0; z < pitDepth; z++) {
    this.initLayer(z);
  }

  return true;
}

/**
 * Set layer point helper
 *
 * @param   {Number}   x           X layer position
 * @param   {Number}   y           Y layer position
 * @param   {Number}   z           Z layer position
 * @param   {Number}   [value=1]   Value
 *
 * @return  {Array}                Array with layers
 */
export function setLayerPoint(x, y, z, value = 1) {
  // log(`Set layer point ${x}-${y}-${z}`);

  // const allPointElements = this.layersElements
  //   .reduce((prev, curr) => {
  //     prev.push(...curr);
  //     return prev;
  //   }, [])
  //   .filter((item) => item)
  //   .map((item) => item.position)
  //   .map((item) => `${item.x}-${item.y}-${item.z}`);

  // if (allPointElements.length) {
  //   const inElements = allPointElements.includes(`${x}-${y}-${z}`);

  //   if (inElements) {
  //     debugger;
  //   }
  // }

  // Check for equal value
  if (this.layers[z][x][y] == value) {
    this.error = `Layer ${x}/${y}/${z} value equal ${value}!`;
    throw new Error(this.error);
  }

  this.layers[z][x][y] = value;

  try {
    if (value && this.layersHelpers[z][x][y] === undefined) {
      const geometry = new BoxGeometry(this.size, this.size);
      const material = new MeshBasicMaterial();
      const boxMesh = new Mesh(geometry, material);

      boxMesh.position.set(
        this.xCPoints[x],
        this.yCPoints[y],
        this.zCPoints[z]
      );
      boxMesh.visible = false;

      const levelHelper = new BoxHelper(boxMesh);

      this.scene.add(levelHelper);

      levelHelper.visible = this.isLevelHelpers;

      // Save helper
      this.layersHelpers[z][x][y] = levelHelper;
    } else if (value) {
      console.log(value, this.layersHelpers[z][x][y]);
    }
  } catch (error) {
    console.error(error);
    debugger;
  }

  // log(this.layers[z].map((xLayer) => xLayer.join("-")).join("\n"));

  // log(
  //   this.layers
  //     .map((layer) => {
  //       return layer.map((xLayer) => xLayer.join("-")).join("\n");
  //     })
  //     .join("\n" + new Array(pitWidth).join("-") + "\n")
  // );

  return this.layers;
}

export default initLayers;
