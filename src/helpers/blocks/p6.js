import { Group, MathUtils, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateBodyMeshPoint from "../generate-body-mesh-point.js";
import generateHeadMeshPoint from "../generate-head-mesh-point.js";
import generateLegsMeshPoint from "../generate-legs-mesh-point.js";

/**
 * Generate P6 form (block_images/p6.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP6Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P6 form");

  const pointGroup = new Group();

  pointGroup.name = "P6";

  const firstMesh = generateLegsMeshPoint(
    size,
    parts,
    isSimple,
    false,
    "Z_01_Legs1"
  );
  const secondMesh = generateBodyMeshPoint(
    size,
    parts,
    isSimple,
    false,
    "Z_01_Body3_2"
  );
  const thirdMesh = generateHeadMeshPoint(size, parts, isSimple, false, [
    "Z_01_Head1",
    "Z_01_Head2",
    "H_01_Head1",
  ]);
  const fourthMesh = generateBodyMeshPoint(
    size,
    parts,
    isSimple,
    false,
    "Z_01_Body3_1"
  );

  const childsGroup = new Group();
  childsGroup.name = "childs";

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", -size / 2);

  positionHelper(secondMesh, "x", -size / 2);
  positionHelper(secondMesh, "y", size / 2);

  positionHelper(thirdMesh, "x", size / 2);
  positionHelper(thirdMesh, "y", -size / 2);

  positionHelper(fourthMesh, "x", size / 2);
  positionHelper(fourthMesh, "y", size / 2);

  secondMesh.rotation.set(
    MathUtils.degToRad(-180),
    MathUtils.degToRad(90),
    MathUtils.degToRad(180)
  );
  fourthMesh.rotation.set(MathUtils.degToRad(90), 0, MathUtils.degToRad(-90));
  thirdMesh.rotation.set(MathUtils.degToRad(-90), MathUtils.degToRad(-180), 0);

  pointGroup.userData.size = new Vector3(2, 2, 1);

  return pointGroup;
}

export default generateP6Form;
