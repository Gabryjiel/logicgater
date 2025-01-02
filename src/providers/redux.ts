import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { AnyChip, ChipId, ChipConnection, ChipPosition } from "../nodes";

type ClickPosition = { processorId: ChipId } & ChipPosition;

const initialState = {
  chips: {} as Record<ChipId, AnyChip>,
  connections: new Array<ChipConnection>(),
  isSidebarOpen: false,
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
    moveChip: (
      state,
      action: PayloadAction<ChipPosition & { chipId: ChipId }>,
    ) => {
      if (state.chips[action.payload.chipId] === undefined) {
        return;
      }

      state.chips[action.payload.chipId].position.x = action.payload.x;
      state.chips[action.payload.chipId].position.y = action.payload.y;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
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

export const store = configureStore({
  reducer: {
    motherboard: motherboardSlice.reducer,
    undo: undoSlice.reducer,
  },
  devTools: true,
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const Actions = motherboardSlice.actions;
