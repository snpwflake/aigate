declare global {
  interface IntersectionObserverEntry {
    target: Element;
    isIntersecting: boolean;
    intersectionRatio: number;
  }
}

export {};
