import generateFourPoints from "../../helpers/generate-four-points.js";
import generateLForm from "../../helpers/generate-l-form.js";
import generateOnePoint from "../../helpers/generate-one-point.js";
import generateSForm from "../../helpers/generate-s-form.js";
import generateTForm from "../../helpers/generate-t-form.js";
import generateThreePoints from "../../helpers/generate-three-points.js";
import generateThreePointsCurve from "../../helpers/generate-three-points-curve.js";
import generateTwoPoints from "../../helpers/generate-two-points.js";

/**
 * Init test mode
 *
 * @return  {Boolean}  Result
 */
export function initTest() {
  console.log("Init test");

  const { scene, size } = this;

  const onePoint = generateOnePoint(size);
  const twoPoints = generateTwoPoints(size);
  const threePoints = generateThreePoints(size);
  const fourPoints = generateFourPoints(size);
  const lForm = generateLForm(size);
  const tForm = generateTForm(size);
  const sForm = generateSForm(size);
  const threePointsCurve = generateThreePointsCurve(size);

  // Set Test name
  [
    onePoint,
    twoPoints,
    threePoints,
    fourPoints,
    lForm,
    tForm,
    sForm,
    threePointsCurve,
  ].forEach((group) => (group.userData.name = "Test"));

  const zPosition = -2;

  onePoint.position.set(0, 0, zPosition);
  twoPoints.position.set(-2, 0, zPosition);
  threePoints.position.set(2, 0, zPosition);

  fourPoints.position.set(2, 2, zPosition);
  lForm.position.set(0, 2, zPosition);
  tForm.position.set(-2, 2, zPosition);

  sForm.position.set(-2, -2, zPosition);
  threePointsCurve.position.set(0, -2, zPosition);

  scene.add(onePoint);
  scene.add(twoPoints);
  scene.add(threePoints);
  scene.add(fourPoints);
  scene.add(lForm);
  scene.add(tForm);
  scene.add(sForm);
  scene.add(threePointsCurve);

  this.loopCb.push((delta, timeDelta) => {
    // Rotate test items
    scene.children
      .filter((item) => item.userData.name && item.userData.name == "Test")
      .forEach((group) => {
        group.rotation.x = timeDelta / 2;
        group.rotation.y = timeDelta / 1;
        group.rotation.z = timeDelta / 3;

        // if (changePosition) {
        //   group.position.setZ(-count);
        // }
      });
  });

  return true;
}

export default initTest;
