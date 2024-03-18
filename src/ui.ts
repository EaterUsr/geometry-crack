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
import { skins } from "./config/skins";
import { skinUrl } from "./utils/image";

export type UIEvent =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "DIE" }
  | { type: "RESTART" }
  | { type: "BACK" }
  | { type: "SHOP" };

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
      value: "shop";
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

  private events = new EventList<"state buttons" | "jump" | "restart" | "menu" | "shop">();
  private isSpaceKeyDisabled = false;

  private pages: Record<UITypestate["value"], HTMLElement>;
  private shopCurrentSkin = qs<HTMLImageElement>("#shop__current-skin");
  private shopSkins = qs("#shop__skins")!;
  onJump = () => {};
  onSkinUpdate: (skinName: SkinName) => void = () => {};

  constructor() {
    const pagesName: UITypestate["value"][] = ["menu", "gameOver", "paused", "play", "shop"];
    this.pages = {} as Record<UITypestate["value"], HTMLElement>;

    pagesName.forEach((pageName: UITypestate["value"]) => {
      this.pages[pageName] = qs(`#${pageName}`);
    });

    const buttons = qsa("[data-button]");
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

    this.events.enable("state buttons");
    this.events.add(
      "jump",
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
      this.events.add("jump", "touchstart", () => this.onJump(), clickOverlay);
    } else {
      this.events.add(
        "jump",
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
        const skin = skins.find(skin => skin.name === button.dataset.btnSkin) as Skin;

        if (skin.status === "owned") {
          skin.status = "equipped";
        }

        if (skin.status === "unbought") {
          skin.status = "equipped";
        }

        this.displayShop(skin.name);
        this.onSkinUpdate(skin.name);
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
        this.events.disable("jump");
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
        this.events.enable("jump");
        break;
      case "gameOver":
        setTimeout(() => {
          this.events.enable("restart");
        }, config.delayBeforeRestart);
        break;
      case "shop":
        this.events.enable("shop");
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

  displayShop(currentSkinName: SkinName) {
    const statusButton: Record<Skin["status"], string> = {
      owned: "equip",
      equipped: "used",
      unbought: "buy",
    };

    this.shopCurrentSkin.src = skinUrl(currentSkinName);

    if (this.shopSkins.innerHTML !== "") return;

    this.shopSkins.innerHTML = skins
      .filter(skin => skin.name !== "default")
      .map(skin => {
        return `
        <div class="skin-card">
          <span class="skin-card__price">${skin.price}
            <img src="/img/ui/crackcoin_icon.svg" />
          </span>
          <img class="skin-card__img" src=${skin.imgs[4].src} />
          <button class="skin-card__btn btn" data-btn-skin="${skin.name}">${statusButton[skin.status]}</button>
        </div>
`;
      })
      .join("");
  }
}
