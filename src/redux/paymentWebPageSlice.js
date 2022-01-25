import { createSlice } from "@reduxjs/toolkit";

export const paymentWebPageSlice = createSlice({
  name: "paymentWebPage",
  initialState: {
    webPageDetails: null,
    paymentPageDetails: [],
    paymentDetails: null,
  },
  reducers: {
    setWebPageDetails: (state, action) => {
      state.webPageDetails = action.payload;
    },
    setPaymentPageDetails: (state, action) => {
      state.paymentPageDetails = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWebPageDetails, setPaymentPageDetails, setPaymentDetails } =
  paymentWebPageSlice.actions;

export default paymentWebPageSlice.reducer;
