import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export async function loadZombie() {
  console.log("Load Zombie model");

  return new Promise((resolve) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      "models/S_Zombie_1-2-3-4.fbx",
      (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        // object.scale.set(.01, .01, .01)

        object.traverse(function (child) {
          if (child.isMesh) {
            // const loader = new THREE.TextureLoader();

            // loader.load("/models/T_ColorAtlas16x16.png", (texture) => {
            //   child.material.map = texture;
            //   child.material.needsupdate = true;
            //   console.log(texture);
            //   // render(); // only if there is no render loop
            // });
            // console.log(child.geometry.attributes.uv);

            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        object.scale.set(0.01, 0.01, 0.01);

        console.log("Loaded zombie", object);

        resolve(object);
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.log(error);
        resolve();
      }
    );
  });
}

export default loadZombie;
