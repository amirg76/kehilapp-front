import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./slices/messageSlice";
import { uiReducer } from "./slices/uiSlice";
import { userReducer } from "./slices/user-slice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    ui: uiReducer,
    user: userReducer,
  },
});
