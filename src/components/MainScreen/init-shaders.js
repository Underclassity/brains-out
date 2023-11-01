import {
  BlendFunction,
  ChromaticAberrationEffect,
  EdgeDetectionMode,
  EffectComposer,
  EffectPass,
  GlitchEffect,
  NoiseEffect,
  PredicationMode,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";

import log from "../../helpers/log.js";

/**
 * Init shaders on scene
 *
 * @param   {Number}  width           Width
 * @param   {Number}  height          Height
 * @param   {Object}  renderer        Renderer
 * @param   {Object}  scene           Scene
 * @param   {Object}  camera          Camera
 * @param   {Object}  perturbation    Perturbation texture
 *
 * @return  {Object}                  Composer
 */
export function initShaders(
  width,
  height,
  renderer,
  scene,
  camera,
  perturbation
) {
  this.log(`Init shaders: ${width}x${height}`);

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

  const chromaticAberrationEffect = new ChromaticAberrationEffect();

  const glitchEffect = new GlitchEffect({
    perturbationMap: perturbation,
    chromaticAberrationOffset: chromaticAberrationEffect.offset,
  });

  // 0:DISABLED
  // 1:SPORADIC
  // 2:CONSTANT_MILD
  // 3:CONSTANT_WILD

  glitchEffect.mode = 3; // CONSTANT_MILD

  const noiseEffect = new NoiseEffect({
    blendFunction: BlendFunction.COLOR_DODGE,
  });

  noiseEffect.blendMode.opacity.value = 0.1;

  const smaaPass = new EffectPass(camera, smaaEffect);
  smaaPass.enabled = false;

  const glitchPass = new EffectPass(camera, glitchEffect, noiseEffect);
  glitchPass.enabled = false;

  const chromaticAberrationPass = new EffectPass(
    camera,
    chromaticAberrationEffect
  );
  chromaticAberrationPass.enabled = false;

  composer.addPass(renderPass);
  composer.addPass(smaaPass);
  composer.addPass(glitchPass);
  composer.addPass(chromaticAberrationPass);

  console.log(smaaPass);
  console.log(glitchPass);
  console.log(chromaticAberrationPass);

  return {
    composer,
    smaa: smaaPass,
    glitch: glitchPass,
    chroma: chromaticAberrationPass,
  };
}

export default initShaders;
