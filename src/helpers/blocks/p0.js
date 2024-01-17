import { Group, Vector3 } from "three";

import generateMeshPoint from "../generate-mesh-point.js";

/**
 * Generate P0 form (block_images/p0.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP0Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P0 form");

  const pointGroup = new Group();

  pointGroup.name = "P0";

  const mesh = generateMeshPoint(size, parts, isSimple, false, [
    "Z_01_Head1",
    "Z_01_Head2",
    "Z_01_Brains1",
    "Z_01_Guts1",
  ]);

  const childsGroup = new Group();
  childsGroup.name = "childs";

  childsGroup.add(mesh);
  pointGroup.add(childsGroup);

  pointGroup.userData.size = new Vector3(1, 1, 1);

  return pointGroup;
}

export default generateP0Form;
