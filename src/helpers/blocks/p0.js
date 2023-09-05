import { Group } from "three";

import generateMeshPoint from "../generate-mesh-point.js";
import getGroupSize from "../get-group-size.js";

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

  const mesh = generateMeshPoint(size, parts, isSimple);

  const childsGroup = new Group();
  childsGroup.name = "childs";

  childsGroup.add(mesh);
  pointGroup.add(childsGroup);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateP0Form;
