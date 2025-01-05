import {
  configureStore,
  createListenerMiddleware,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { AnyChip, ChipId, ChipConnection, ChipPosition } from "../nodes";
import { RxMap } from "./rxjs";

type ClickPosition = { processorId: ChipId } & ChipPosition;

const initialState = {
  chips: {} as Record<ChipId, AnyChip>,
  connections: new Array<ChipConnection>(),
  lastClickedPosition: null as ClickPosition | null,
};

export const motherboardSlice = createSlice({
  name: "motherboard",
  initialState,
  reducers: {
    addChip: (state, action: PayloadAction<AnyChip>) => {
      state.chips[action.payload.id] = action.payload;
    },
    removeChip: (state, action: PayloadAction<ChipId>) => {
      delete state.chips[action.payload];

      state.connections = state.connections.filter(
        (connection) =>
          connection.input.chipId !== action.payload &&
          connection.output.chipId !== action.payload,
      );
    },
    addConnection: (state, action: PayloadAction<ChipConnection>) => {
      const previousConnectionIndex = state.connections.findIndex(
        (connection) =>
          connection.input.inputId === action.payload.input.inputId,
      );

      if (previousConnectionIndex === -1) {
        state.connections.push(action.payload);
      } else {
        state.connections[previousConnectionIndex] = action.payload;
      }
    },
    removeConnection: (state, action: PayloadAction<ChipConnection>) => {
      state.connections = state.connections.filter(
        (connection) =>
          connection.input.inputId !== action.payload.input.inputId,
      );
    },
    moveChip: (
      state,
      action: PayloadAction<ChipPosition & { chipId: ChipId }>,
    ) => {
      const chip = state.chips[action.payload.chipId];

      if (chip) {
        chip.position.x = action.payload.x;
        chip.position.y = action.payload.y;
      }
    },
    changeChip: (
      state,
      action: PayloadAction<Partial<AnyChip> & { id: ChipId }>,
    ) => {
      const chip = state.chips[action.payload.id];

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
      const chip = state.chips[action.payload.chipId];

      if (chip) {
        chip.name = action.payload.name;
      }
    },
    updateLastClickedPosition: (
      state,
      payload: PayloadAction<ClickPosition | null>,
    ) => {
      state.lastClickedPosition = payload.payload;
    },
  },
});

type UndoAction = PayloadAction<unknown>;

const undoSlice = createSlice({
  name: "undoSlice",
  initialState: new Array<UndoAction>(),
  reducers: {
    addStep: (state, action: PayloadAction<UndoAction>) => {
      return state.concat(action.payload);
    },
  },
});

export type SidebarType = "CLOSED" | "CHIPS" | "BATTERY_CHIP";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    value: "CLOSED" as SidebarType,
  },
  reducers: {
    close: (state) => {
      state.value = "CLOSED";
    },
    setSidebar: (state, action: PayloadAction<SidebarType>) => {
      state.value = action.payload;
    },
    toggle: (state, action: PayloadAction<SidebarType>) => {
      if (state.value === action.payload) {
        state.value = "CLOSED";
      } else {
        state.value = action.payload;
      }
    },
  },
});

const listener = createListenerMiddleware();
const startListening = listener.startListening.withTypes<
  RootState,
  AppDispatch
>();

startListening({
  actionCreator: motherboardSlice.actions.addChip,
  effect: (action, _listenerApi) => {
    RxMap.addChip(action.payload);
  },
});

startListening({
  actionCreator: motherboardSlice.actions.removeChip,
  effect: (action) => {
    RxMap.removeChip(action.payload);
  },
});

startListening({
  actionCreator: motherboardSlice.actions.changeChip,
  effect: (action) => {
    const chip = RxMap.getChipById(action.payload.id);

    if (chip?.onChipChange) {
      chip.onChipChange(action.payload);
    }
  },
});

startListening({
  actionCreator: motherboardSlice.actions.addConnection,
  effect: (action) => {
    const output = RxMap.getRxOutput(action.payload.output);
    const input = RxMap.getRxInput(action.payload.input);
    const inputChip = RxMap.getChipById(action.payload.input.chipId);

    input.subscribeToOutput(output);
    inputChip.register?.();
  },
});

startListening({
  actionCreator: motherboardSlice.actions.removeConnection,
  effect: (action) => {
    const input = RxMap.getRxInput(action.payload.input);
    input.unsubscribe();
  },
});

export const store = configureStore({
  reducer: {
    motherboard: motherboardSlice.reducer,
    undo: undoSlice.reducer,
    sidebar: sidebarSlice.reducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listener.middleware),
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const Actions = motherboardSlice.actions;
export const SidebarActions = sidebarSlice.actions;
