declare const _brand: unique symbol;
type Branded<Type, Brand> = Type & { readonly [_brand]: Brand };

export type AnyChip =
  | ProcessorChip
  | BatteryChip
  | AndGateChip
  | TimerChip
  | LightChip;

export type ChipType = AnyChip["type"];

type ChipConnection = {
  input: { chipId: string; input: ChipInput };
  output: { chipId: string; output: ChipOutput };
};

type ChipInput = Branded<string, "ChipInput">;
type ChipOutput = Branded<string, "ChipOutput">;

export type ChipPosition = { x: number; y: number };

export type BasicChip = {
  id: string;
  name: string;
  position: ChipPosition;
  outputs: number;
  inputs: number;
};

export type ProcessorSubchip = { chipId: string; type: ChipType };

export type ProcessorChip = BasicChip & {
  type: "PROCESSOR";
  chips: ProcessorSubchip[];
  connections: ChipConnection[];
  size: { width: number; height: number };
};

export type BatteryChip = BasicChip & {
  type: "BATTERY";
  power: number;
};

type AndGateChip = BasicChip & {
  type: "AND_GATE";
};

type TimerChip = BasicChip & {
  type: "TIMER";
  durationMs: number;
};

export type LightChip = BasicChip & {
  type: "LIGHT";
};

let chipCounter = 0;

let positionX = 0;

export const chipFactory = {
  createBasicChip(type: ChipType): BasicChip {
    return {
      id: `${type}_${++chipCounter}`,
      name: `${type} ${chipCounter}`,
      position: { x: ++positionX, y: 0 },
      outputs: 0,
      inputs: 0,
    };
  },
  createProcessor(): ProcessorChip {
    return {
      ...this.createBasicChip("PROCESSOR"),
      type: "PROCESSOR",
      chips: [],
      connections: [],
      size: { width: 20, height: 14 },
    };
  },
  createBattery(config?: { power?: number }): BatteryChip {
    return {
      ...this.createBasicChip("BATTERY"),
      name: `Battery ${chipCounter}`,
      type: "BATTERY",
      power: config?.power ?? 100,
      outputs: 1,
    };
  },
  createAndGate(): AndGateChip {
    return {
      ...this.createBasicChip("AND_GATE"),
      type: "AND_GATE",
      inputs: 2,
      outputs: 1,
    };
  },
  createTimer(config?: { durationMs?: number }): TimerChip {
    return {
      ...this.createBasicChip("TIMER"),
      type: "TIMER",
      durationMs: config?.durationMs ?? 1000,
      inputs: 1,
      outputs: 1,
    };
  },
  createLight(): LightChip {
    return {
      ...this.createBasicChip("LIGHT"),
      type: "LIGHT",
      inputs: 1,
    };
  },
  create(chipType: string): AnyChip {
    switch (chipType as ChipType) {
      case "BATTERY":
        return this.createBattery();
      case "PROCESSOR":
        return this.createProcessor();
      case "AND_GATE":
        return this.createAndGate();
      case "TIMER":
        return this.createTimer();
      case "LIGHT":
        return this.createLight();
      default:
        throw new Error(`Chip type not found: ${chipType}`);
    }
  },
};
