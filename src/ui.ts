import {
  createMachine,
  State,
  interpret,
  ResolveTypegenMeta,
  TypegenDisabled,
  BaseActionObject,
  ServiceMap,
} from "xstate";
import { EventList } from "@/utils/events";
import { qs, qsa } from "@/utils/dom";
import { Store } from "./utils/store";
import { config } from "@/config";
import { createPopup } from "./utils/popup";
import { levels } from "./config/levels";

export type UIEvent =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "DIE" }
  | { type: "RESTART" }
  | { type: "BACK" }
  | { type: "LEVELS" }
  | { type: "SHOP" }
  | { type: "FINISH" };

interface UIContext {}

type UITypestate =
  | {
      value: "menu";
      context: UIContext;
    }
  | {
      value: "gameOver";
      context: UIContext;
    }
  | {
      value: "paused";
      context: UIContext;
    }
  | {
      value: "play";
      context: UIContext;
    }
  | {
      value: "levels";
      context: UIContext;
    }
  | {
      value: "shop";
      context: UIContext;
    }
  | {
      value: "completed";
      context: UIContext;
    };

type UIState = State<
  UIContext,
  UIEvent,
  {},
  UITypestate,
  ResolveTypegenMeta<TypegenDisabled, UIEvent, BaseActionObject, ServiceMap>
>;

export class UI {
  private interpreter = interpret(
    createMachine<UIContext, UIEvent, UITypestate>(
      {
        id: "geometry-crack",
        context: {},
        initial: "menu",
        states: {
          menu: {
            on: {
              START: {
                target: "play",
              },
              SHOP: {
                target: "shop",
              },
              LEVELS: {
                target: "levels",
              },
            },
          },
          play: {
            on: {
              PAUSE: {
                target: "paused",
              },
              DIE: {
                target: "gameOver",
              },
              FINISH: {
                target: "completed",
              },
            },
          },
          paused: {
            on: {
              RESUME: {
                target: "play",
              },
            },
          },
          gameOver: {
            on: {
              RESTART: {
                target: "play",
              },
              BACK: {
                target: "menu",
              },
            },
          },
          shop: {
            on: {
              BACK: {
                target: "menu",
              },
            },
          },
          levels: {
            on: {
              START: {
                target: "play",
              },
              BACK: {
                target: "menu",
              },
            },
          },
          completed: {
            on: {
              BACK: {
                target: "levels",
              },
            },
          },
        },
        schema: {
          events: {} as UIEvent,
        },
        predictableActionArguments: true,
        preserveActionOrder: true,
      },
      {
        actions: {},
        services: {},
        guards: {},
        delays: {},
      }
    )
  );
  private prevState: UIState;

  private readonly jumpsLeftContainer = qs("#jumps-left");
  private readonly scoreContainer = qs("#score");
  private readonly highestScoreContainer = qs("#highest-score");
  private readonly newRecord = qs("#new-record");
  private readonly crackcoinsCounters = qsa("[data-crackcoins-counter]");
  private readonly playingCrackcoinsCounter = qs("#play__crackcoin-counter");
  private readonly progressBar = qs("#play__progress-bar");
  private readonly btnResetProgress = qs("#reset-progress");
  private readonly levelsContainer = qs("#levels-container");

  private events = new EventList<"state buttons" | "playing" | "restart" | "menu" | "shop">();
  private isSpaceKeyDisabled = false;

  private pages: Record<UITypestate["value"], HTMLElement>;
  private shopCurrentSkin = qs<HTMLImageElement>("#shop__current-skin");
  private shopSkins = qs("#shop__skins")!;
  level: LevelName | "challenge" = "challenge";
  onJump = () => {};
  onSkinUpdate: (skinsUrl: string[]) => void = () => {};

  constructor() {
    const pagesName: UITypestate["value"][] = ["menu", "gameOver", "paused", "play", "shop", "levels", "completed"];
    this.pages = {} as Record<UITypestate["value"], HTMLElement>;

    pagesName.forEach((pageName: UITypestate["value"]) => {
      this.pages[pageName] = qs(`#${pageName}`);
    });

    const buttons = qsa("[data-button]");
    const challengeBtn = qs("#challenge-btn");
    const clickOverlay = qs("#play__click-overlay");
    const gameOverClickOverlay = qs("#game-over__click-overlay");

    buttons.forEach(button => {
      this.events.add(
        "state buttons",
        "click",
        () => {
          const event = button.getAttribute("data-button") as UIEvent["type"];
          button.blur();
          button.setAttribute("tabindex", "-1");
          this.handleEvent({ type: event });
        },
        button
      );
      this.events.add("state buttons", "focus", () => (this.isSpaceKeyDisabled = true), button);
      this.events.add("state buttons", "blur", () => (this.isSpaceKeyDisabled = false), button);
      button.setAttribute("tabindex", "-1");
    });

    this.events.add(
      "state buttons",
      "click",
      () => {
        challengeBtn.blur();
        challengeBtn.setAttribute("tabindex", "-1");

        this.level = "challenge";

        this.handleEvent({ type: "START" });
      },
      challengeBtn
    );
    this.events.add("state buttons", "focus", () => (this.isSpaceKeyDisabled = true), challengeBtn);
    this.events.add("state buttons", "blur", () => (this.isSpaceKeyDisabled = false), challengeBtn);
    challengeBtn.setAttribute("tabindex", "-1");

    this.events.add(
      "state buttons",
      "click",
      e => {
        const levelBtn = e.target as HTMLButtonElement;
        const levelNumber = levelBtn.getAttribute("data-level") as LevelName;

        this.level = levelNumber;
        this.handleEvent({ type: "START" });
      },
      this.levelsContainer
    );

    this.events.enable("state buttons");
    this.events.add(
      "playing",
      "keydown",
      e => {
        const { key } = e;
        if (key === " " && this.isSpaceKeyDisabled) return;
        if (key === " " || key === "ArrowUp") {
          this.onJump();
        }
      },
      document.body
    );

    if (/Android|iPhone/i.test(navigator.userAgent)) {
      this.events.add("playing", "touchstart", () => this.onJump(), clickOverlay);
    } else {
      this.events.add(
        "playing",
        "click",
        () => {
          this.onJump();
        },
        clickOverlay
      );
    }

    this.events.add(
      "restart",
      "keydown",
      e => {
        const { key } = e;
        if (key === " " && this.isSpaceKeyDisabled) return;
        if (key === " " || key === "ArrowUp") this.handleEvent({ type: "RESTART" });
      },
      document.body
    );

    this.events.add("restart", "click", () => this.handleEvent({ type: "RESTART" }), gameOverClickOverlay);
    this.events.add(
      "shop",
      "click",
      e => {
        const button = e.target as HTMLButtonElement;
        const skin = Store.content.skins.find(skin => skin.name === button.dataset.btnSkin) as Skin;

        if (skin.status === "unbought") {
          if (skin.price <= Store.content.crackcoins) {
            Store.content.crackcoins -= skin.price;
            Store.save();
            skin.status = "owned";
          } else {
            return;
          }
        }

        if (skin.status === "owned") {
          const equippedSkin = Store.content.skins.find(skin => skin.status === "equipped") as Skin;
          skin.status = "equipped";
          equippedSkin.status = "owned";
          this.displayShop();
        }

        this.displayShop();
        this.onSkinUpdate(skin.imgs);
      },
      this.shopSkins
    );

    this.events.add(
      "menu",
      "click",
      async () => {
        if (await createPopup("Are you sure you want to reset your progress?")) Store.clear();
      },
      this.btnResetProgress
    );

    this.events.addDocument("playing", "visibilitychange", () => {
      this.handleEvent({ type: "PAUSE" });
    });

    this.interpreter.start();
    this.prevState = this.interpreter.getSnapshot();
    this.render(this.interpreter.getSnapshot());
  }

  private handleEvent(event: UIEvent) {
    this.prevState = this.interpreter.getSnapshot();
    this.interpreter.send(event);

    const nextState = this.interpreter.getSnapshot();
    if (nextState.value === this.prevState.value) return;
    this.render(nextState);
  }

  private render(state: UIState) {
    switch (this.prevState.value) {
      case "menu":
        this.events.disable("menu");
        break;
      case "play":
        this.events.disable("playing");
        break;
      case "gameOver":
        this.events.disable("restart");
        this.newRecord.classList.remove("show");
        break;
      case "shop":
        this.events.disable("shop");
        break;
    }

    switch (state.value) {
      case "menu":
        this.events.enable("menu");
        break;
      case "play":
        this.events.enable("playing");
        break;
      case "gameOver":
        setTimeout(() => {
          this.events.enable("restart");
        }, config.delayBeforeRestart);
        break;
      case "shop":
        this.events.enable("shop");
        break;
      case "levels":
        this.displayLevels();
        break;
    }

    const button = qs(`#${state.value as UITypestate["value"]} [data-button]`);

    button.setAttribute("tabindex", "0");
    this.pages[state.value as UITypestate["value"]].style.setProperty("--opacity", "1");

    if (state.value !== this.prevState.value) {
      this.pages[this.prevState.value as UITypestate["value"]].style.setProperty("--opacity", "0");
    }
  }

  onEvent(cb: (event: UIEvent) => void) {
    this.interpreter.onTransition(state => {
      cb(state.event);
    });
  }

  die() {
    if (this.interpreter.getSnapshot().value !== "gameOver") this.handleEvent({ type: "DIE" });
  }

  finish() {
    this.handleEvent({ type: "FINISH" });
  }

  displayJumpsLeft(jumpsLeft: number) {
    this.jumpsLeftContainer.textContent = `${jumpsLeft}`;
  }

  displayTimeToRegen(timeToRegen: number) {
    this.jumpsLeftContainer.style.setProperty("--time-to-regen", `${timeToRegen}`);
  }

  displayScore(score: number) {
    this.scoreContainer.textContent = `score: ${Math.floor(score)}`;
  }

  displayHighestScore(score: number) {
    this.highestScoreContainer.textContent = `HS: ${Math.floor(score)}`;
  }

  displayNewRecord() {
    this.newRecord.classList.add("show");
  }

  displayProgressBar(progress: number) {
    this.progressBar.style.setProperty("--js-width", `${Math.floor(progress * 100)}%`);
  }

  displayCrackcoins(crackcoins: number) {
    this.crackcoinsCounters.forEach(crackcoinsCounter => {
      crackcoinsCounter.textContent = `${crackcoins}`;
    });
  }

  displayCrackcoinsPlaying(crackcoins: number) {
    this.playingCrackcoinsCounter.textContent = `${Math.floor(crackcoins)}`;
  }

  displayShop() {
    this.displayCrackcoins(Store.content.crackcoins);

    const statusButton: Record<Skin["status"], string> = {
      owned: "equip",
      equipped: "used",
      unbought: "buy",
    };

    this.shopCurrentSkin.src = (Store.content.skins.find(skin => skin.status === "equipped") as Skin).imgs[4];

    this.shopSkins.innerHTML = Store.content.skins
      .map(skin => {
        return `
        <div class="skin-card">
          <span class="skin-card__price">${skin.price}
            <img src="/img/ui/crackcoin_icon.svg" />
          </span>
          <img class="skin-card__img" src=${skin.imgs[4]} />
          <button class="skin-card__btn btn skin-card__btn--${skin.status}" data-btn-skin="${skin.name}">${
          statusButton[skin.status]
        }</button>
        </div>
`;
      })
      .join("");
  }

  displayLevels() {
    this.levelsContainer.innerHTML = Object.keys(levels)
      .map(levelNumber => {
        const isLocked = +levelNumber - 1 > Store.content.levelsCompleted;

        return `
          <button class="btn btn--level ${isLocked ? "btn--level-locked" : ""}" data-level=${levelNumber}>
            ${levelNumber}
            ${isLocked ? '<img src="/img/ui/lock.svg" alt="locked">' : ""}
          </button>`;
      })
      .join("");
  }
}
