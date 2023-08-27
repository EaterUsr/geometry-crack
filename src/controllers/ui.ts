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
  private readonly jumpsLeftContainer = document.querySelector("#jumps-left")!;
  private events = new EventList();
  onStartJump = () => {};
  onRemoveJump = () => {};

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

    this.interpreter.start();
    this.prevState = this.interpreter.getSnapshot();
    this.render(this.interpreter.getSnapshot());

    const buttons = document.querySelectorAll<HTMLElement>("[data-button]");
    const clickOverlay = document.querySelector("#click-overlay") as HTMLElement;

    buttons.forEach(button => {
      this.events.add(
        "state buttons",
        "click",
        () => {
          const event = button.getAttribute("data-button") as UIEvent["type"];
          button.blur();
          this.handleEvent({ type: event });
        },
        button
      );
    });
    this.events.enable("state buttons");
    this.events.add(
      "jump",
      "keydown",
      e => {
        const { key } = e as KeyboardEvent;
        if (key === " " || key === "ArrowUp") {
          this.onStartJump();
          this.onRemoveJump();
        }
      },
      document.body
    );

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      this.events.add("jump", "touchstart", () => this.onStartJump(), clickOverlay);
      this.events.add("jump", "touchend", () => this.onRemoveJump(), clickOverlay);
    } else {
      this.events.add(
        "jump",
        "click",
        () => {
          this.onStartJump();
          this.onRemoveJump();
        },
        clickOverlay
      );
    }

    this.events.add("restart", "click", () => this.handleEvent({ type: "RESTART" }), clickOverlay);
    this.events.add(
      "restart",
      "keydown",
      e => {
        const { key } = e as KeyboardEvent;
        if (key === " " || key === "ArrowUp") this.handleEvent({ type: "RESTART" });
      },
      document.body
    );
  }
  private handleEvent(event: UIEvent) {
    this.prevState = this.interpreter.getSnapshot();
    switch (this.prevState.value) {
      case "play":
        this.events.disable("jump");
        break;
      case "gameOver":
        this.events.disable("restart");
        break;
    }
    this.interpreter.send(event);
    const nextState = this.interpreter.getSnapshot();
    switch (nextState.value) {
      case "play":
        this.events.enable("jump");
        break;
      case "gameOver":
        this.events.enable("restart");
        break;
    }
    this.render(nextState);
  }
  private render(state: UIState) {
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
    this.handleEvent({ type: "DIE" });
  }
  displayJumpsLeft(jumpsLeft: number) {
    this.jumpsLeftContainer.textContent = `jumps left: ${jumpsLeft}`;
  }
}
