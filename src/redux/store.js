import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import kycReducer from "./kycSlice";
import dashboardReducer from "./dashboardSlice";
import paymentPageReducer from "./paymentPageSlice";
import paymentWebPageReducer from "./paymentWebPageSlice";
import shopReducer from "./shopSlice";
import shipmentPageReducer from "./shipmentPageSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    kyc: kycReducer,
    dashboard: dashboardReducer,
    paymentPage: paymentPageReducer,
    shop: shopReducer,
    paymentWebPage: paymentWebPageReducer,
    shipmentPage:shipmentPageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
