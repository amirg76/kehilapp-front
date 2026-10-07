import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Explicit open/close only. A toggle reads the current state, and two
        // callers (header button + drawer backdrop) can fire for one gesture,
        // which would flip the drawer twice and leave it where it started.
        openModal(state) {
            state.isModalOpen = true
        },
        closeModal(state) {
            state.isModalOpen = false
        }
    }
})

export const uiReducer = uiSlice.reducer
export const uiActions = uiSlice.actions