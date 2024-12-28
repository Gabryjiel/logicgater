import { PIXELS_PER_CHIP } from "../providers/constants";

export function calculateChipPositionFromBrowser(browserValue: number): number {
  return Math.trunc(browserValue / PIXELS_PER_CHIP);
}
