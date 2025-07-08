import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ChipType } from "../../nodes";

export type SidebarType = "DEFAULT" | "CHIPS" | ChipType;

export const SidebarSlice = createSlice({
	name: "sidebar",
	initialState: "DEFAULT" as SidebarType,
	reducers: {
		setSidebar: (_, action: PayloadAction<SidebarType>) => {
			return action.payload;
		},
		toggle: (state, action: PayloadAction<SidebarType>) => {
      return state === action.payload ? "DEFAULT" : action.payload;
		},
	},
});

