import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./slices/messageSlice";
import { uiReducer } from "./slices/uiSlice";
import { userReducer } from "./slices/userSlice";
import { categoryReducer } from "./slices/categorySlice";
import { loadingReducer } from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    category: categoryReducer,
    loading: loadingReducer,
    ui: uiReducer,
    user: userReducer,
  },
});
