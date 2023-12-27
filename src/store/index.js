import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./slices/messageSlice";
import { uiReducer } from "./slices/uiSlice";

export const store = configureStore({
    reducer:{
        message: messageReducer,
        ui: uiReducer
    }
})