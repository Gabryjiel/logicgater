import { interval, type Observer, type Subject } from "rxjs";
import { useEffect, useRef } from "react";

export const subjectMap = new Map<string, Subject<number>>();
export const subscriberMap = new Map<string, Observer<number>>();

class ChipInternal {
  #id: string;

  constructor(id: string) {
    this.#id = id;
  }

  getId(): string {
    return this.#id;
  }
}

class ChipInternalMap {
  #chipMap: Map<string, ChipInternal>;

  constructor() {
    this.#chipMap = new Map();
  }

  getChipById(id: string): ChipInternal | undefined {
    return this.#chipMap.get(id);
  }
}

export const chipMap = new ChipInternalMap();

export function useTimer(callback: (x: number) => void, delayMs: number) {
  const savedCallback = useRef<(x: number) => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const subsription = interval(delayMs).subscribe(savedCallback.current);

    return subsription.unsubscribe;
  }, [delayMs]);
}
