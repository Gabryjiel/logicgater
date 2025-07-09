import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { ChipSlice } from "./redux/chips";
import { ConnectionSlice } from "./redux/connections";
import { MarkerReducer } from "./redux/marker";
import { SidebarSlice } from "./redux/sidebar";
import { UndoSlice } from "./redux/undo";
import { UtilsSlice } from "./redux/utils";
//
// const listener = createListenerMiddleware();
// const startListening = listener.startListening.withTypes<
// 	RootState,
// 	AppDispatch
// >();
//
// startListening({
// 	actionCreator: motherboardSlice.actions.addChip,
// 	effect: (action, _listenerApi) => {
// 		RxMap.addChip(action.payload);
// 	},
// });
//
// startListening({
// 	actionCreator: motherboardSlice.actions.removeChip,
// 	effect: (action) => {
// 		RxMap.removeChip(action.payload);
// 	},
// });
//
// startListening({
// 	actionCreator: motherboardSlice.actions.changeChip,
// 	effect: (action) => {
// 		const chip = RxMap.getChipById(action.payload.id);
//
// 		if (chip?.onChipChange) {
// 			chip.onChipChange(action.payload);
// 		}
// 	},
// });
//
// startListening({
// 	actionCreator: motherboardSlice.actions.addConnection,
// 	effect: (action) => {
// 		const output = RxMap.getRxOutput(action.payload.output);
// 		const input = RxMap.getRxInput(action.payload.input);
// 		const inputChip = RxMap.getChipById(action.payload.input.chipId);
//
// 		input.subscribeToOutput(output);
// 		inputChip.register?.();
// 	},
// });
//
// startListening({
// 	actionCreator: motherboardSlice.actions.removeConnection,
// 	effect: (action) => {
// 		const input = RxMap.getRxInput(action.payload.input);
// 		input.unsubscribe();
// 	},
// });
//
export const store = configureStore({
  reducer: {
    chips: ChipSlice.reducer,
    connections: ConnectionSlice.reducer,
    undo: UndoSlice.reducer,
    utils: UtilsSlice.reducer,
    sidebar: SidebarSlice.reducer,
    marker: MarkerReducer,
  },
  devTools: true,
  // middleware: (getDefaultMiddleware) =>
  // getDefaultMiddleware().prepend(listener.middleware),
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
