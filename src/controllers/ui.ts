import {
  createMachine,
  State,
  interpret,
  ResolveTypegenMeta,
  TypegenDisabled,
  BaseActionObject,
  ServiceMap,
} from "xstate";

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

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const event = button.getAttribute("data-button") as UIEvent["type"];
        button.blur();
        this.handleEvent({ type: event });
      });
    });
  }
  private handleEvent(event: UIEvent) {
    this.prevState = this.interpreter.getSnapshot();
    this.interpreter.send(event);
    const nextState = this.interpreter.getSnapshot();
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
