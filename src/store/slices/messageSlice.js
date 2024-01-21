import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    filterBy: {
        latest: true,
        categoryId: "",
        searchTerm: ""
    }
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        loadMessages(state, action) {
            state.messages = action.payload
        },
        saveMessage(state, action) {
            const { newMessage } = action.payload
            state.messages.push(newMessage)
        },
        updateMessage(state, action) {
            const { messageToSave } = action.payload
            state.messages = state.messages.map((message) =>
                message._id === messageToSave._id ? messageToSave : message
            )
        },
        removeMessage(state, action) {
            state.messages = state.messages.filter(message => message._id !== action.payload.messageId)
        },
        setFilterBy(state, action) {
            state.filterBy = action.payload
        },
    }
})

export const messageReducer = messageSlice.reducer
export const messageActions = messageSlice.actions