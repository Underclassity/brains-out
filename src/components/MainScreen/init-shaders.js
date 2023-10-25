import {
  EffectComposer,
  EffectPass,
  RenderPass,
  // BlendFunction,
  EdgeDetectionMode,
  PredicationMode,
  SMAAEffect,
  SMAAPreset,
  // TextureEffect,
} from "postprocessing";

import log from "../../helpers/log.js";

/**
 * Init shaders on scene
 *
 * @param   {Number}  width     Width
 * @param   {Number}  height    Height
 * @param   {Object}  renderer  Renderer
 * @param   {Object}  scene     Scene
 * @param   {Object}  camera    Camera
 *
 * @return  {Object}            Composer
 */
export function initShaders(width, height, renderer, scene, camera) {
  log(`Init shaders: ${width}x${height}`);

  const context = renderer.getContext();

  const composer = new EffectComposer(renderer);
  // composer.setPixelRatio(this.pixelRatio);
  composer.setSize(width, height);
  composer.multisampling = Math.min(4, context.MAX_SAMPLES);

  const renderPass = new RenderPass(scene, camera);

  const smaaEffect = new SMAAEffect({
    preset: SMAAPreset.ULTRA,
    edgeDetectionMode: EdgeDetectionMode.DEPTH,
    predicationMode: PredicationMode.DEPTH,
  });

  // smaaEffect.edgeDetectionMaterial.setEdgeDetectionThreshold(0.02);
  // smaaEffect.edgeDetectionMaterial.setPredicationMode(PredicationMode.DEPTH);
  // smaaEffect.edgeDetectionMaterial.setPredicationThreshold(0.002);
  // smaaEffect.edgeDetectionMaterial.setPredicationScale(1.0);

  // const edgesTextureEffect = new TextureEffect({
  //   blendFunction: BlendFunction.SKIP,
  //   texture: smaaEffect.renderTargetEdges.texture,
  // });

  // const weightsTextureEffect = new TextureEffect({
  //   blendFunction: BlendFunction.SKIP,
  //   texture: smaaEffect.renderTargetWeights.texture,
  // });

  const effectPass = new EffectPass(
    camera,
    smaaEffect,
    // edgesTextureEffect,
    // weightsTextureEffect
  );
  effectPass.renderToScreen = true;

  composer.addPass(renderPass);
  composer.addPass(effectPass);

  return composer;
}

export default initShaders;
