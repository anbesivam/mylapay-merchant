import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
} from "@material-ui/core";
import { Add, ArrowBack, ArrowForward, Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import AddNewInputField from "./AddNewInputField";
import {
  setShopDetails,
  setProductDetails,
  setPaymentDetails,
} from "../../redux/paymentPageSlice";

export default function PaymentDetails({ shopID, stepChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const shopDetails = useSelector((state) => state.paymentPage.shopDetails);
  const paymentDetails = useSelector(
    (state) => state.paymentPage.paymentDetails
  );
  const productDetails = useSelector(
    (state) => state.paymentPage.productDetails
  );
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  const handleInput = (newItem) => {
    let payload;
    if (paymentDetails) {
      payload = [...paymentDetails, newItem];
    } else {
      payload = [newItem];
    }
    dispatch(setPaymentDetails(payload));
  };

  const nextStep = () => {
    dispatch(setPaymentDetails(paymentDetails));
    stepChange(3);
  };

  const deleteField = (delIndex) => {
    let payload = paymentDetails.filter((item, index) => index !== delIndex);
    dispatch(setPaymentDetails(payload));
  };

  const renderInputBoxes = () => {
    return paymentDetails.map((item, index) => {
      return (
        <Box key={index} mb={2} display="flex" alignItems="center">
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            label={item.inputLabel}
            disabled
            multiline={item.inputType === "multiline_text"}
            rows={3}
          />
          <IconButton
            onClick={() => {
              deleteField(index);
            }}
            className="red-text"
          >
            <Close />
          </IconButton>
        </Box>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Store to Redux
    dispatch(setPaymentDetails(paymentDetails));

    // Creating FormData
    const formData = new FormData();

    // Append shop details - step 1 data
    Object.keys(shopDetails).forEach((key) =>
      formData.append(key, shopDetails[key])
    );

    //  Append product details - step 2 data
    const productArray = productDetails.map((product, index) => {
      const { product_image, ...rest } = product;
      formData.append(`product_image_${index}`, product_image);
      return rest;
    });
    formData.append("product_details", JSON.stringify(productArray));
    formData.append("category", localStorage.getItem("MCC_Code"));

    //  Append payment details - step 3 data
    formData.append("page_input", JSON.stringify(paymentDetails));

    if (shopID) formData.append("shopID", shopID);

    await axios
      .post("/mylapay/transaction/shop/publish", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          dispatch(setShopDetails(null));
          dispatch(setProductDetails(null));
          dispatch(setPaymentDetails(null));
          history.push("/payment-pages");
        } else {
          setError(true);
          setErrorMsg(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          setError(true);
          setErrorMsg(err.response.data.message || err.response.statusText);
        } else if (err.request) {
          setError(true);
          setErrorMsg(err.request.message);
        } else {
          setError(true);
          setErrorMsg(err.message);
        }
      });
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Paper elevation={0}>
          <Box maxWidth="550px" mx="auto" p={4}>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Name"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Email"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="tel"
                label="Phone"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Building No"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Street Name"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Landmark"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="City"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                label="Pincode"
                disabled
              />
            </Box>
            {paymentDetails && paymentDetails.length > 0 && renderInputBoxes()}
            <Box mb={2}>
              <Button
                startIcon={<Add />}
                color="primary"
                variant="outlined"
                onClick={() => {
                  handleDialog(true);
                }}
              >
                Add New
              </Button>
            </Box>
          </Box>
        </Paper>
        <Collapse in={error}>
          <Box mt={2}>
            <Alert severity="error">{errorMsg}</Alert>
          </Box>
        </Collapse>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => {
              stepChange(1);
            }}
          >
            Back
          </Button>
          {/* <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={
              loading ? <CircularProgress size={16} /> : <ArrowForward />
            }
            disabled={loading}
          >
            Publish Shop
          </Button> */}

          <Button
            type="button"
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            onClick={() => {
              nextStep();
            }}
          >
            Next
          </Button>
        </Box>
      </form>

      <Dialog style={{ width: "500px", margin: "auto" }} open={dialogOpen}>
        <DialogTitle>Add a new input field</DialogTitle>
        <DialogContent>
          <AddNewInputField
            handleDialog={handleDialog}
            handleInput={handleInput}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
