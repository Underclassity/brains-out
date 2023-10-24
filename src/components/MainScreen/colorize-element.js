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
      obj.material.forEach((material, index, array) => {
        if (this.isOldColorize) {
          array[index] = new MeshBasicMaterial({ color });
          return;
        }

        material.color.set(color);
        material.needsUpdate = true;
      });

      return false;
    }

    if (this.isOldColorize) {
      obj.material = new MeshBasicMaterial({ color });
      return;
    }

    obj.material.color.set(color);
    obj.material.needsUpdate = true;
  });

  return true;
}

export default colorizeElement;
