import {
  BoxGeometry,
  Group,
  LineSegments,
  Mesh,
  MeshNormalMaterial,
  WireframeGeometry,
} from "three";

/**
 * Generate mesh point
 *
 * @param   {Number}   size  Point size
 * @param   {Boolean}  line  Render lines flag
 *
 * @return  {Object}         Group object
 */
export function generateMeshPoint(size = 0.2, line = true) {
  if (!size) {
    console.log("Size not defined!");
    return false;
  }

  const geometry = new BoxGeometry(size, size, size);
  const material = new MeshNormalMaterial();

  const mesh = new Mesh(geometry, material);

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
