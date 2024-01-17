import { Group, MathUtils, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateBodyMeshPoint from "../generate-body-mesh-point.js";
import generateBrainsMeshPoint from "../generate-brains-mesh-point.js";
import generateHeadMeshPoint from "../generate-head-mesh-point.js";
import generateLegsMeshPoint from "../generate-legs-mesh-point.js";

/**
 * Generate P9 form (block_images/p9.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP9Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P9 form");

  const pointGroup = new Group();

  pointGroup.name = "P9";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateHeadMeshPoint(
    size,
    parts,
    isSimple,
    false,
    "Z_01_Head2"
  );
  const secondMesh = generateBodyMeshPoint(size, parts, isSimple, false, [
    "Z_01_Body1",
    "Z_01_Body2",
  ]);
  const thirdMesh = generateLegsMeshPoint(
    size,
    parts,
    isSimple,
    false,
    "Z_01_Legs1"
  );
  const fourthPoint = generateBrainsMeshPoint(
    size,
    parts,
    isSimple,
    false,
    "Z_01_Brains1"
  );

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthPoint);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size);
  positionHelper(firstMesh, "y", size / 2);

  positionHelper(secondMesh, "y", size / 2);

  positionHelper(thirdMesh, "x", size);
  positionHelper(thirdMesh, "y", size / 2);

  positionHelper(fourthPoint, "x", -size);
  positionHelper(fourthPoint, "y", -size / 2);

  firstMesh.rotation.set(MathUtils.degToRad(-90), MathUtils.degToRad(-90), 0);
  secondMesh.rotation.set(MathUtils.degToRad(-90), MathUtils.degToRad(-90), 0);
  thirdMesh.rotation.set(MathUtils.degToRad(-90), MathUtils.degToRad(-90), 0);

  pointGroup.userData.size = new Vector3(3, 2, 1);

  return pointGroup;
}

export default generateP9Form;
