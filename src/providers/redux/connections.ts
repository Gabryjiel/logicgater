import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ChipConnection } from "../../nodes";

export const ConnectionSlice = createSlice({
	name: "connections",
	initialState: new Array<ChipConnection>(),
	reducers: {
		addConnection: (state, action: PayloadAction<ChipConnection>) => {
			const previousConnectionIndex = state.findIndex(
				(connection) =>
					connection.input.inputId === action.payload.input.inputId,
			);

			if (previousConnectionIndex === -1) {
				state.push(action.payload);
			} else {
				state[previousConnectionIndex] = action.payload;
			}
		},
		removeConnection: (state, action: PayloadAction<ChipConnection>) => {
			return state.filter(
				(connection) =>
					connection.input.inputId !== action.payload.input.inputId,
			);
		},
	},
});

