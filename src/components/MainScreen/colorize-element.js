import { MeshBasicMaterial } from "three";

const materialCache = {};

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

  if (this.isSimple) {
    return false;
  }

  const color = this.colorPalette[layer];

  this.log(
    `Colorize element ${
      element.name
    } on layer ${layer}: color #${color.getHexString()}`
  );

  const colorize = (material, index = 0) => {
    if (material) {
      if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
      } else {
        material.dispose();
      }
    }

    let atlas = this.greyAtlas;
    let atlasName = "grey";

    switch (material.name) {
      case "M_Brains":
        atlas = this.greyBrains;
        atlasName = "brains";
        break;
      case "M_Guts":
        atlas = this.greyGuts;
        atlasName = "guts";
        break;
      default:
        atlas = this.greyAtlas;
        atlasName = "grey";
        break;
    }

    const materialName = this.isOldColorize
      ? `color-old-${color.getHexString()}`
      : `color-${atlasName}-${color.getHexString()}`;

    // Take material from cache if exists
    if (materialCache[materialName]) {
      // this.log(
      //   `Take from cache ${Object.keys(materialCache).length}: ${materialName}`
      // );

      material = materialCache[materialName];
      material.needsUpdate = true;
      return material;
    }

    if (this.isOldColorize) {
      material = new MeshBasicMaterial({ color });
      material.name = materialName;
      material.needsUpdate = true;

      // Save old colorize material in cache
      materialCache[materialName] = material;

      return material;
    }

    material = new MeshBasicMaterial({ color, map: atlas });
    material.name = materialName;
    material.needsUpdate = true;

    // Save new colorize material in cache
    materialCache[materialName] = material;

    return material;

    // material.color.set(color);

    // if (atlas) {
    //   material.map = atlas;
    // }

    // material.name = `color-${color.getHexString()}-${index}`;
    // material.needsUpdate = true;

    // return material;
  };

  element.material = colorize(element.material);

  // element.traverse((obj) => {
  //   if (!obj.isMesh) {
  //     return false;
  //   }

  //   if (Array.isArray(obj.material)) {
  //     obj.material = obj.material.map(colorize);

  //     return false;
  //   }

  //   obj.material = colorize(obj.material);
  // });

  return true;
}

export default colorizeElement;
