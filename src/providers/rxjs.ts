import {
  BehaviorSubject,
  type Observer,
  Subscription,
  combineLatest,
  map,
  of,
  tap,
} from "rxjs";
import type {
  AnyChip,
  ChipConnection,
  ChipId,
  ChipInput,
  ChipInputId,
  ChipOutput,
  ChipOutputId,
} from "../nodes";
import { Actions, store } from "./redux";

class ChipInternalMap {
  #chipMap: Map<ChipId, RxBaseChip>;

  constructor() {
    this.#chipMap = new Map();
  }

  getChipById(id: ChipId) {
    const chip = this.#chipMap.get(id);

    if (chip === undefined) {
      throw new Error(`[RxMap] Chip with id ${id} not found!`);
    }

    return chip;
  }

  addChip(chip: AnyChip) {
    if (this.#chipMap.has(chip.id)) {
      throw new Error(`Chip with id ${chip.id} already exists`);
    }

    const newRxChip: RxBaseChip = (() => {
      switch (chip.type) {
        case "LIGHT":
          return new RxChipLight(chip);
        case "BATTERY":
          return new RxChipBattery(chip);
        case "AND_GATE":
          return new Rx2ChipAndGate(chip);
        default:
          throw new Error(`Unknown chip type: ${chip.type}`);
      }
    })();

    this.#chipMap.set(chip.id, newRxChip);
    console.debug(`Chip with id ${chip.id} added`);
  }

  removeChip(chipId: ChipId) {
    if (!this.#chipMap.has(chipId)) {
      throw new Error(`Chip with id ${chipId} does not exist!`);
    }

    const chip = this.getChipById(chipId);
    chip.unregister();
    this.#chipMap.delete(chipId);
    console.debug(`Chip with id ${chipId} removed`);
  }

  getRxOutput({ chipId, outputId }: ChipConnection["output"]): RxChipOutput {
    const chip = this.getChipById(chipId);
    const output = chip.outputs.find((output) => output.outputId === outputId);

    if (output === undefined) {
      throw new Error(
        `[RxMap] Output ${outputId} in chip ${chipId} not found!`,
      );
    }

    return output;
  }

  getRxInput({ chipId, inputId }: ChipConnection["input"]): RxChipInput {
    const chip = this.getChipById(chipId);
    const input = chip.inputs.find((input) => input.inputId === inputId);

    if (input === undefined) {
      throw new Error(`[RxMap] input ${inputId} in chip ${chipId} not found!`);
    }

    return input;
  }
}

export const RxMap = new ChipInternalMap();

declare const window: {
  rxmap: ChipInternalMap;
} & Window;
window.rxmap = RxMap;

abstract class RxBaseChip {
  readonly chipId: ChipId;
  outputs: RxChipOutput[];
  inputs: RxChipInput[];
  private subscription: Subscription;

  constructor(chip: AnyChip) {
    this.chipId = chip.id;
    this.outputs = chip.outputs.map((output) => new RxChipOutput(output));
    this.inputs = chip.inputs.map(
      (input) => new RxChipInput(input, () => this.onChipChange?.(chip)),
    );
    this.subscription = Subscription.EMPTY;

    // this.outputs.forEach((output) => output.subscribeToSubject({
    //   next: (value) => store.dispatch({})
    // }))
  }

  getObservablesFromInputs() {
    return this.inputs.map((input) => input.getObservable() ?? of(0));
  }

  onConnectionChange() {
    this.subscription.unsubscribe();
    const newSubscription = this.register?.();

    if (newSubscription) {
      this.subscription = newSubscription;
    }
  }

  onChipChange?(chip: AnyChip): void;
  register?(): Subscription;
  unregister() {
    this.subscription.unsubscribe();
  }
}

export class RxChipBattery extends RxBaseChip {
  onChipChange(chip: AnyChip): void {
    if (chip.type === "BATTERY") {
      this.outputs[0]?.setNextValue(chip.value);
    }
  }
}

export class Rx2ChipAndGate extends RxBaseChip {
  register(): Subscription {
    const observables = this.getObservablesFromInputs();
    const combined = combineLatest(observables).pipe(
      map((value) => Math.min(...value)),
    );

    const output = this.outputs.at(0);

    if (output === undefined) {
      throw new Error("[RxMap] Output not found");
    }

    return combined.subscribe((value) => output.setNextValue(value));
  }
}

export class RxChipLight extends RxBaseChip {
  register(): Subscription {
    const observables = this.getObservablesFromInputs();
    const combined = combineLatest(observables).pipe(
      tap(console.log),
      map((x) => x.at(0)),
    );
    console.log("REGISTER");

    const chip = store.getState().motherboard.chips[this.chipId];
    if (chip?.type !== "LIGHT") {
      throw new Error(`Incorrent chip type for ${this.chipId}`);
    }

    return combined.subscribe((value) => {
      console.log(`Change (LIGHT) ${this.chipId} ${value}`);
      if (value !== undefined) {
        store.dispatch(Actions.changeChip({ ...chip, value }));
      }
    });
  }
}

// export class RxChipAndGate {
//   private output: RxChipOutput;
//   private inputs: RxChipInput[];
//   readonly chipId: ChipId;
//
//   constructor(chip: AndGateChip) {
//     this.chipId = chip.id;
//
//     this.output = new RxChipOutput(chip.outputs[0].outputId);
//     this.inputs = chip.inputs.map((input) => new RxChipInput(input.inputId));
//   }
//
//   register() {
//     const observables = this.inputs.map((input) => input.getObservable());
//     const combined = combineLatest(observables).pipe(
//       map((value) => Math.min(...value)),
//     );
//
//     return combined.subscribe(this.output.setNextValue);
//   }
// }

class RxChipOutput {
  public readonly outputId: ChipOutputId;
  private subject: BehaviorSubject<number>;

  constructor(output: ChipOutput) {
    this.outputId = output.outputId;
    this.subject = new BehaviorSubject(output.value);
  }

  setNextValue(value: number) {
    this.subject.next(value);
  }

  getCurrentValue() {
    return this.subject.getValue();
  }

  subscribeToSubject(observer: Partial<Observer<number>>) {
    return this.subject.subscribe(observer);
  }

  getObservable() {
    return this.subject.asObservable();
  }
}

class RxChipInput {
  public readonly inputId: ChipInputId;
  private subscription: Subscription;
  private connectedOutput: RxChipOutput | null;
  private callback: VoidFunction;

  constructor(input: ChipInput, callback?: VoidFunction) {
    this.inputId = input.inputId;
    this.subscription = Subscription.EMPTY;
    this.callback = callback ?? (() => null);
    this.connectedOutput = null;
  }

  unsubscribe() {
    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  subscribeToOutput(output: RxChipOutput) {
    this.subscription = output.subscribeToSubject({
      next: this.callback,
      complete: this.unsubscribe,
      error: console.error,
    });
    this.connectedOutput = output;
  }

  getObservable() {
    return this.connectedOutput?.getObservable() ?? of(0);
  }
}
