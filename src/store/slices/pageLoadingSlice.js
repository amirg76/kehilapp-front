import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
};

const pageLoadingSlice = createSlice({
  name: "pageLoading",
  initialState,
  reducers: {
    toggle(state) {
      state.active = !state.active;
    },
  },
});

export const pageLoadingReducer = pageLoadingSlice.reducer;
export const pageLoadingActions = pageLoadingSlice.actions;
