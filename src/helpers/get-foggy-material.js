import { MeshStandardMaterial, Color, Vector4, FrontSide } from "three";

/**
 * Get foggy material
 * @param {Number} [fogDepth=10]                Fog depth
 * @param {String} [fogColor=0xff_ff_ff]        Fog color
 * @param {String} [color=0x00_00_00]           Material color
 * @param {Object} [side=FrontSide]             Render side
 * @param {Vector4} [fogPlane=new Vector4()]    Plane vector
 *
 * @return  {Object}                            Foggy material
 */
export function getFoggyMaterial(
  fogDepth = 10,
  fogColor = 0xff_ff_ff,
  color = 0x00_00_00,
  side = FrontSide,
  fogPlane = new Vector4()
) {
  const material = new MeshStandardMaterial({
    color,
    side,
    metalness: 0.5,
    roughness: 0.75,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.fPlane = { value: fogPlane };
    shader.uniforms.fDepth = { value: fogDepth };
    shader.uniforms.fColor = { value: new Color(fogColor) };
    shader.fragmentShader =
      `
      uniform vec4 fPlane;
      uniform float fDepth;
      uniform vec3 fColor;
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <clipping_planes_fragment>`,
      `#include <clipping_planes_fragment>
      float planeFog = 0.0;
      planeFog = smoothstep(0.0, -fDepth, dot( vViewPosition, fPlane.xyz) - fPlane.w);
      `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <fog_fragment>`,
      `#include <fog_fragment>
       gl_FragColor.rgb = mix( gl_FragColor.rgb, fColor, planeFog );
      `
    );
  };

  return material;
}

export default getFoggyMaterial;
