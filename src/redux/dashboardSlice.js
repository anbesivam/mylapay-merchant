import { createSlice } from "@reduxjs/toolkit";

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    isSidebarOpen: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    // handleBack: (state) => {
    //   state.activeStep = state.activeStep - 1;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSidebar } = dashboardSlice.actions;

export default dashboardSlice.reducer;
