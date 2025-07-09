import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChipId, Position } from "../../nodes";

export type MarkerState =
  | { status: "idle"; processorBoardId: ChipId; position: Position }
  | { status: "placed"; processorBoardId: ChipId; position: Position }
  | {
    status: "holding";
    processorBoardId: ChipId;
    position: Position;
    item: ChipId;
  };

export const MarkerSlice = createSlice({
  name: "marker",
  initialState: {
    status: "idle",
    processorBoardId: "motherboard" as ChipId,
    position: { x: 0, y: 0 },
  } satisfies MarkerState as MarkerState,
  reducers: {
    moveMarkerTo: (
      _state,
      action: PayloadAction<{ position: Position; processorBoardId: ChipId }>,
    ) => {
      return {
        status: "placed",
        position: action.payload.position,
        processorBoardId: action.payload.processorBoardId,
      };
    },

    moveMarkerUp: (state) => {
      if ("position" in state && state.position.y > 0) {
        return {
          ...state,
          position: { x: state.position.x, y: state.position.y - 1 },
        };
      }
    },

    moveMarkerDown: (state) => {
      if ("position" in state && state.position.y < 100) {
        state.position.y++;
      }
    },

    moveMarkerLeft: (state) => {
      if ("position" in state && state.position.x > 0) {
        state.position.x--;
      }
    },

    moveMarkerRight: (state) => {
      if ("position" in state && state.position.x < 100) {
        state.position.x++;
      }
    },

    blurMarker: (state) => ({
        status: "idle",
        position: state.position,
        processorBoardId: state.processorBoardId,
    }),

    focusMarker: (state) => ({
      status: 'placed',
      position: state.position,
      processorBoardId: state.processorBoardId,
    }),

    holdWithMarker: (state, action: PayloadAction<ChipId>) => {
      if (state.status !== "placed") {
        return state;
      }

      return {
        status: "holding",
        position: state.position,
        item: action.payload,
        processorBoardId: state.processorBoardId,
      };
    },

    releaseFromMarker: (state) => {
      if (state.status !== "holding") {
        return state;
      }

      return {
        status: "placed",
        position: state.position,
        processorBoardId: state.processorBoardId,
      };
    },
  },
});

export const { reducer: MarkerReducer } = MarkerSlice;
export const {
  blurMarker,
  focusMarker,
  holdWithMarker,
  moveMarkerDown,
  moveMarkerLeft,
  moveMarkerRight,
  moveMarkerTo,
  moveMarkerUp,
  releaseFromMarker,
} = MarkerSlice.actions;
