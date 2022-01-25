import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userData: null,
    userDetails: null,
  },
  reducers: {
    logOut: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.userDetails = null;
    },
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logOut, setAuth, setUserData, setUserDetails } =
  authSlice.actions;

export default authSlice.reducer;
