import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { currentUser: null, isAuthenticated: false },
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    // Merges fresh fields (e.g. from GET /api/auth/me) into the stored user's
    // `.user` object without touching the sibling `token`/`csrfToken` fields
    // LoginForm also wrote to this same shape. Only meaningful once logged in.
    updateUser: (state, action) => {
      if (!state.currentUser) return;
      state.currentUser = {
        ...state.currentUser,
        user: { ...state.currentUser.user, ...action.payload },
      };
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

// The whole login response is stored (see LoginForm.jsx), so the actual user
// fields live under `.user` — confirmed by reading LoginForm's
// `sessionStorage.setItem("loggedInUser", JSON.stringify(user))`, where `user`
// is the full axios response body `{ token, csrfToken, user: {...} }`.
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// The signed-in person's own fields ({ id, name, email, role, approved } — the
// `user` object POST /api/auth/login returns), or undefined when signed out.
//
// Exists so no component has to know that `currentUser` is the whole login
// response and not the user. The header did read `currentUser?.name` directly
// and rendered "שלום !" for every signed-in member, because that level holds
// `token`/`csrfToken`/`user` and no `name`. One selector means the next
// component to need the name cannot repeat that.
export const selectCurrentUser = (state) => state.auth.currentUser?.user;

// Mirrors the server's canSeeMembersContent (messagesController.js): approved
// OR admin. Both signals must come from the freshest data we have (post /me
// merge), which is exactly what `updateUser` keeps current.
export const selectCanSeeMembersContent = (state) => {
  const user = state.auth.currentUser?.user;
  if (!state.auth.isAuthenticated || !user) return false;
  return user.approved === true || user.role === "admin";
};

export default authSlice;
