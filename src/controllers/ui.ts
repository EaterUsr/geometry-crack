import {
  createMachine,
  State,
  interpret,
  ResolveTypegenMeta,
  TypegenDisabled,
  BaseActionObject,
  ServiceMap,
} from "xstate";
import { EventList } from "./events";
import { config } from "@config";

export type UIEvent =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "DIE" }
  | { type: "RESTART" }
  | { type: "BACK" };

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
  private pages: Record<UITypestate["value"], HTMLElement | null>;
  private readonly jumpsLeftContainer = document.querySelector<HTMLDivElement>("#jumps-left")!;
  private readonly scoreContainer = document.querySelector("#score")!;
  private readonly highestScoreContainer = document.querySelector("#highest-score")!;
  private readonly newRecord = document.querySelector("#new-record")!;
  private events = new EventList<"state buttons" | "jump" | "restart">();
  private isSpaceKeyDisabled = false;
  onJump = () => {};

  constructor() {
    const pagesName: UITypestate["value"][] = ["menu", "gameOver", "paused", "play"];
    this.pages = {
      menu: null,
      gameOver: null,
      paused: null,
      play: null,
    };

    pagesName.forEach((pageName: UITypestate["value"]) => {
      this.pages[pageName] = document.querySelector(`#${pageName}`) as HTMLElement;
    });

    const buttons = document.querySelectorAll<HTMLElement>("[data-button]");
    const clickOverlay = document.querySelector("#click-overlay") as HTMLElement;
    const gameOverClickOverlay = document.querySelector(".game-over__click-overlay") as HTMLElement;

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

    if (/Mobi|Android/i.test(navigator.userAgent)) {
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

    this.interpreter.start();
    this.prevState = this.interpreter.getSnapshot();
    this.render(this.interpreter.getSnapshot());
  }
  private handleEvent(event: UIEvent) {
    this.prevState = this.interpreter.getSnapshot();
    this.interpreter.send(event);
    const nextState = this.interpreter.getSnapshot();
    this.render(nextState);
    if (nextState.value === this.prevState.value) return;
    switch (this.prevState.value) {
      case "play":
        this.events.disable("jump");
        break;
      case "gameOver":
        this.events.disable("restart");
        this.newRecord.classList.remove("show");
        break;
    }
    switch (nextState.value) {
      case "play":
        this.events.enable("jump");
        break;
      case "gameOver":
        setTimeout(() => {
          this.events.enable("restart");
        }, config.delayBeforeRestart);
        break;
    }
  }
  private render(state: UIState) {
    const button = document.querySelector(`#${state.value} [data-button]`)!;
    button.setAttribute("tabindex", "0");
    (this.pages[state.value as UITypestate["value"]] as HTMLElement).style.setProperty("--opacity", "1");
    if (state.value !== this.prevState.value) {
      (this.pages[this.prevState.value as UITypestate["value"]] as HTMLElement).style.setProperty("--opacity", "0");
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
    this.scoreContainer.textContent = `score: ${score}`;
  }
  displayHighestScore(score: number) {
    this.highestScoreContainer.textContent = `HS: ${score}`;
  }
  displayNewRecord() {
    this.newRecord.classList.add("show");
  }
}
