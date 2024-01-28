import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./slices/messageSlice";
import { uiReducer } from "./slices/uiSlice";
import { userReducer } from "./slices/userSlice";
import { categoryReducer } from "./slices/categorySlice";
import { loadingReducer } from "./slices/loadingSlice";
import { pageLoadingReducer } from "./slices/pageLoadingSlice";
import { authReducer } from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    category: categoryReducer,
    loading: loadingReducer,
    pageLoading: pageLoadingReducer,
    ui: uiReducer,
    user: userReducer,
    auth: authReducer,
  },
});
