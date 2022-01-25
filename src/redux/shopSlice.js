import { createSlice } from "@reduxjs/toolkit";

export const shopSlice = createSlice({
  name: "shop",
  initialState: {
    cartData: [],
    formValues: null,
    orderTotal: null,
    shopData: null,
    productsData: null,
  },
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
    setFormValues: (state, action) => {
      state.formValues = action.payload;
    },
    setOrderTotal: (state, action) => {
      state.orderTotal = action.payload;
    },
    setShopData: (state, action) => {
      state.shopData = action.payload;
    },
    setProductsData: (state, action) => {
      state.productsData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCartData,
  setFormValues,
  setOrderTotal,
  setShopData,
  setProductsData,
} = shopSlice.actions;

export default shopSlice.reducer;
