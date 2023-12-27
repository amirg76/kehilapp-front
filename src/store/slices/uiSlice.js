import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        //TODO: we need to choose if we want to use toggle or open/close actions.
        openModal(state) {
            state.isModalOpen = true
        },
        closeModal(state) {
            state.isModalOpen = false
        },
        toggleModal(state) {
            state.isModalOpen = !state.isModalOpen
        }
    }
})

export const uiReducer = uiSlice.reducer
export const uiActions = uiSlice.actions