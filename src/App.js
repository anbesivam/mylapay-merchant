import React, { useEffect } from "react";
import Signup from "./pages/user/Signup";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setUserData, setUserDetails } from "./redux/authSlice";
//import Dashboard from "./pages/Dashboard";
import Dashboard from "./pages/DashboardTransactions";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthRoute from "./components/common/AuthRoute";
import KycForm from "./pages/user/KycForm";
import axios from "axios";
import Login from "./pages/user/Login";
import Approval from "./pages/user/Approval";
import PaymentPages from "./pages/payment-pages";
import UserManual from "./pages/user-manual";
import OrderUserManual from "./pages/order-user-manual";

import QRPage from "./components/payment-pages/QRPage";
import PaymentPageNew from "./pages/payment-pages/new";
import Shop from "./pages/shop";
import ShopCart from "./pages/shop/cart";
import ShopProductDetail from "./pages/shop/ProductDetail";
import PaymentPageEdit from "./pages/payment-pages/edit";
import RejectedDocs from "./pages/user/rejected-docs";
import OrderSuccess from "./pages/shop/success";
import Orders from "./pages/orders";
import Invoice from "./pages/invoice";
import GenerateInvoice from "./pages/invoice/generate-invoice";
import OrdersView from "./pages/orders/view";
import ViewTable from "./pages/tableconfig/ViewTable";

import TableConfig from "./pages/tableconfig";

import ViewtransitDetails from "./components/order-pages/ViewtransitDetails";
import ViewtransitorderDetails from "./components/order-pages/ViewtransitorderDetails";
import ViewordertrackingDetails from "./components/order-pages/ViewordertrackingDetails";
import ViewtransactionDetails from "./components/order-pages/ViewtransactionDetails";

import ViewacceptDetails from "./components/order-pages/ViewacceptDetails";

import DashboardMain from "./pages/dashboard-main";
//import customerList from "./pages/your-customers";
import customerList from "./pages/your-customers/index-your-customers";
import OnlineStoresBreakup from "./pages/your-customers/onlineStoresBreakup";
import PaymentWebPagesBreakup from "./pages/your-customers/paymentWebpagesBreakup";
import QuickpayBreakup from "./pages/your-customers/quickpayBreakup";

import PostBoarding from "./pages/user/post-boarding";
import AccountInactive from "./pages/user/account-inactive";
import KycFormProfile from "./pages/user/KycFormProfile";
import Quickpay from "./pages/quickpay/index";
import QuickpayNew from "./pages/quickpay/new";
import GenerateQr from "./pages/payment-pages/generate-qr";
import { Toaster } from "react-hot-toast";
import PaymentWebPage from "./pages/payment-web-pages";
import PaymentWebPageNew from "./pages/payment-web-pages/new";
import PaymentWebPageEdit from "./pages/payment-web-pages/edit";
import ProfitCalculator from "./pages/profit-calculator/index";
import DashboardV2 from "./pages/DashboardV2";
import LetterHeadTemplate from "./components/user/LetterHeadTemplate";
import ReconControl from "./pages/reconciliation/control";
import Reconciliation from "./pages/reconciliation/index";
import TransactionsBreakup from "./pages/transanctions/breakup";
import SettlementsBreakup from "./pages/settlements/breakup";
import Settlements from "./pages/settlements/index";
import PackingSlip from "./components/order-pages/PackingSlip";
const { REACT_APP_SHOPAPI_URL } = process.env;
const { REACT_APP_API_URL } = process.env;

axios.defaults.baseURL = REACT_APP_SHOPAPI_URL;

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const loginUser = () => {
      let localUserData = localStorage.getItem("userData");
      if (localUserData === null) return;
      localUserData = JSON.parse(localUserData);
      dispatch(setUserData(localUserData));
      dispatch(setAuth(true));
      axios.defaults.headers.common["Authorization"] =
        "JWT " + localUserData.auth_token;
    };
    loginUser();

    const getUserData = async () => {
      if (!isAuthenticated) return;
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_details`)
        .then((response) => {
          if (response.data.success === 1) {
            localStorage.setItem(
              "userDetails",
              JSON.stringify(response.data.data[0])
            );
            dispatch(setUserDetails(response.data.data[0]));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Router>
        <Switch>
          <Route path="/user/:path?" exact>
            <Switch>
              <Route path="/user" exact>
                <Redirect to="/" />
              </Route>
              <AuthRoute exact path="/user/signup" component={Signup} />
              <AuthRoute exact path="/user/login" component={Login} />
              <Route exact path="/user/kyc-form" component={KycForm} />
              <Route path="/user/*">
                <div>404 Not found </div>
              </Route>
            </Switch>
          </Route>

          <ProtectedRoute
            exact
            path="/dashboard-main"
            component={DashboardMain}
          />
          <ProtectedRoute exact path="/dashboard-v2" component={DashboardV2} />

          <ProtectedRoute exact path="/transactions" component={Dashboard} />
          <ProtectedRoute exact path="/" component={PaymentPages} />
          <ProtectedRoute
            exact
            path="/payment-pages"
            component={PaymentPages}
          />
          <ProtectedRoute exact path="/user-manual" component={UserManual} />
          <ProtectedRoute
            exact
            path="/order-user-manual"
            component={OrderUserManual}
          />

          <ProtectedRoute exact path="/generate/shop/QR" component={QRPage} />
          <ProtectedRoute
            exact
            path="/your-customers"
            component={customerList}
          />

          <ProtectedRoute
            exact
            path="/your-customers/online-stores-breakup"
            component={OnlineStoresBreakup}
          />

          <ProtectedRoute
            exact
            path="/your-customers/payment-webpage-breakup"
            component={PaymentWebPagesBreakup}
          />

          <ProtectedRoute
            exact
            path="/your-customers/quickpay-breakup"
            component={QuickpayBreakup}
          />

          <ProtectedRoute exact path="/profile" component={KycFormProfile} />

          <ProtectedRoute exact path="/shop/qr" component={GenerateQr} />

          <ProtectedRoute
            exact
            path="/payment-pages/new"
            component={PaymentPageNew}
          />
          <ProtectedRoute
            exact
            path="/payment-pages/edit"
            component={PaymentPageEdit}
          />
          <ProtectedRoute
            exact
            path="/payment-web-page"
            component={PaymentWebPage}
          />
          <ProtectedRoute
            exact
            path="/payment-web-page/new"
            component={PaymentWebPageNew}
          />
          <ProtectedRoute
            exact
            path="/payment-web-page/edit"
            component={PaymentWebPageEdit}
          />
          <ProtectedRoute exact path="/quickpay" component={Quickpay} />
          <ProtectedRoute exact path="/quickpay/new" component={QuickpayNew} />
          <ProtectedRoute exact path="/orders" component={Orders} />
          <ProtectedRoute exact path="/orders/view" component={OrdersView} />
          <ProtectedRoute exact path="/tableview" component={ViewTable} />
          <ProtectedRoute exact path="/invoice" component={Invoice} />

          <ProtectedRoute exact path="/table-config" component={TableConfig} />

          
          <ProtectedRoute
            exact
            path="/view/invoice"
            component={GenerateInvoice}
          />

          <ProtectedRoute
            exact
            path="/orders/transitview"
            component={ViewtransitDetails}
          />
          <ProtectedRoute
            exact
            path="/orders/transitvieworder"
            component={ViewtransitorderDetails}
          />
          <ProtectedRoute
            exact
            path="/orders/viewtransactions"
            component={ViewtransactionDetails}
          />

          <ProtectedRoute
            exact
            path="/orders/trackorder"
            component={ViewordertrackingDetails}
          />

          <ProtectedRoute
            exact
            path="/orders/acceptview"
            component={ViewacceptDetails}
          />

          <ProtectedRoute
            exact
            path="/profit-calculator"
            component={ProfitCalculator}
          />
          <ProtectedRoute exact path="/letter" component={LetterHeadTemplate} />

          <ProtectedRoute
            exact
            path="/transactions/breakup"
            component={TransactionsBreakup}
          />
          <ProtectedRoute
            exact
            path="/reconciliation"
            component={Reconciliation}
          />
          <ProtectedRoute
            exact
            path="/recon-control"
            component={ReconControl}
          />
          <ProtectedRoute exact path="/settlements" component={Settlements} />
          <ProtectedRoute
            exact
            path="/settlements/breakup"
            component={SettlementsBreakup}
          />

          <Route exact path="/delhivery/packingslip" component={PackingSlip} />
          <Route exact path="/approval" component={Approval} />
          <Route exact path="/rejected-docs" component={RejectedDocs} />
          <Route exact path="/post-boarding" component={PostBoarding} />
          <Route exact path="/account-inactive" component={AccountInactive} />
          <Route exact path="/shop/:shop_url" component={Shop} />
          <Route exact path="/shop/:shop_url/cart" component={ShopCart} />
          <Route
            exact
            path="/shop/:shop_url/cart/success"
            component={OrderSuccess}
          />
          <Route
            exact
            path="/shop/:shop_url/:product_id"
            component={ShopProductDetail}
          />

          <Route path="*">
            <div>404 Not found </div>
          </Route>
        </Switch>
      </Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            maxWidth: "100%",
          },
        }}
      />
    </>
  );
}

export default App;
