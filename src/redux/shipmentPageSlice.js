import { createSlice } from "@reduxjs/toolkit";

export const shipmentPageSlide = createSlice({
  name: "shipmentPage",
  initialState: {
    productDetails: null,
    shipDetails: null,
    deliveryDetails: null,
    paymentDetails: null,
  },
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    setShipDetails: (state, action) => {
      state.shipDetails = action.payload;
    },
    setDeliveryDetails: (state, action) => {
      state.deliveryDetails = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setProductDetails,
  setShipDetails,
  setDeliveryDetails,
  setPaymentDetails,
} = shipmentPageSlide.actions;

export default shipmentPageSlide.reducer;
