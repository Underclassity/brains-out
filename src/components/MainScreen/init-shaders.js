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

import log from "../../helpers/log.js";

/**
 * Init shaders on scene
 *
 * @param   {Number}  width   Width
 * @param   {Number}  height  Height
 *
 * @return  {Boolean}         Result
 */
export function initShaders(width, height) {
  log(`Init shaders: ${width}x${height}`);

  const composer = new EffectComposer(this.renderer);
  composer.setPixelRatio(this.pixelRatio);
  composer.setSize(width, height);
  this.composer = composer;

  const renderPass = new RenderPass(this.scene, this.camera);

  const glitchPass = new GlitchPass();
  glitchPass.enabled = this.isGlitch;
  this.glitchPass = glitchPass;

  const technicolorShaderPass = new ShaderPass(TechnicolorShader);
  technicolorShaderPass.enabled = this.isTechnicolor;
  this.technicolorShaderPass = technicolorShaderPass;

  const dotScreenPass = new DotScreenPass();
  dotScreenPass.enabled = this.isDotScreenPass;
  this.dotScreenPass = dotScreenPass;

  const SAOComposerPass = new SAOPass(this.scene, this.camera);
  SAOComposerPass.enabled = this.isSAOPass;
  this.SAOComposerPass = SAOComposerPass;

  const filmPass = new FilmPass();
  filmPass.enabled = this.isFilmPass;
  this.filmPass = filmPass;

  const SSAOComposerPass = new SSAOPass(this.scene, this.camera);
  SSAOComposerPass.enabled = this.isSSAOPass;
  this.SSAOComposerPass = SSAOComposerPass;

  const SSRComposerPass = new SSRPass({
    renderer: this.renderer,
    scene: this.scene,
    camera: this.camera,
    width,
    height,
  });
  SSRComposerPass.enabled = this.isSSRPass;
  this.SSRComposerPass = SSRComposerPass;

  const UnrealBloomComposerPass = new UnrealBloomPass();
  UnrealBloomComposerPass.enabled = this.isUnrealBloomPass;
  this.UnrealBloomComposerPass = UnrealBloomComposerPass;

  const outputPass = new OutputPass();

  composer.addPass(renderPass);

  composer.addPass(glitchPass);
  composer.addPass(technicolorShaderPass);
  composer.addPass(dotScreenPass);
  composer.addPass(SAOComposerPass);
  composer.addPass(filmPass);
  composer.addPass(SSAOComposerPass);
  composer.addPass(SSRComposerPass);
  composer.addPass(UnrealBloomComposerPass);

  composer.addPass(outputPass);

  return true;
}

export default initShaders;
