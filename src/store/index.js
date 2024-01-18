import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./slices/messageSlice";
import { uiReducer } from "./slices/uiSlice";
import { userReducer } from "./slices/userSlice";
import { categoryReducer } from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    category: categoryReducer,
    ui: uiReducer,
    user: userReducer,
  },
});
