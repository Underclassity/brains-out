import { BoxGeometry, BoxHelper, Mesh, MeshBasicMaterial } from "three";

import log from "../../helpers/log.js";

/**
 * Init layer helper
 *
 * @param   {Number}   z                    Layer index
 * @param   {Boolean}  [withElements=true]  Reset with elements
 *
 * @return  {Boolean}    Result
 */
export function initLayer(z, withElements = true) {
  // log(`Init layer ${z}`);

  const { pitWidth, pitHeight } = this;

  this.layers[z] = [];

  if (withElements) {
    this.layersElements[z] = [];
  }

  for (let x = 0; x < pitWidth; x++) {
    this.layers[z][x] = [];

    for (let y = 0; y < pitHeight; y++) {
      this.setLayerPoint(x, y, z, 0, false);
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

  const {
    pitWidth,
    pitHeight,
    pitDepth,

    size,
    scene,

    xCPoints,
    yCPoints,
    zCPoints,
  } = this;

  log(`Init layers: ${pitDepth}-${pitWidth}-${pitHeight}`);

  // Delete helpers for layer
  for (const id in this.layersHelpers) {
    scene.remove(this.layersHelpers[id]);
  }

  this.layers = [];
  this.layersElements = [];
  this.layersHelpers = {};

  new Array(pitDepth).fill(0).forEach((zValue, zIndex) => {
    new Array(pitWidth).fill(0).forEach((xValue, xIndex) => {
      new Array(pitHeight).fill(0).forEach((yValue, yIndex) => {
        const geometry = new BoxGeometry(size, size);
        const material = new MeshBasicMaterial();
        const boxMesh = new Mesh(geometry, material);

        boxMesh.position.set(
          xCPoints[xIndex],
          yCPoints[yIndex],
          zCPoints[zIndex]
        );
        boxMesh.visible = false;

        const levelHelper = new BoxHelper(boxMesh);

        levelHelper.userData.layer = {
          x: xIndex,
          y: yIndex,
          z: zIndex,
        };

        scene.add(levelHelper);

        levelHelper.visible = false;

        // Save helper
        this.layersHelpers[`${zIndex}-${xIndex}-${yIndex}`] = levelHelper;
      });
    });
  });

  for (let z = 0; z < pitDepth; z++) {
    this.initLayer(z);
  }

  return true;
}

/**
 * Set layer point helper
 *
 * @param   {Number}    x                   X layer position
 * @param   {Number}    y                   Y layer position
 * @param   {Number}    z                   Z layer position
 * @param   {Number}    [value=1]           Value
 * @param   {Boolean}   [updateView=true]   Update view flag
 *
 * @return  {Array}                Array with layers
 */
export function setLayerPoint(x, y, z, value = 1, updateView = true) {
  // log(`Set layer point ${x}-${y}-${z}: ${value}`);

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
  if (this.layers[z][x][y] == value && value == 1) {
    this.error = `Layer ${x}/${y}/${z} value equal ${value}!`;
    throw new Error(this.error);
  }

  this.layers[z][x][y] = value;

  if (updateView) {
    this.updateLayersView();
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

/**
 * Update layers preview
 *
 * @return  {Boolean}  Result
 */
export function updateLayersView() {
  log("Update layers view");

  const { isLevelHelpers } = this;

  for (const id in this.layersHelpers) {
    const helper = this.layersHelpers[id];

    const [z, x, y] = id.split("-");

    const value = this.layers[z][x][y];

    helper.visible = value && isLevelHelpers ? true : false;
  }

  return true;
}

export default initLayers;
