import "joypad.js";

import throttle from "../../helpers/throttle.js";

/**
 * Init gamepad support with joypad.js library
 *
 * @return  {Boolean}  Result
 */
export function initJoyPad() {
  if (!window.joypad) {
    return false;
  }

  this.log("Init gamepad");

  const { joypad } = window;

  joypad.set({
    axisMovementThreshold: 0.95,
  });

  joypad.on("connect", (e) => {
    const { id } = e.gamepad;

    this.log(`${id} connected!`);

    this.gamepad = e.gamepad;

    this.$store.commit("enableGamepad");
    this.emitter.emit("enableGamepad");

    window.focus();
  });

  joypad.on("disconnect", (e) => {
    this.gamepad = undefined;
    this.$store.commit("disableGamepad");
    this.emitter.emit("disableGamepad");
  });

  joypad.on("button_press", (e) => {
    const inMenu = this.isMenu || !this.isAccepted || this.isControlsInfo;

    this.log(`Press ${e.detail.buttonName}: menu ${inMenu}`);

    this.movesCounter += 1;

    if (this.isMenu) {
      this.pauseBgSound();
      this.playMenuBgSound();
    } else {
      this.playBgSound();
      this.pauseMenuBgSound();
    }

    switch (e.detail.buttonName) {
      // Left
      case "button_14":
        if (inMenu) {
          this.emitter.emit("pressLeft");
        } else {
          this.moveLeft();
        }
        break;
      // Right
      case "button_15":
        if (inMenu) {
          this.emitter.emit("pressRight");
        } else {
          this.moveRight();
        }
        break;
      // Up
      case "button_12":
        if (inMenu) {
          this.emitter.emit("pressUp");
        } else {
          this.moveUp();
        }
        break;
      // Down
      case "button_13":
        if (inMenu) {
          this.emitter.emit("pressDown");
        } else {
          this.moveDown();
        }
        break;
      // A
      case "button_0":
        if (inMenu) {
          this.emitter.emit("pressA");
        } else {
          this.current.userData.drop = true;
        }
        break;
      // B
      case "button_1":
        if (inMenu) {
          this.emitter.emit("pressB");
        }
        break;
      // Y
      case "button_2":
        if (inMenu) {
          this.emitter.emit("pressY");
        }
        break;
      // X
      case "button_3":
        if (inMenu) {
          this.emitter.emit("pressX");
        }
        break;
      //LB
      case "button_4":
        if (inMenu) {
          this.emitter.emit("pressLB");
        } else if (this.isRandomRotate) {
          this.randomRotate();
        } else {
          this.rotateZPlus();
        }
        break;
      // RB
      case "button_5":
        if (inMenu) {
          this.emitter.emit("pressRB");
        } else if (this.isRandomRotate) {
          this.randomRotate();
        } else {
          this.rotateZMinus();
        }
        break;
      // LT
      case "button_6":
        if (inMenu) {
          this.emitter.emit("pressLT");
        }
        break;
      // RT
      case "button_7":
        if (inMenu) {
          this.emitter.emit("pressRT");
        } else {
          this.current.userData.drop = true;
        }
        break;
      // Select
      case "button_8":
        break;
      // Pause
      case "button_9":
        if (!this.isFirstTime) {
          return false;
        }

        if (!inMenu) {
          this.openMenu();
        }
        break;
      // Left Trigger
      case "button_10":
        break;
      // Right Trigger
      case "button_11":
        break;
      // Xbox button
      case "button_16":
        break;
    }

    return true;
  });

  const throttledMovement = throttle(
    (stickMoved, directionOfMovement, event) => {
      this.emitter.emit("stickEvent", event.detail);

      if (stickMoved == "right_stick") {
        switch (directionOfMovement) {
          case "top":
            if (this.isMenu) {
              return false;
            } else if (this.isRandomRotate) {
              this.randomRotate();
            } else {
              this.rotateXMinus();
            }
            break;
          case "bottom":
            if (this.isMenu) {
              return false;
            } else if (this.isRandomRotate) {
              this.randomRotate();
            } else {
              this.rotateXPlus();
            }
            break;
          case "left":
            if (this.isMenu) {
              return false;
            } else if (this.isRandomRotate) {
              this.randomRotate();
            } else {
              this.rotateYMinus();
            }
            break;
          case "right":
            if (this.isMenu) {
              return false;
            } else if (this.isRandomRotate) {
              this.randomRotate();
            } else {
              this.rotateYPlus();
            }
            break;
        }
      } else {
        switch (directionOfMovement) {
          case "top":
            if (this.isMenu) {
              return false;
            } else {
              this.moveUp();
            }
            break;
          case "bottom":
            if (this.isMenu) {
              return false;
            } else {
              this.moveDown();
            }
            break;
          case "left":
            if (this.isMenu) {
              return false;
            } else {
              this.moveLeft();
            }
            break;
          case "right":
            if (this.isMenu) {
              return false;
            } else {
              this.moveRight();
            }
            break;
        }
      }
    },
    150
  );

  joypad.on("axis_move", (e) => {
    const { stickMoved, directionOfMovement } = e.detail;

    throttledMovement(stickMoved, directionOfMovement, e);
  });

  return true;
}

/**
 * Init keyboard events
 *
 * @return  {Boolean}  Result
 */
export function initKeyBoard() {
  this.log("Init keyboard");

  const keyHandler = ({ code }) => {
    this.movesCounter += 1;

    switch (code) {
      case "KeyQ":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press Q");
          if (this.isRandomRotate) {
            this.randomRotate();
          } else {
            this.rotateZPlus();
          }
        }
        break;
      case "KeyE":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press E");
          if (this.isRandomRotate) {
            this.randomRotate();
          } else {
            this.rotateZMinus();
          }
        }
        break;
      case "KeyW":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press W");
          if (this.isRandomRotate) {
            this.randomRotate();
          } else {
            this.rotateXMinus();
          }
        }
        break;
      case "KeyS":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press S");
          if (this.isRandomRotate) {
            this.randomRotate();
          } else {
            this.rotateXPlus();
          }
        }
        break;
      case "KeyA":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press A");
          if (this.isRandomRotate) {
            this.randomRotate();
          } else {
            this.rotateYMinus();
          }
        }
        break;
      case "KeyD":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press D");
          if (this.isRandomRotate) {
            this.randomRotate();
          } else {
            this.rotateYPlus();
          }
        }
        break;
      case "ArrowUp":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press Up");
          this.moveUp();
        }
        break;
      case "ArrowDown":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press Down");
          this.moveDown();
        }
        break;
      case "ArrowLeft":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press Left");
          this.moveLeft();
        }
        break;
      case "ArrowRight":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press Right");
          this.moveRight();
        }
        break;
    }
  };

  const momentKeyHandler = ({ code }) => {
    switch (code) {
      case "ShiftLeft":
        this.isSlow = !this.isSlow;
        break;
      case "Space":
        if (this.isMenu) {
          return false;
        } else {
          //this.log("Press Space");
          // this.isPause = !this.isPause;
          this.current.userData.drop = true;
        }

        break;
      case "Escape":
        //this.log("Press Escape");

        if (!this.isFirstTime) {
          return false;
        }

        if (!this.isMenu) {
          this.openMenu();
        }
        break;
      case "KeyR":
        if (!this.isMenu) {
          this.movesCounter += 2;
          this.randomRotate(3);
        }
        break;
    }
  };

  // const throttledKeyHandler = throttle((event) => {
  //   keyHandler(event);
  // }, 150);

  document.addEventListener("keydown", keyHandler);
  document.addEventListener("keydown", momentKeyHandler);

  return true;
}

export default initKeyBoard;
