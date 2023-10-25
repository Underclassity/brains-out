import { MeshBasicMaterial } from "three";

/**
 * Colorize element
 *
 * @param   {Object}  element  Element
 * @param   {Number}  layer    Layer index
 *
 * @return  {Boolean}          Result
 */
export function colorizeElement(element, layer) {
  if (!this.isColorizeLevel) {
    return false;
  }

  const color = this.colorPalette[layer];

  this.log(
    `Colorize element ${
      element.name
    } on layer ${layer}: ${color.getHexString()}`,
    `color: #${color.getHexString()}`
  );

  element.traverse((obj) => {
    if (!obj.isMesh) {
      return false;
    }

    if (Array.isArray(obj.material)) {
      obj.material.forEach((material) => {
        if (this.isOldColorize) {
          material = new MeshBasicMaterial({ color });
          return;
        }

        const atlas =
          material.name == "M_Brains" && this.greyBrains
            ? this.greyBrains
            : material.name == "M_Guts" && this.greyGuts
            ? this.greyGuts
            : this.greyAtlas;

        material.color.set(color);
        if (atlas) {
          material.map = atlas;
        }
        material.needsUpdate = true;
      });

      return false;
    }

    if (this.isOldColorize) {
      obj.material = new MeshBasicMaterial({ color });
      return;
    }

    const atlas =
      obj.material.name == "M_Brains" && this.greyBrains
        ? this.greyBrains
        : obj.material.name == "M_Guts" && this.greyGuts
        ? this.greyGuts
        : this.greyAtlas;

    obj.material.color.set(color);
    if (atlas) {
      obj.material.map = atlas;
    }
    obj.material.needsUpdate = true;
  });

  return true;
}

export default colorizeElement;
