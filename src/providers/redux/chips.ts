import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { AnyChip, ChipId, Position } from "../../nodes";

export const ChipSlice = createSlice({
	name: "chips",
	initialState: {} as Record<ChipId, AnyChip>,
	reducers: {
		addChip: (state, action: PayloadAction<AnyChip>) => {
			state[action.payload.id] = action.payload;
		},
		removeChip: (state, action: PayloadAction<ChipId>) => {
			delete state[action.payload];
		},
		moveChip: (
			state,
			action: PayloadAction<Position & { chipId: ChipId }>,
		) => {
			const chip = state[action.payload.chipId];

			if (chip) {
				chip.position.x = action.payload.x;
				chip.position.y = action.payload.y;
			}
		},
		changeChip: (
			state,
			action: PayloadAction<Partial<AnyChip> & { id: ChipId }>,
		) => {
			const chip = state[action.payload.id];

			if (chip) {
				if (chip.type === "BATTERY" && action.payload.type === "BATTERY") {
					chip.value = action.payload.value ?? chip.value;
				}
			}
		},
		changeChipName: (
			state,
			action: PayloadAction<{ chipId: ChipId; name: string }>,
		) => {
			const chip = state[action.payload.chipId];

			if (chip) {
				chip.name = action.payload.name;
			}
		},
	},
});
