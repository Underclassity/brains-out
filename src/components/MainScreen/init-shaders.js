import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { SAOPass } from "three/addons/postprocessing/SAOPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { SSRPass } from "three/addons/postprocessing/SSRPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import { TechnicolorShader } from "three/addons/shaders/TechnicolorShader.js";

/**
 * Init shaders on scene
 *
 * @param   {Number}  width   Width
 * @param   {Number}  height  Height
 *
 * @return  {Boolean}         Result
 */
export function initShaders(width, height) {
  const { renderer, scene, camera } = this;

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(this.pixelRatio);
  composer.setSize(width, height);
  this.composer = composer;

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const glitchPass = new GlitchPass();
  glitchPass.enabled = this.isGlitch;
  composer.addPass(glitchPass);
  this.glitchPass = glitchPass;

  const technicolorShaderPass = new ShaderPass(TechnicolorShader);
  technicolorShaderPass.enabled = this.isTechnicolor;
  composer.addPass(technicolorShaderPass);
  this.technicolorShaderPass = technicolorShaderPass;

  const dotScreenPass = new DotScreenPass();
  dotScreenPass.enabled = this.isDotScreenPass;
  composer.addPass(dotScreenPass);
  this.dotScreenPass = dotScreenPass;

  const SAOComposerPass = new SAOPass(scene, camera);
  SAOComposerPass.enabled = this.isSAOPass;
  composer.addPass(SAOComposerPass);
  this.SAOComposerPass = SAOComposerPass;

  const filmPass = new FilmPass();
  filmPass.enabled = this.isFilmPass;
  composer.addPass(filmPass);
  this.filmPass = filmPass;

  const SSAOComposerPass = new SSAOPass(scene, camera);
  SSAOComposerPass.enabled = this.isSSAOPass;
  composer.addPass(SSAOComposerPass);
  this.SSAOComposerPass = SSAOComposerPass;

  const SSRComposerPass = new SSRPass({
    renderer,
    scene,
    camera,
    width,
    height,
  });
  SSRComposerPass.enabled = this.isSSRPass;
  composer.addPass(SSRComposerPass);
  this.SSRComposerPass = SSRComposerPass;

  const UnrealBloomComposerPass = new UnrealBloomPass();
  UnrealBloomComposerPass.enabled = this.isUnrealBloomPass;
  composer.addPass(UnrealBloomComposerPass);
  this.UnrealBloomComposerPass = UnrealBloomComposerPass;

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return true;
}

export default initShaders;
