import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import short from "short-uuid";
import {
  setCartData,
  setFormValues,
  setOrderTotal,
} from "../../redux/shopSlice";
import QrImage from "./QrImage";

export default function UpiForm() {
  const orderTotal = useSelector((state) => state.shop.orderTotal);
  const formValues = useSelector((state) => state.shop.formValues);
  const cartData = useSelector((state) => state.shop.cartData);
  const [upiId, setUpiId] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const shopData = useSelector((state) => state.shop.shopData);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const isValid = /^[\w.-]+@[\w.-]+$/.test(upiId);

  const handleSubmit = async () => {
    setFormSubmitted(true);
    setLoading(true);

    if (!isValid) return setLoading(false);
    await axios
      .post("/mylapay/upi/transaction/initiate", {
        iMID: shopData.imid,
        pg_merchant_id: shopData.pg_merchant_id,
        MerchantTxnID: short.generate(),
        Payer_VA: upiId,
        Amount: orderTotal,
        order_summary_description: "Submerchant order",
        expiry_type: "EXPAFTER",
        expiry_value: 20,
        merchant_category_code: shopData.catogory,
      })
      .then((res) => {
        console.log(res.data);
        saveOrder(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrorMsg(err.message);
      });
    setLoading(false);
  };

  const saveOrder = async (r) => {
    setLoading(true);
    let inputValues = Object.entries(formValues).map(([key, value]) => {
      return {
        label: key,
        value: value,
      };
    });
    inputValues = inputValues.filter(
      (item) =>
        item.label !== "name" &&
        item.label !== "email" &&
        item.label !== "phone"
    );

    let cartItems = cartData.map((item) => {
      let temp = Object.assign({}, item);

      temp.productID = temp.id;
      // temp.product_name = temp.product_name;
      temp.quantity = temp.qty;
      temp.amount = temp.price * temp.qty;
      delete temp.id;
      delete temp.qty;
      delete temp.catogoryName;
      delete temp.file_name;
      delete temp.stock;
      delete temp.product_image;
      delete temp.prodDescription;

      return temp;
    });

    await axios
      .post("/mylapay/customer/save/order", {
        shopID: shopData.shopID,
        totalAmount: orderTotal,
        customerName: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        productDetails: JSON.stringify(cartItems),
        customerDetails: JSON.stringify(inputValues),
        payer_VPA: upiId,
        iUpi: r.iUpi,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 1) {
          dispatch(setCartData([]));
          dispatch(setOrderTotal(null));
          dispatch(setFormValues(null));
          localStorage.removeItem("cartData");
          history.push({
            pathname: "/shop/" + shopData.url_name + "/cart/success",
            state: { r, orderId: res.data.message },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrorMsg(err.message);
      });
    setLoading(false);
  };

  const handleQrGenerate = async () => {
    setShowQr(true);
    // await axios
    //   .post("/mylapay/qrcode/generate", {
    //     payee_VPA: shopData.payee_VPA,
    //     payee_name: shopData.payee_name,
    //     payee_mcc_code: shopData.catogory,
    //     MerchantTxnID: short.generate(),
    //     TxnAmountDecimalFormat: parseFloat(orderTotal.toFixed(2)),
    //     TxnMinimumAmountDecimalFormat: parseFloat(orderTotal.toFixed(2)),
    //     currency_code: "INR",
    //     TxnNote: "Test transaction Note",
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <>
      {showQr ? (
        <QrImage />
      ) : (
        <Box p={2}>
          <TextField
            label="Enter your UPI id"
            variant="outlined"
            fullWidth
            onChange={(e) => setUpiId(e.target.value)}
            error={formSubmitted && !isValid}
            helperText={formSubmitted && !isValid && "Enter a valid UPI id"}
          />

          <Typography
            style={{
              textAlign: "center",
              paddingTop: "1em",
              cursor: "pointer",
            }}
            variant="body1"
            onClick={() => handleQrGenerate()}
          >
            Show QR Code
          </Typography>

          <Collapse in={error}>
            <Box mt={2}>
              <Alert severity="error">{errorMsg}</Alert>
            </Box>
          </Collapse>
          <Button
            style={{ padding: "14px 18px", marginTop: "3em" }}
            variant="contained"
            size="large"
            fullWidth
            color="primary"
            onClick={() => handleSubmit()}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Pay ₹" + orderTotal}
          </Button>
        </Box>
      )}
    </>
  );
}
