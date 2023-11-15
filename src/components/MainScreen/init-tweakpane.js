import { Color } from "three";

/**
 * Add modes folder to pane
 *
 * @param   {Object}  pane  Pane
 *
 * @return  {Boolean}       Result
 */
function addModesFolders(pane) {
  if (!pane) {
    return false;
  }

  const modesFolder = pane.addFolder({
    title: "Modes",
    expanded: false,
  });

  modesFolder
    .addInput(
      {
        isEndless: this.isEndless,
      },
      "isEndless"
    )
    .on("change", (ev) => {
      this.$store.commit("updateEndless", ev.value);
    });

  modesFolder
    .addInput(
      {
        isPractice: this.isPractice,
      },
      "isPractice"
    )
    .on("change", (ev) => {
      this.$store.commit("updatePractice", ev.value);
    });

  const rotateRestrainFolder = modesFolder.addFolder({
    title: "Rotate restrain",
    expanded: false,
  });

  rotateRestrainFolder
    .addInput(
      {
        isRotateRestrain: this.isRotateRestrain,
      },
      "isRotateRestrain"
    )
    .on("change", (ev) => {
      this.$store.commit("setRotationRestrain", ev.value);
    });

  rotateRestrainFolder
    .addBlade({
      view: "slider",
      label: "Max rotate",
      min: 1,
      max: 10,
      format: (v) => Math.round(v),
      value: this.maxRotate,
    })
    .on("change", (ev) => {
      this.$store.commit("setMaxRotate", ev.value);
    });

  return true;
}

/**
 * Add actions folder to pane
 *
 * @param   {Object}  pane  Pane
 *
 * @return  {Boolean}       Result
 */
function addActionsFolder(pane) {
  if (!pane) {
    return false;
  }

  const actionsFolder = pane.addFolder({
    title: "Actions",
    expanded: false,
  });

  actionsFolder
    .addButton({
      title: "Shuffle",
      label: "Shuffle elements",
    })
    .on("click", () => {
      this.shuffle();
    });

  actionsFolder
    .addButton({
      title: "Shuffle",
      label: "Shuffle layers",
    })
    .on("click", () => {
      this.shuffleLayers();
    });

  actionsFolder
    .addButton({
      title: "Clear",
      label: "Clear layers",
    })
    .on("click", () => {
      this.layersCheck(true);
    });

  actionsFolder
    .addButton({
      title: "Rotate",
      label: "Rotate pit",
    })
    .on("click", () => {
      this.rotatePit();
    });

  actionsFolder
    .addButton({
      title: "Add random",
      label: "Achievement",
    })
    .on("click", () => {
      this.addRandomAchievement();
    });

  return true;
}

/**
 * Add renderer stats folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addRendererInfoFolder(pane) {
  if (!pane) {
    return false;
  }

  const rendererInfoFolder = pane.addFolder({
    title: "Render info",
    expanded: false,
  });

  const params = {
    memoryGeometries: this?.renderInfo?.memory.geometries || 0,
    memoryTextures: this?.renderInfo?.memory.textures || 0,

    programs: this?.renderInfo?.programs.length || 0,

    renderCalls: this?.renderInfo?.render.calls || 0,
    renderFrames: this?.renderInfo?.render.frames || 0,
    renderLines: this?.renderInfo?.render.lines || 0,
    renderPoints: this?.renderInfo?.render.points || 0,
    renderTriangles: this?.renderInfo?.render.triangles || 0,
    stats: JSON.stringify(this?.stats || {}, null, 4),
  };

  rendererInfoFolder
    .addMonitor(params, "memoryGeometries", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.memoryGeometries = this?.renderInfo?.memory.geometries || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "memoryTextures", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.memoryTextures = this?.renderInfo?.memory.textures || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "programs", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.programs = this?.renderInfo?.programs.length || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "renderCalls", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.renderCalls = this?.renderInfo?.render.calls || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "renderFrames", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.renderFrames = this?.renderInfo?.render.frames || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "renderLines", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.renderLines = this?.renderInfo?.render.lines || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "renderPoints", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.renderPoints = this?.renderInfo?.render.points || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "renderTriangles", {
      readonly: true,
      format: (v) => parseInt(v, 10),
    })
    .on("update", () => {
      params.renderTriangles = this?.renderInfo?.render.triangles || 0;
    });

  rendererInfoFolder
    .addMonitor(params, "stats", {
      readonly: true,
      rows: 10,
      multiline: true,
    })
    .on("update", () => {
      params.stats = JSON.stringify(this?.stats || {}, null, 4);
    });

  return true;
}

/**
 * Add game info folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addGameInfoFolder(pane) {
  if (!pane) {
    return false;
  }

  const params = {
    score: this.score,
    avgScore: this.avgScore,
    minScore: this.minScore,
    maxScore: this.maxScore,
  };

  const gameInfoFolder = pane.addFolder({
    title: "Game info",
    expanded: false,
  });

  gameInfoFolder
    .addMonitor(params, "score", {
      readonly: true,
    })
    .on("update", () => {
      params.score = this.score;
    });

  gameInfoFolder
    .addMonitor(params, "avgScore", {
      readonly: true,
    })
    .on("update", () => {
      params.avgScore = this.avgScore;
    });

  gameInfoFolder
    .addMonitor(params, "minScore", {
      readonly: true,
    })
    .on("update", () => {
      params.minScore = this.minScore;
    });

  gameInfoFolder
    .addMonitor(params, "maxScore", {
      readonly: true,
    })
    .on("update", () => {
      params.maxScore = this.maxScore;
    });

  return pane;
}

/**
 * Add info folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addInfoFolder(pane) {
  if (!pane) {
    return false;
  }

  const params = {
    fps: this.fps,
    maxFps: this.maxFps,
    frameTime: this.frameTime,
  };

  const infoFolder = pane.addFolder({
    title: "Info",
    expanded: true,
  });

  infoFolder
    .addMonitor(params, "fps", {
      view: "graph",
      min: 0,
      readonly: true,
    })
    .on("update", () => {
      params.fps = this.fps;
    });

  infoFolder
    .addMonitor(params, "fps", {
      readonly: true,
    })
    .on("update", () => {
      params.fps = this.fps;
    });

  infoFolder.addBlade({
    view: "separator",
  });

  infoFolder
    .addMonitor(params, "frameTime", {
      view: "graph",
      readonly: true,
    })
    .on("update", () => {
      params.frameTime = this.frameTime;
    });

  infoFolder
    .addMonitor(params, "frameTime", {
      readonly: true,
    })
    .on("update", () => {
      params.frameTime = this.frameTime;
    });

  infoFolder
    .addMonitor(params, "maxFps", {
      readonly: true,
    })
    .on("update", () => {
      params.maxFps = this.maxFps;
    });

  return pane;
}

/**
 * Add colors folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addColorsFolder(pane) {
  if (!pane) {
    return false;
  }

  const colorsFolder = pane.addFolder({
    title: "Colors",
    expanded: false,
  });

  const gridColor = new Color(this.gridColor);

  const firstLightColor = new Color(this.firstLightColor);
  const secondLightColor = new Color(this.secondLightColor);
  const thirdLightColor = new Color(this.thirdLightColor);
  const gridFirstColor = new Color(this.gridFirstColor);
  const gridSecondColor = new Color(this.gridSecondColor);

  colorsFolder
    .addInput(
      {
        gridFirstColor: `#${gridFirstColor.getHexString()}`,
      },
      "gridFirstColor",
      { view: "color" }
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.$store.state.gridFirstColor = new Color(ev.value);
      this.reCreatePit(this.pitSize, true);
    });

  colorsFolder
    .addInput(
      {
        gridSecondColor: `#${gridSecondColor.getHexString()}`,
      },
      "gridSecondColor",
      { view: "color" }
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.$store.state.gridSecondColor = new Color(ev.value);
      this.reCreatePit(this.pitSize, true);
    });

  colorsFolder
    .addInput(
      {
        gridColor: `#${gridColor.getHexString()}`,
      },
      "gridColor",
      { view: "color" }
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.$store.state.gridColor = new Color(ev.value);
      this.reCreatePit(this.pitSize, true);
    });

  colorsFolder
    .addInput(
      {
        firstLightColor: `#${firstLightColor.getHexString()}`,
      },
      "firstLightColor"
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.$store.state.firstLightColor = new Color(ev.value);
      this.initLights(true);
    });

  colorsFolder
    .addInput(
      {
        secondLightColor: `#${secondLightColor.getHexString()}`,
      },
      "secondLightColor"
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.$store.state.secondLightColor = new Color(ev.value);
      this.initLights(true);
    });

  colorsFolder
    .addInput(
      {
        thirdLightColor: `#${thirdLightColor.getHexString()}`,
      },
      "thirdLightColor"
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.$store.state.thirdLightColor = new Color(ev.value);
      this.initLights(true);
    });

  return pane;
}

/**
 * Add settings folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addSettingsFolder(pane) {
  if (!pane) {
    return false;
  }

  const settingsFolder = pane.addFolder({
    title: "Settings",
    expanded: false,
  });

  settingsFolder
    .addInput(
      {
        isPitGrid: this.isPitGrid,
      },
      "isPitGrid"
    )
    .on("change", (ev) => {
      this.$store.commit("updatePitGrid", ev.value);
    });

  settingsFolder
    .addInput(
      {
        isShaders: this.isShaders,
      },
      "isShaders"
    )
    .on("change", (ev) => {
      this.$store.commit("updateShaders", ev.value);
    });

  settingsFolder
    .addInput(
      {
        antialias: this.antialias,
      },
      "antialias"
    )
    .on("change", (ev) => {
      this.$store.commit("updateAntialias", ev.value);
    });

  settingsFolder
    .addInput(
      {
        isSmooth: this.isSmooth,
      },
      "isSmooth"
    )
    .on("change", (ev) => {
      this.isSmooth = ev.value;
      this.updateSmooth(this.isSmooth);
    });

  settingsFolder
    .addInput(
      {
        isFastDrop: this.isFastDrop,
      },
      "isFastDrop"
    )
    .on("change", (ev) => {
      this.isFastDrop = ev.value;
    });

  settingsFolder
    .addInput(
      {
        isSimple: this.isSimple,
      },
      "isSimple"
    )
    .on("change", (ev) => {
      this.isSimple = ev.value;
      this.updateSimple(this.isSimple);
    });

  settingsFolder
    .addInput(
      {
        isInstanced: this.isInstanced,
      },
      "isInstanced"
    )
    .on("change", (ev) => {
      this.isInstanced = ev.value;
      this.updateInstanced(this.isInstanced);
    });

  settingsFolder
    .addInput(
      {
        isColorizeLevel: this.isColorizeLevel,
      },
      "isColorizeLevel"
    )
    .on("change", (ev) => {
      this.isColorizeLevel = ev.value;
    });

  settingsFolder
    .addInput(
      {
        isOldColorize: this.isOldColorize,
      },
      "isOldColorize"
    )
    .on("change", (ev) => {
      this.isOldColorize = ev.value;
    });

  settingsFolder
    .addInput(
      {
        changeSpeedByLevels: this.changeSpeedByLevels,
      },
      "changeSpeedByLevels"
    )
    .on("change", (ev) => {
      this.changeSpeedByLevels = ev.value;
    });

  settingsFolder
    .addInput(
      {
        isRotateAnimation: this.isRotateAnimation,
      },
      "isRotateAnimation"
    )
    .on("change", (ev) => {
      this.isRotateAnimation = ev.value;
    });

  settingsFolder
    .addBlade({
      view: "list",
      label: "Blocks type",
      options: this.blocksTypeOptions.map((item) => {
        return { text: item, value: item };
      }),
      value: this.blocksType,
    })
    .on("change", (ev) => {
      this.updateBlocksType(ev.value);
    });

  return pane;
}

/**
 * Add helpers folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addHelpersFolder(pane) {
  if (!pane) {
    return false;
  }

  const helpersFolder = pane.addFolder({
    title: "Helpers",
    expanded: false,
  });

  helpersFolder
    .addInput(
      {
        isLevelHelpers: this.isLevelHelpers,
      },
      "isLevelHelpers"
    )
    .on("change", (ev) => {
      this.isLevelHelpers = ev.value;
    });

  return pane;
}

/**
 * Add fog settings folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addFogFolder(pane) {
  if (!pane) {
    return false;
  }

  const fogColor = new Color(this.fogColor);

  const fogFolder = pane.addFolder({
    title: "Fog",
    expanded: false,
  });

  fogFolder
    .addInput(
      {
        isFog: this.isFog,
      },
      "isFog"
    )
    .on("change", (ev) => {
      this.isFog = ev.value;
    });

  fogFolder
    .addInput(
      {
        fogColor: `#${fogColor.getHexString()}`,
      },
      "fogColor",
      { view: "color" }
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.fogColor = new Color(ev.value);
    });

  fogFolder
    .addBlade({
      view: "slider",
      label: "Density",
      min: 0.0001,
      max: 0.3,
      value: this.fogDensity,
    })
    .on("change", (ev) => {
      this.fogDensity = ev.value;
    });

  return pane;
}

/**
 * Add fog planes settings folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addFogPlanesFolder(pane) {
  if (!pane) {
    return false;
  }

  const fogCenterColor = new Color(this.fogCenterColor);
  const fogAroundColor = new Color(this.fogAroundColor);

  const fogPlanesFolder = pane.addFolder({
    title: "Fog planes",
    expanded: false,
  });

  fogPlanesFolder
    .addInput(
      {
        isFogPlanesCenter: this.isFogPlanesCenter,
      },
      "isFogPlanesCenter"
    )
    .on("change", (ev) => {
      this.isFogPlanesCenter = ev.value;
      this.addFogParticles();
    });

  fogPlanesFolder
    .addInput(
      {
        isFogPlanesAround: this.isFogPlanesAround,
      },
      "isFogPlanesAround"
    )
    .on("change", (ev) => {
      this.isFogPlanesAround = ev.value;
      this.addFogParticles();
    });

  fogPlanesFolder
    .addInput(
      {
        fogCenterColor: `#${fogCenterColor.getHexString()}`,
      },
      "fogCenterColor",
      { view: "color" }
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.fogCenterColor = new Color(ev.value);
    });

  fogPlanesFolder
    .addInput(
      {
        fogAroundColor: `#${fogAroundColor.getHexString()}`,
      },
      "fogAroundColor",
      { view: "color" }
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.fogAroundColor = new Color(ev.value);
    });

  fogPlanesFolder
    .addBlade({
      view: "slider",
      label: "Center opacity",
      min: 0.001,
      max: 1,
      value: this.fogCenterOpacity,
    })
    .on("change", (ev) => {
      this.fogCenterOpacity = ev.value;
    });

  fogPlanesFolder
    .addBlade({
      view: "slider",
      label: "Around opacity",
      min: 0.001,
      max: 1,
      value: this.fogAroundOpacity,
    })
    .on("change", (ev) => {
      this.fogAroundOpacity = ev.value;
    });

  fogPlanesFolder
    .addBlade({
      view: "slider",
      label: "Center particles count",
      min: 1,
      max: 100,
      format: (v) => Math.round(v),
      value: this.fogCenterParticlesCount,
    })
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.fogCenterParticlesCount = ev.value;
      this.addFogParticles();
    });

  fogPlanesFolder
    .addBlade({
      view: "slider",
      label: "Around particles count",
      min: 1,
      max: 100,
      format: (v) => Math.round(v),
      value: this.fogAroundParticlesCount,
    })
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.fogAroundParticlesCount = ev.value;
      this.addFogParticles();
    });

  fogPlanesFolder
    .addBlade({
      view: "slider",
      label: "Particle size",
      min: 0.1,
      max: 10,
      value: this.fogCenterSize,
    })
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.fogCenterSize = ev.value;
      this.addFogParticles();
    });

  fogPlanesFolder
    .addBlade({
      view: "slider",
      label: "Speed delta multiplier",
      min: 0.001,
      max: 5,
      value: this.fogParticlesDelta,
    })
    .on("change", (ev) => {
      this.fogParticlesDelta = ev.value;
    });

  return pane;
}

/**
 * Add halloween settings folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addHalloweenFolder(pane) {
  if (!pane) {
    return false;
  }

  const halloweenFolder = pane.addFolder({
    title: "Halloween",
    expanded: false,
  });

  halloweenFolder
    .addInput(
      {
        isHalloween: this.isHalloween,
      },
      "isHalloween"
    )
    .on("change", (ev) => {
      this.$store.commit("setHalloween", ev.value);
    });

  halloweenFolder
    .addBlade({
      view: "slider",
      label: "Count",
      min: 1,
      max: 9,
      format: (v) => Math.round(v),
      value: this.halloweenBlocksCount,
    })
    .on("change", (ev) => {
      this.halloweenBlocksCount = ev.value;
      this.reCreatePit(this.pitSize, true);
    });

  const skullLight = new Color(this.skullLight);

  halloweenFolder
    .addInput(
      {
        skullLight: `#${skullLight.getHexString()}`,
      },
      "skullLight",
      { view: "color" }
    )
    .on("change", (ev) => {
      if (!ev.last) {
        return false;
      }

      this.$store.state.skullLight = new Color(ev.value);
      this.reCreatePit(this.pitSize, true);
    });

  return pane;
}

/**
 * Add random forms and shuffle actions folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addRandomFormsFolder(pane) {
  if (!pane) {
    return false;
  }

  const randomFormsFolder = pane.addFolder({
    title: "Random forms",
    expanded: false,
  });

  randomFormsFolder
    .addBlade({
      view: "slider",
      label: "Random forms",
      min: 1,
      max: 10,
      format: (v) => Math.round(v),
      value: this.randomFormsCount,
    })
    .on("change", (ev) => {
      this.randomFormsCount = ev.value;
    });

  randomFormsFolder
    .addButton({
      title: "Add",
      label: "Add forms",
    })
    .on("click", () => {
      this.addRandomFigures();
    });

  return pane;
}

/**
 * Add random forms and shuffle actions folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addTimelessFolder(pane) {
  if (!pane) {
    return false;
  }

  const timelessModeFolder = pane.addFolder({
    title: "Timeless mode",
    expanded: false,
  });

  const params = {
    time: this.timelessTime,
  };

  timelessModeFolder
    .addInput(
      {
        isTimeless: this.isTimeless,
      },
      "isTimeless"
    )
    .on("change", (ev) => {
      this.$store.commit("setTimeless", ev.value);
    });

  timelessModeFolder
    .addBlade({
      view: "slider",
      label: "Max time",
      min: 1,
      max: 10 * 60,
      format: (v) => Math.round(v),
      value: this.timelessMaxTime / 1000,
    })
    .on("change", (ev) => {
      this.$store.commit("setTimelessMaxTime", ev.value * 1000);
    });

  timelessModeFolder
    .addMonitor(params, "time", {
      readonly: true,
      format: (v) => Math.round(v),
    })
    .on("update", () => {
      params.time = this.timelessTime / 1000;
    });

  return pane;
}

/**
 * Add slow mode folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addSlowModeFolder(pane) {
  if (!pane) {
    return false;
  }

  const slowModeFolder = pane.addFolder({
    title: "Slow mode",
    expanded: false,
  });

  const params = {
    time: this.slowValue,
  };

  slowModeFolder
    .addInput(
      {
        isSlow: this.isSlow,
      },
      "isSlow"
    )
    .on("change", (ev) => {
      this.isSlow = ev.value;
    });

  slowModeFolder
    .addMonitor(params, "time", {
      view: "graph",
      min: 0,
      max: 4,
      readonly: true,
    })
    .on("update", () => {
      params.time = this.slowValue;
    });

  return pane;
}

/**
 * Add fps lock folder
 *
 * @param   {Object}   pane  Pane
 *
 * @return  {Boolean}        Result
 */
function addFpsLockFolder(pane) {
  if (!pane) {
    return false;
  }

  const fpsLockFolder = pane.addFolder({
    title: "FPS lock",
    expanded: false,
  });

  fpsLockFolder
    .addInput(
      {
        isFpsLock: this.isFpsLock,
      },
      "isFpsLock"
    )
    .on("change", (ev) => {
      this.isFpsLock = ev.value;
    });

  fpsLockFolder
    .addBlade({
      view: "slider",
      label: "FPS Lock",
      min: 1,
      max: 200,
      format: (v) => Math.round(v),
      value: this.fpsLockValue,
    })
    .on("change", (ev) => {
      this.fpsLockValue = ev.value;
    });

  return pane;
}

/**
 * Init Tweakpane
 *
 * @param   {Object}  pane  Input tweakpane object
 *
 * @return  {Boolean}       Result
 */
export function initTweakPane(pane) {
  if (!pane) {
    return false;
  }

  this.log("Init Tweakpane");

  addInfoFolder.call(this, pane);
  addRendererInfoFolder.call(this, pane);
  addGameInfoFolder.call(this, pane);
  addColorsFolder.call(this, pane);
  addSettingsFolder.call(this, pane);
  addHelpersFolder.call(this, pane);
  addModesFolders.call(this, pane);
  addFogFolder.call(this, pane);
  addFogPlanesFolder.call(this, pane);
  addHalloweenFolder.call(this, pane);
  addTimelessFolder.call(this, pane);
  addSlowModeFolder.call(this, pane);
  addFpsLockFolder.call(this, pane);
  addRandomFormsFolder.call(this, pane);
  addActionsFolder.call(this, pane);

  return true;
}

export default initTweakPane;
