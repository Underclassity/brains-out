import {
  BoxGeometry,
  Group,
  LineSegments,
  Mesh,
  MeshNormalMaterial,
  WireframeGeometry,
} from "three";

import randomBetween from "./random-between.js";

/**
 * Generate mesh point
 *
 * @param   {Number}   [size=0.2]     Point size
 * @param   {Array}    [parts=[]]     Parts array
 * @param   {Boolean}  [line=false]   Render lines flag
 *
 * @return  {Object}                  Group object
 */
export function generateMeshPoint(size = 0.2, parts = [], line = false) {
  if (!size) {
    console.log("Size not defined!");
    return false;
  }

  let mesh;

  if (Array.isArray(parts) && parts.length) {
    mesh = parts[randomBetween(0, parts.length - 1)].clone();
    mesh.scale.set(1, 1, 1);
  } else {
    const geometry = new BoxGeometry(size, size, size);
    const material = new MeshNormalMaterial();

    mesh = new Mesh(geometry, material);
  }

  if (!line) {
    return mesh;
  }

  const group = new Group();

  const wireframe = new WireframeGeometry(mesh.geometry);
  const lineFrame = new LineSegments(wireframe);
  lineFrame.material.depthTest = false;
  lineFrame.material.opacity = 0.25;
  lineFrame.material.transparent = true;

  group.add(mesh);
  group.add(lineFrame);

  return group;
}

export default generateMeshPoint;
