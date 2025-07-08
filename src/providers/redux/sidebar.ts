import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChipId, ChipType } from "../../nodes";

export type SidebarType =
| { type: "CHIPS" }
| { type: ChipType, chipId: ChipId };

export const SidebarSlice = createSlice({
  name: "sidebar",
  initialState: null as null | SidebarType,
  reducers: {
    setSidebar: (_, action: PayloadAction<SidebarType>) => {
      return action.payload;
    },
    close: () => {
      return null;
    },
    toggle: (state, action: PayloadAction<SidebarType>) => {
      if (state !== null && state.type !== action.payload.type) {
        return action.payload;
      }

      return null;
    },
  },
});
