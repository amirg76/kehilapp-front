import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    toggle(state) {
      state.active = !state.active;
    },
  },
});

export const loadingReducer = loadingSlice.reducer;
export const loadingActions = loadingSlice.actions;
