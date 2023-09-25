import {
  BoxGeometry,
  BoxHelper,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
} from "three";

import log from "../../helpers/log.js";

const hideOpacity = 0.2;

/**
 * Init pit levels preview
 *
 * @return  {Boolean}  Result
 */
export function initLevelPreview() {
  const { pitDepth, pitWidth, size } = this;

  if (this.pitLevels) {
    this.scene.remove(this.pitLevels);
    if (this.pitLevels.dispose) {
      this.pitLevels.dispose();
    }
    this.pitLevels = undefined;
  }

  this.pitLevels = new Group();
  this.pitLevels.scale.set(0.5, 0.5, 0.5);

  this.pitLevels.position.set(-pitWidth / 2 - 1, 0, 1);

  const gridColor = new Color(this.gridColor);

  for (let i = 0; i < pitDepth; i++) {
    const color = new Color(this.colorPalette[i]);

    const boxMaterial = new MeshBasicMaterial({ color, transparent: true });
    const boxGeometry = new BoxGeometry(1, 1);

    const boxMesh = new Mesh(boxGeometry, boxMaterial);

    boxMesh.position.set(0, -i - size / 2 + pitDepth / 2, 0);

    // Hide all
    // boxMesh.visible = false;
    boxMesh.material.opacity = hideOpacity;

    // Save level for process
    boxMesh.name = "level";
    boxMesh.userData.level = i;

    this.pitLevels.add(boxMesh);
    this.pitLevels.add(new BoxHelper(boxMesh, gridColor));
  }

  this.scene.add(this.pitLevels);

  return true;
}

/**
 * Update pit levels preview
 *
 * @return  {Boolean}  Result
 */
export function updateLayersPreview() {
  log("Update layers preview");

  const { layers, pitLevels } = this;

  const meshes = pitLevels.children.filter((item) => item.name == "level");

  for (const [index, zLayer] of layers.entries()) {
    const layerValues = zLayer.reduce((prev, current) => {
      prev.push(...current);

      return prev;
    }, []);

    const layerElements = this.layersElements[index].filter((item) => item);

    if (layerValues.includes(1) != layerElements.length > 0) {
      this.error = `Layer values ${index} not equal to layer elements!`;
      throw new Error(this.error);
    }

    const mesh = meshes.find((item) => item.userData.level == index);

    // mesh.visible = layerValues.includes(1) ? true : false;
    mesh.material.opacity = layerValues.includes(1) ? 1 : hideOpacity;
  }

  return true;
}

export function isLayerVisible(index) {
  const { layers } = this;

  if (!layers[index]) {
    return false;
  }

  const layerValues = layers[index].reduce((prev, current) => {
    prev.push(...current);

    return prev;
  }, []);

  return layerValues.includes(1) ? true : false;
}

export function getLayerColor(index) {
  const { colorPalette } = this;

  const isVisible = this.isLayerVisible(index);

  if (isVisible) {
    return `background-color: #${colorPalette[index].getHexString()}`;
  }

  return "background-color: unset";
}

export default initLevelPreview;
