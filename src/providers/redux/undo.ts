import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type UndoAction = PayloadAction<unknown>;

export const UndoSlice = createSlice({
	name: "undoSlice",
	initialState: new Array<UndoAction>(),
	reducers: {
		addStep: (state, action: PayloadAction<UndoAction>) => {
			return state.concat(action.payload);
		},
	},
});


