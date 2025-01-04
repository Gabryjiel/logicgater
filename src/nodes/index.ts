declare const _brand: unique symbol;
type Branded<Type, Brand> = Type & { readonly [_brand]: Brand };

export type AnyChip =
  | ProcessorChip
  | BatteryChip
  | AndGateChip
  | TimerChip
  | LightChip;

export type ChipType = AnyChip["type"];

export type ChipId = Branded<string, "ChipId">;
export type ChipInputId = Branded<string, "ChipInput">;
export type ChipOutputId = Branded<string, "ChipOutput">;
export type ChipInputPlacement = "LEFT" | "BOTTOM";
export type ChipInput = { inputId: ChipInputId; placement: ChipInputPlacement };
export type ChipOutput = {
  outputId: ChipOutputId;
  placement: "RIGHT";
  value: number;
};

export type ChipConnection = {
  input: { chipId: ChipId; inputId: ChipInputId };
  output: { chipId: ChipId; outputId: ChipOutputId };
};

export type ChipPosition = { x: number; y: number };

export type BasicChip = {
  id: ChipId;
  name: string;
  position: ChipPosition;
  outputs: ChipOutput[];
  inputs: ChipInput[];
};

export type ProcessorSubchip = { chipId: ChipId; type: ChipType };

export type ProcessorChip = BasicChip & {
  type: "PROCESSOR";
  chips: ProcessorSubchip[];
  connections: ChipConnection[];
  size: { width: number; height: number };
};

export type BatteryChip = BasicChip & {
  type: "BATTERY";
  value: number;
  outputs: [ChipOutput];
  inputs: [];
};

export type AndGateChip = BasicChip & {
  type: "AND_GATE";
  outputs: [ChipOutput];
};

export type TimerChip = BasicChip & {
  type: "TIMER";
  durationMs: number;
  inputs: [ChipInput, ChipInput];
  outputs: [ChipOutput];
};

export type LightChip = BasicChip & {
  value: number;
  type: "LIGHT";
  outputs: [];
  inputs: [ChipInput];
};

let chipCounter = 0;

let positionX = 0;

export const chipFactory = {
  createBasicChip(
    type: ChipType,
    config?: { position?: ChipPosition },
  ): BasicChip {
    return {
      id: `${type}_${++chipCounter}` as ChipId,
      name: `${type} ${chipCounter}`,
      position: config?.position ?? { x: ++positionX, y: 0 },
      outputs: [],
      inputs: [],
    };
  },
  createOutput(chipId: ChipId, num: number, value?: number): ChipOutput {
    return {
      outputId: `${chipId}_OUTPUT_${num}` as ChipOutputId,
      placement: "RIGHT",
      value: value ?? 0,
    };
  },
  createInput(
    chipId: ChipId,
    num: number,
    placement: ChipInputPlacement,
  ): ChipInput {
    return { inputId: `${chipId}_INPUT_${num}` as ChipInputId, placement };
  },
  createProcessor(config?: { position: ChipPosition }): ProcessorChip {
    return {
      ...this.createBasicChip("PROCESSOR", config),
      type: "PROCESSOR",
      chips: [],
      connections: [],
      size: { width: 20, height: 14 },
    };
  },
  createBattery(config?: {
    power?: number;
    position?: ChipPosition;
  }): BatteryChip {
    const basicChip = this.createBasicChip("BATTERY", {
      position: config?.position,
    });

    return {
      ...basicChip,
      name: `Battery ${chipCounter}`,
      type: "BATTERY",
      inputs: [],
      value: config?.power ?? 100,
      outputs: [this.createOutput(basicChip.id, 1, config?.power ?? 100)],
    };
  },
  createAndGate(config?: { position?: ChipPosition }): AndGateChip {
    const basicChip = this.createBasicChip("AND_GATE", config);
    return {
      ...basicChip,
      type: "AND_GATE",
      inputs: [
        this.createInput(basicChip.id, 1, "LEFT"),
        this.createInput(basicChip.id, 2, "LEFT"),
      ],
      outputs: [this.createOutput(basicChip.id, 1)],
    };
  },
  createTimer(config?: {
    durationMs?: number;
    position?: ChipPosition;
  }): TimerChip {
    const basicChip = this.createBasicChip("TIMER", {
      position: config?.position,
    });
    return {
      ...basicChip,
      type: "TIMER",
      durationMs: config?.durationMs ?? 1000,
      inputs: [
        this.createInput(basicChip.id, 1, "LEFT"),
        this.createInput(basicChip.id, 2, "BOTTOM"),
      ],
      outputs: [this.createOutput(basicChip.id, 1)],
    };
  },
  createLight(config?: { position: ChipPosition }): LightChip {
    const basicChip = this.createBasicChip("LIGHT", config);

    return {
      ...basicChip,
      type: "LIGHT",
      outputs: [],
      inputs: [this.createInput(basicChip.id, 1, "LEFT")],
      value: 0,
    };
  },
  create(chipType: string, config?: { position: ChipPosition }): AnyChip {
    switch (chipType as ChipType) {
      case "BATTERY":
        return this.createBattery(config);
      case "PROCESSOR":
        return this.createProcessor(config);
      case "AND_GATE":
        return this.createAndGate(config);
      case "TIMER":
        return this.createTimer(config);
      case "LIGHT":
        return this.createLight(config);
      default:
        throw new Error(`Chip type not found: ${chipType}`);
    }
  },
};
