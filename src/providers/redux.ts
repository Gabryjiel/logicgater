import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Chip } from "../nodes/chip";
import { ProcessorChip } from "../nodes/processor";
import { useDispatch, useSelector } from "react-redux";

export const motherboardSlice = createSlice({
	name: 'motherboard',
	initialState: {
		processor: new ProcessorChip({
			id: 'MOTHERBOARD',
		}),
	},
	reducers: {
		addChip: (state, action: PayloadAction<Chip>) => {
			state.processor.chips.push(action.payload);
		}
	}
});

export const store = configureStore({
	reducer: {
		motherboard: motherboardSlice.reducer,
	},
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
