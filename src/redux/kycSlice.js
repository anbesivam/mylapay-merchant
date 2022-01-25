import { createSlice } from "@reduxjs/toolkit";

export const kycSlice = createSlice({
  name: "kyc",
  initialState: {
    activeStep: 1,
  },
  reducers: {
    handleNext: (state) => {
      state.activeStep = state.activeStep + 1;
    },
    handleBack: (state) => {
      state.activeStep = state.activeStep - 1;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleBack, handleNext, setActiveStep } = kycSlice.actions;

export default kycSlice.reducer;
