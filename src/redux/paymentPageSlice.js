import { createSlice } from "@reduxjs/toolkit";

export const paymentPageSlide = createSlice({
  name: "paymentPage",
  initialState: {
    iShop: null,
    shopDetails: null,
    productDetails: null,
    paymentDetails: null,
    shipmentDetails: null,
    selectedAddress: null,
    addressType: null,
  },
  reducers: {
    setiShop: (state, action) => {
      state.iShop = action.payload;
    },
    setShopDetails: (state, action) => {
      state.shopDetails = action.payload;
    },
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
    setShipmentDetails: (state, action) => {
      state.shipmentDetails = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setAddressType: (state, action) => {
      state.addressType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setiShop,
  setShopDetails,
  setProductDetails,
  setPaymentDetails,
  setShipmentDetails,
  setSelectedAddress,
  setAddressType,
} = paymentPageSlide.actions;

export default paymentPageSlide.reducer;
