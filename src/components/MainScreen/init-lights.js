import { AmbientLight, PointLightHelper, PointLight, Color } from "three";

import log from "../../helpers/log.js";

/**
 * Init scene lights
 *
 * @param   {Boolean}  [force=false]  Force update
 *
 * @return  {Boolean}                 Result
 */
export async function initLights(force = false) {
  const {
    scene,
    camera,
    pitWidth,
    firstLightColor,
    secondLightColor,
    thirdLightColor,
    lightColor,
    lights,
  } = this;

  if (lights?.l1 && lights?.l2 && lights?.l3 && !force) {
    return false;
  }

  if (lights?.l1) {
    scene.remove(lights.l1);
  }

  if (lights?.l2) {
    scene.remove(lights.l2);
  }

  if (lights?.l3) {
    scene.remove(lights.l3);
  }

  log("Init lights: ", force);

  const light = new AmbientLight(lightColor, 0.02);
  scene.add(light);

  const cameraLight = new AmbientLight(lightColor, 0.08);
  camera.add(cameraLight);

  const firstColor = new Color(firstLightColor);
  const secondColor = new Color(secondLightColor);
  const thirdColor = new Color(thirdLightColor);

  const l1 = new PointLight(firstColor);
  const l2 = new PointLight(secondColor);
  const l3 = new PointLight(thirdColor);

  l1.position.set(-pitWidth / 2, 0, 5);
  l2.position.set(pitWidth / 2, 0, 5);
  l3.position.set(0, 0, 5);

  l1.power = this.lightPower;
  l2.power = this.lightPower;
  l3.power = 0;

  // Save lights for process
  this.lights.l1 = l1;
  this.lights.l2 = l2;
  this.lights.l3 = l3;

  // hide red light
  l3.visible = false;

  scene.add(l1);
  scene.add(l2);
  scene.add(l3);

  if (this.helpers) {
    const sphereSize = 1;

    let pointLightHelper = new PointLightHelper(l1, sphereSize);
    scene.add(pointLightHelper);

    pointLightHelper = new PointLightHelper(l2, sphereSize);
    scene.add(pointLightHelper);

    pointLightHelper = new PointLightHelper(l3, sphereSize);
    scene.add(pointLightHelper);
  }

  return true;
}

export default initLights;
