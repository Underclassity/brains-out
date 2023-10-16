// import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
// import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

// import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";
// import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
// import { SAOPass } from "three/addons/postprocessing/SAOPass.js";
// import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
// import { SSRPass } from "three/addons/postprocessing/SSRPass.js";
// import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// import { TechnicolorShader } from "three/addons/shaders/TechnicolorShader.js";

import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BlendFunction,
  CopyMaterial,
  EdgeDetectionMode,
  PredicationMode,
  ShaderPass,
  SMAAEffect,
  SMAAImageLoader,
  SMAAPreset,
  TextureEffect,
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
    edgeDetectionMode: EdgeDetectionMode.COLOR,
    predicationMode: PredicationMode.DEPTH,
  });

  smaaEffect.edgeDetectionMaterial.setEdgeDetectionThreshold(0.02);
  // smaaEffect.edgeDetectionMaterial.setPredicationMode(PredicationMode.DEPTH);
  smaaEffect.edgeDetectionMaterial.setPredicationThreshold(0.002);
  smaaEffect.edgeDetectionMaterial.setPredicationScale(1.0);

  const edgesTextureEffect = new TextureEffect({
    blendFunction: BlendFunction.SKIP,
    texture: smaaEffect.renderTargetEdges.texture,
  });

  const weightsTextureEffect = new TextureEffect({
    blendFunction: BlendFunction.SKIP,
    texture: smaaEffect.renderTargetWeights.texture,
  });

  const effectPass = new EffectPass(
    camera,
    smaaEffect,
    edgesTextureEffect,
    weightsTextureEffect
  );
  effectPass.renderToScreen = true;

  // const glitchPass = new GlitchPass();
  // glitchPass.enabled = this.isGlitch;
  // this.glitchPass = glitchPass;

  // const technicolorShaderPass = new ShaderPass(TechnicolorShader);
  // technicolorShaderPass.enabled = this.isTechnicolor;
  // this.technicolorShaderPass = technicolorShaderPass;

  // const dotScreenPass = new DotScreenPass();
  // dotScreenPass.enabled = this.isDotScreenPass;
  // this.dotScreenPass = dotScreenPass;

  // const SAOComposerPass = new SAOPass(scene, camera);
  // SAOComposerPass.enabled = this.isSAOPass;
  // this.SAOComposerPass = SAOComposerPass;

  // const filmPass = new FilmPass();
  // filmPass.enabled = this.isFilmPass;
  // this.filmPass = filmPass;

  // const SSAOComposerPass = new SSAOPass(scene, camera);
  // SSAOComposerPass.enabled = this.isSSAOPass;
  // this.SSAOComposerPass = SSAOComposerPass;

  // const SSRComposerPass = new SSRPass({
  //   renderer,
  //   scene,
  //   camera,
  //   width,
  //   height,
  // });
  // SSRComposerPass.enabled = this.isSSRPass;
  // this.SSRComposerPass = SSRComposerPass;

  // const UnrealBloomComposerPass = new UnrealBloomPass();
  // UnrealBloomComposerPass.enabled = this.isUnrealBloomPass;
  // this.UnrealBloomComposerPass = UnrealBloomComposerPass;

  // const outputPass = new OutputPass();

  composer.addPass(renderPass);
  composer.addPass(effectPass);

  // composer.addPass(glitchPass);
  // composer.addPass(technicolorShaderPass);
  // composer.addPass(dotScreenPass);
  // composer.addPass(SAOComposerPass);
  // composer.addPass(filmPass);
  // composer.addPass(SSAOComposerPass);
  // composer.addPass(SSRComposerPass);
  // composer.addPass(UnrealBloomComposerPass);

  // composer.addPass(outputPass);

  return composer;
}

export default initShaders;
