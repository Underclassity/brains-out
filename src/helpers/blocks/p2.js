import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateBodyMeshPoint from "../generate-body-mesh-point.js";
import generateHeadMeshPoint from "../generate-head-mesh-point.js";
import generateLegsMeshPoint from "../generate-legs-mesh-point.js";

/**
 * Generate P2 form (block_images/p2.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP2Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P2 form");

  const pointGroup = new Group();

  pointGroup.name = "P2";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateHeadMeshPoint(size, parts, isSimple, false, [
    // Normal ids
    "Z_01_Head1",
    "Z_01_Head2",
    // Dev ids
    "Z_01_HeadI",
    "Z_01_HeadN",
    // Ghost ids
    "H_02_Head2",
    // Halloween
    "H_01_Head1",
  ]);
  const secondMesh = generateBodyMeshPoint(size, parts, isSimple, false, [
    // Normal ids
    "Z_01_Body1",
    "Z_01_Body2",
    // Dev ids
    "Z_01_BodyI",
    "Z_01_BodyN",
    // Ghost ids
    "H_02_Body2",
  ]);
  const thirdMesh = generateLegsMeshPoint(size, parts, isSimple, false, [
    // Normal ids
    "Z_01_Legs1",
    // Dev ids
    "Z_01_LegsI",
    "Z_01_LegsN",
    // Ghost ids
    "H_02_Legs2",
  ]);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "y", size);

  positionHelper(thirdMesh, "y", -size);

  pointGroup.userData.size = new Vector3(1, 3, 1);

  return pointGroup;
}

export default generateP2Form;
