import { ContentItemGroup } from "./ToolboxTypes";

export const GatesGroups: ContentItemGroup[] = [
  {
    title: "Logic gates",
    items: [
      { label: "AND Gate", name: "and_gate", icon: "^" },
      { label: "OR Gate", name: "or_gate", icon: "v" },
      { label: "XOR Gate", name: "xor_gate", icon: "xor" },
      { label: "NOT Gate", name: "not_gate", icon: "~" },
      { label: "NAND Gate", name: "nand_gate", icon: "->" },
      { label: "NOR Gate", name: "nor_gate", icon: "↓" },
    ],
  },
  {
    title: "Math logic",
    items: [
      { label: "Implication", name: "implication_math", icon: "=>" },
      { label: "Equivalence", name: "equivalnce_math", icon: "<=>" },
    ],
  },
  {
    title: "Utility",
    items: [
      { label: "Counter", name: "counter_utils", icon: "1,2,3" },
      { label: "Timer", name: "timer_utils", icon: "t" },
      { label: "Selector", name: "selector_utils", icon: ">" },
      { label: "Processor", name: "processor_utils", icon: "#" },
    ],
  },
  {
    title: "Flip-flops",
    items: [
      { label: "JK-MS", name: "jkms_ff", icon: "JK" },
      { label: "RS", name: "rs_ff", icon: "RS" },
      { label: "D", name: "d_ff", icon: "D" },
      { label: "T", name: "t_ff", icon: "T" },
    ],
  },
];

export const SourcesGroups: ContentItemGroup[] = [
  {
    title: "Sources",
    items: [
      { label: "Battery", name: "battery_source", icon: "#" },
      { label: "Switch", name: "switch_source", icon: "0:1" },
      { label: "Button", name: "button_source", icon: "B" },
    ],
  },
];

export const OutputGroups: ContentItemGroup[] = [
  {
    title: "Outputs",
    items: [{ label: "LED", name: "battery_source", icon: "*" }],
  },
];
