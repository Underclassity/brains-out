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

  for (let x = 0; x < pitWidth; x++) {
    this.layers[z][x] = [];

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

  for (let z = 0; z < pitDepth; z++) {
    this.initLayer(z);
  }

  return true;
}

export default initLayers;
