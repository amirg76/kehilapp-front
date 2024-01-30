import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUsers(state, action) {
      state.users = action.payload;
    },
    saveUser(state, action) {
      const { newUser } = action.payload;
      state.users.push(newUser);
    },
    updateUser(state, action) {
      const { userToSave } = action.payload;
      state.users = state.users.map((user) =>
        user._id === userToSave._id ? userToSave : user
      );
    },
    removeUser(state, action) {
      state.users = state.users.filter(
        (user) => user._id !== action.payload.userId
      );
    },
  },
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
