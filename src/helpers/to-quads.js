/**
 * Transform group to quads
 *
 * @param   {Object}  g  Group object
 *
 * @return  {Object}     Quads
 */
export function ToQuads(g) {
  const p = g.parameters;

  const segmentsX = parseInt(
    (g.type == "TorusBufferGeometry" ? p.tubularSegments : p.radialSegments) ||
      p.widthSegments ||
      p.thetaSegments ||
      p.points.length - 1 ||
      1,
    10
  );

  const segmentsY = parseInt(
    (g.type == "TorusBufferGeometry" ? p.radialSegments : p.tubularSegments) ||
      p.heightSegments ||
      p.phiSegments ||
      p.segments ||
      1,
    10
  );

  const indices = [];

  for (let i = 0; i < segmentsY + 1; i++) {
    let index11 = 0;
    let index12 = 0;

    for (let j = 0; j < segmentsX; j++) {
      index11 = (segmentsX + 1) * i + j;
      index12 = index11 + 1;

      const index21 = index11;
      const index22 = index11 + (segmentsX + 1);

      indices.push(index11, index12);

      if (index22 < (segmentsX + 1) * (segmentsY + 1) - 1) {
        indices.push(index21, index22);
      }
    }

    if (index12 + segmentsX + 1 <= (segmentsX + 1) * (segmentsY + 1) - 1) {
      indices.push(index12, index12 + segmentsX + 1);
    }
  }

  g.setIndex(indices);
}

export default ToQuads;
