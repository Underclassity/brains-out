import { AmbientLight, PointLightHelper, PointLight, Color } from "three";

// import loadLights from "../../helpers/lights.js";

/**
 * Init scene lights
 *
 * @return  {Boolean}  Result
 */
export async function initLights() {
  const { scene, camera, pitWidth } = this;

  // const gltf = await loadLights(this.progressCb);

  const light = new AmbientLight(0xff_ff_ff, 0.02);
  scene.add(light);

  const cameraLight = new AmbientLight(0xff_ff_ff, 0.08);
  camera.add(cameraLight);

  // if (!gltf) {
  //   const light = new AmbientLight(this.lightColor);
  //   scene.add(light);
  //   return false;
  // }

  // const lights = gltf.scene.children;

  const firstColor = new Color(0xffb07e);
  const secondColor = new Color(0xff0000);

  const l1 = new PointLight(firstColor);
  const l2 = new PointLight(firstColor);
  const l3 = new PointLight(secondColor);

  // const l1 = lights[0].clone();
  // const l2 = lights[1].clone();
  // const l3 = lights[2].clone();

  l1.position.set(-pitWidth / 2, 0, 7);
  l2.position.set(pitWidth / 2, 0, 7);
  l3.position.set(0, 0, 7);

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
