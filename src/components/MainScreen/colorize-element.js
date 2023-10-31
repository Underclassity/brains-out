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

    if (this.isOldColorize) {
      material = new MeshBasicMaterial({ color, map: atlas });
      material.name = `color-old-${color.getHexString()}`;
      material.needsUpdate = true;
      return material;
    }

    material.color.set(color);

    if (atlas) {
      material.map = atlas;
    }

    material.name = `color-${color.getHexString()}-${index}`;
    material.needsUpdate = true;

    return material;
  };

  element.traverse((obj) => {
    if (!obj.isMesh) {
      return false;
    }

    if (this.isOldColorize) {
      obj.material = colorize(obj.material);
      return true;
    }

    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map(colorize);

      return false;
    }

    obj.material = colorize(obj.material);
  });

  return true;
}

export default colorizeElement;
