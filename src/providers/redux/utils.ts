import type { ChipId, ChipPosition } from "../../nodes";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ClickPosition = { processorId: ChipId } & ChipPosition;

export const UtilsSlice = createSlice({
  name: 'utils',
  initialState: null as null | ClickPosition,
  reducers: {
    updateLastClickedPosition: (_, payload: PayloadAction<ClickPosition | null>) => {
			return payload.payload;
		},
  }
});
