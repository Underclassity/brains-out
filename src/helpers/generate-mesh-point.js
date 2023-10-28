import {
  BoxGeometry,
  Group,
  LineSegments,
  Mesh,
  MeshNormalMaterial,
  WireframeGeometry,
  Vector3,
} from "three";

import log from "./log.js";
import randomBetween from "./random-between.js";

/**
 * Generate mesh point
 *
 * @param   {Number}   [size=0.2]         Point size
 * @param   {Array}    [parts=[]]         Parts array
 * @param   {Boolean}  [isSimple=false]   Render simple block flag
 * @param   {Boolean}  [line=false]       Render lines flag
 *
 * @return  {Object}                      Group objects
 */
export function generateMeshPoint(
  size = 0.2,
  parts = [],
  isSimple = false,
  line = false
) {
  if (!size) {
    log("Size not defined!");
    return false;
  }

  let mesh;

  if (Array.isArray(parts) && parts.length && !isSimple) {
    const part = parts[randomBetween(0, parts.length - 1)];
    mesh = part.clone();
    mesh.material = Array.isArray(part.material)
      ? // ? part.material.map((item) => {
        //     return item.name.includes("Emissive") ? item : item.clone();
        //   })
        part.material.map((item) => item.clone())
      : // part.material.map((item) => new MeshBasicMaterial().copy(item))
        // : new MeshBasicMaterial().copy(part.material);
        part.material.clone();
    mesh.scale.set(1, 1, 1);
    mesh.position.set(0, 0, 0);
  } else {
    const geometry = new BoxGeometry(size, size, size);
    const material = new MeshNormalMaterial();

    mesh = new Mesh(geometry, material);
    mesh.name = "point";
  }

  mesh.userData.size = new Vector3(1, 1, 1);

  if (!line && !isSimple) {
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

  group.userData.size = new Vector3(1, 1, 1);

  return group;
}

export default generateMeshPoint;
