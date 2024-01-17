export function qs<TElement extends HTMLElement>(selector: Selector) {
  return document.querySelector<TElement>(selector)!;
}

export function qsa(selector: Exclude<Selector, `#${string}`>) {
  return document.querySelectorAll<HTMLElement>(selector)!;
}
