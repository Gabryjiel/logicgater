import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  type AnyChip,
  chipFactory,
  type ChipPosition,
  ProcessorSubchip,
} from "../nodes";
import { subjectMap, subscriberMap } from "./rxjs";
import { BehaviorSubject, type Observer } from "rxjs";

const initialStateForMotherboardSlice = chipFactory.createProcessor();

export const motherboardSlice = createSlice({
  name: "motherboard",
  initialState: initialStateForMotherboardSlice,
  reducers: {
    addChip: (state, action: PayloadAction<ProcessorSubchip>) => {
      state.chips.push(action.payload);
      store.dispatch(undoSlice.actions.addStep(action));
    },
    moveChip: (state, action: PayloadAction<ChipPosition & { id: string }>) => {
      const chipIndex = state.chips.findIndex(
        (chip) => chip.chipId === action.payload.id,
      );

      if (chipIndex === -1) {
        return;
      }

      state.chips[chipIndex].position.x = action.payload.x;
      state.chips[chipIndex].position.y = action.payload.y;
    },
    addConnection: (
      state,
      action: PayloadAction<{ outputId: string; inputId: string }>,
    ) => {
      const subject = new BehaviorSubject(0);
      const subscriber: Observer<number> = {
        next: (value) => value,
        complete: () => null,
        error: () => null,
      };
      subjectMap.set(action.payload.outputId, subject);
      subscriberMap.set(action.payload.inputId, subscriber);
      console.log(subjectMap);
    },
  },
});

type UndoAction = PayloadAction<any>;

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
