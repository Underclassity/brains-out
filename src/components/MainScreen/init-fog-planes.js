import {
  Group,
  InstancedMesh,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
} from "three";

import interpolateArray from "../../helpers/interpolate-array.js";

/**
 * Add fog planes helper
 *
 * @return  {Boolean}  Result
 */
export async function addFogParticles() {
  this.updateCameraProjection();

  const {
    scene,
    fogGroup,
    fogTexture,
    isFogPlanesAround,
    isFogPlanesCenter,
    isHalloween,
    viewWidth,
    viewHeight,
    pitWidth,
    pitHeight,
  } = this;

  if (fogGroup) {
    this.removeObjWithChildren(fogGroup);
  }

  if ((!isFogPlanesCenter && !isFogPlanesAround) || !isHalloween) {
    return false;
  }

  this.log(
    `Add fog planes particles: center-${isFogPlanesCenter} around-${isFogPlanesAround} halloween-${isHalloween}`
  );

  if (!fogTexture) {
    return false;
  }

  this.fogGroup = new Group();

  this.fogParticles = [];

  if (isFogPlanesCenter) {
    const planeSize = Math.max(pitWidth, pitHeight);

    const material = new MeshLambertMaterial({
      color: this.fogCenterColor,
      depthWrite: false,
      map: this.fogTexture,
      transparent: true,
      opacity: this.fogCenterOpacity,
    });

    const geometry = new PlaneGeometry(planeSize, planeSize);

    const centerPlaneMesh = new InstancedMesh(
      geometry,
      material,
      this.fogCenterParticlesCount
    );
    this.fogGroup.add(centerPlaneMesh);

    const dummy = new Object3D();

    for (let i = 0; i < this.fogCenterParticlesCount; i++) {
      const x = (Math.random() - 0.5) * planeSize;
      const y = (Math.random() - 0.5) * planeSize;
      const z = 2;

      const zRot = Math.random() * 2;

      dummy.position.set(x, y, z);
      dummy.rotation.z = zRot;

      centerPlaneMesh.setMatrixAt(i, dummy.matrix);

      this.fogParticles.push({
        mesh: centerPlaneMesh,
        index: i,
        x,
        y,
        z,
        zRot,
        type: "center",
      });
    }
  }

  if (isFogPlanesAround) {
    const material = new MeshLambertMaterial({
      color: this.fogAroundColor,
      depthWrite: false,
      map: this.fogTexture,
      transparent: true,
      opacity: this.fogAroundOpacity,
    });

    const vWidth = Math.round(viewWidth);
    const vHeight = Math.round(viewHeight);
    const maxSize = Math.max(vWidth, vHeight);

    const heightDiff = (maxSize - pitHeight) / 2;
    const widthDiff = (maxSize - pitWidth) / 2;

    const cornerSize = Math.max(widthDiff, heightDiff);

    const cornerGeometry = new PlaneGeometry(cornerSize, cornerSize);
    const cornerPlaneMesh = new InstancedMesh(
      cornerGeometry,
      material,
      4 * this.fogAroundParticlesCount
    );
    this.fogGroup.add(cornerPlaneMesh);

    const dummy = new Object3D();

    // Constant position for fog planes
    const z = 2;

    const leftXPos = (-viewWidth / 2 - pitWidth / 2) / 2;
    const bottomYPos = (-viewHeight / 2 - pitHeight / 2) / 2;

    const leftX = leftXPos;
    const rightX = Math.abs(leftXPos);
    const topY = Math.abs(bottomYPos);
    const bottomY = bottomYPos;

    let index = 0;

    [
      {
        x: leftX,
        y: bottomY,
      },
      {
        x: rightX,
        y: bottomY,
      },
      {
        x: leftX,
        y: topY,
      },
      {
        x: rightX,
        y: topY,
      },
    ].forEach(({ x, y }) => {
      for (let i = 0; i < this.fogAroundParticlesCount; i++) {
        const xOffset = (Math.random() - 0.5) * cornerSize;
        const yOffset = (Math.random() - 0.5) * cornerSize;

        x += xOffset;
        y += yOffset;

        const zRot = Math.random() * 2;

        dummy.position.set(x, y, z);
        dummy.rotation.z = zRot;

        cornerPlaneMesh.setMatrixAt(index, dummy.matrix);

        this.fogParticles.push({
          x,
          y,
          z,
          zRot,
          index,
          mesh: cornerPlaneMesh,
          type: "around",
        });

        index++;
      }
    });

    const topBottomCount = Math.round(pitWidth / heightDiff);
    const topBottomPartWidth = pitWidth / topBottomCount;
    const xPositions = interpolateArray(
      [
        (-topBottomPartWidth * topBottomCount) / 2 + topBottomPartWidth / 2,
        (topBottomPartWidth * topBottomCount) / 2 - topBottomPartWidth / 2,
      ],
      topBottomCount
    );

    const topBottomGeometry = new PlaneGeometry(topBottomPartWidth, heightDiff);
    const topBottomPlaneMesh = new InstancedMesh(
      topBottomGeometry,
      material,
      xPositions.length * 2
    );
    this.fogGroup.add(topBottomPlaneMesh);

    index = 0;

    for (let x of xPositions) {
      for (let i = 0; i < this.fogAroundParticlesCount; i++) {
        const xOffset = (Math.random() - 0.5) * topBottomPartWidth * 0.2;
        const yOffset = (Math.random() - 0.5) * topBottomPartWidth * 0.2;

        x += xOffset;

        const zRot = Math.random() * 2;

        dummy.position.set(x, topY + yOffset, z);
        dummy.rotation.z = zRot;

        topBottomPlaneMesh.setMatrixAt(index, dummy.matrix);

        this.fogParticles.push({
          x,
          y: topY + yOffset,
          z,
          zRot,
          index,
          mesh: topBottomPlaneMesh,
          type: "around",
        });

        index++;

        dummy.position.set(x, bottomY + yOffset, z);
        dummy.rotation.z = zRot;

        topBottomPlaneMesh.setMatrixAt(index, dummy.matrix);

        this.fogParticles.push({
          x,
          y: bottomY + yOffset,
          z,
          zRot,
          index,
          mesh: topBottomPlaneMesh,
          type: "around",
        });

        index++;
      }
    }

    const leftRightCount = Math.round(pitHeight / widthDiff);
    const leftRightHeight = pitHeight / leftRightCount;
    const yPositions = interpolateArray(
      [
        (-leftRightHeight * leftRightCount) / 2 + leftRightHeight / 2,
        (leftRightHeight * leftRightCount) / 2 - leftRightHeight / 2,
      ],
      leftRightCount
    );

    const leftRightGeometry = new PlaneGeometry(widthDiff, leftRightHeight);
    const leftRightPlaneMesh = new InstancedMesh(
      leftRightGeometry,
      material,
      yPositions.length * 2 * this.fogAroundParticlesCount
    );
    this.fogGroup.add(leftRightPlaneMesh);

    index = 0;

    for (let y of yPositions) {
      for (let i = 0; i < this.fogAroundParticlesCount; i++) {
        const xOffset = (Math.random() - 0.5) * leftRightHeight * 0.2;
        const yOffset = (Math.random() - 0.5) * leftRightHeight * 0.2;

        y += yOffset;

        const zRot = Math.random() * 2;

        dummy.position.set(leftX + xOffset, y, z);
        dummy.rotation.z = zRot;

        leftRightPlaneMesh.setMatrixAt(index, dummy.matrix);

        this.fogParticles.push({
          x: leftX + xOffset,
          y,
          z,
          zRot,
          index,
          mesh: leftRightPlaneMesh,
          type: "around",
        });

        index++;

        dummy.position.set(rightX + xOffset, y, z);
        dummy.rotation.z = zRot;

        leftRightPlaneMesh.setMatrixAt(index, dummy.matrix);

        this.fogParticles.push({
          x: rightX + xOffset,
          y,
          z,
          zRot,
          index,
          mesh: leftRightPlaneMesh,
          type: "around",
        });

        index++;
      }
    }
  }

  scene.add(this.fogGroup);

  return true;
}

export default addFogParticles;
