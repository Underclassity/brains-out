import { Color } from "three";

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

  const params = {
    fps: this.fps,
    frameTime: this.frameTime,
    score: this.score,
    avgScore: this.avgScore,
    minScore: this.minScore,
    maxScore: this.maxScore,
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
    .addMonitor(params, "frameTime", {
      view: "graph",
      readonly: true,
    })
    .on("update", () => {
      params.frameTime = this.frameTime;
    });

  infoFolder
    .addMonitor(params, "fps", {
      readonly: true,
    })
    .on("update", () => {
      params.fps = this.fps;
    });

  infoFolder
    .addMonitor(params, "frameTime", {
      readonly: true,
    })
    .on("update", () => {
      params.frameTime = this.frameTime;
    });

  infoFolder
    .addMonitor(params, "score", {
      readonly: true,
    })
    .on("update", () => {
      params.score = this.score;
    });

  infoFolder
    .addMonitor(params, "avgScore", {
      readonly: true,
    })
    .on("update", () => {
      params.avgScore = this.avgScore;
    });

  infoFolder
    .addMonitor(params, "minScore", {
      readonly: true,
    })
    .on("update", () => {
      params.minScore = this.minScore;
    });

  infoFolder
    .addMonitor(params, "maxScore", {
      readonly: true,
    })
    .on("update", () => {
      params.maxScore = this.maxScore;
    });

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
  const fogColor = new Color(this.fogColor);

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

  const settingsFolder = pane.addFolder({
    title: "Settings",
    expanded: false,
  });

  settingsFolder
    .addInput(
      {
        isCandles: this.isCandles,
      },
      "isCandles"
    )
    .on("change", (ev) => {
      this.isCandles = ev.value;
      this.reCreatePit(this.pitSize, true);
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
      this.isShaders = ev.value;
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
      this.isPractice = ev.value;
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
      this.isRotateRestrain = ev.value;
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
      this.maxRotate = ev.value;
    });

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

  const actionsFolder = pane.addFolder({
    title: "Actions",
    expanded: true,
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

  return true;
}

export default initTweakPane;
