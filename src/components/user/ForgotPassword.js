import {
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Button,
  Collapse,
  CircularProgress,
  Grid,
  Typography,
  Snackbar,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert } from "@material-ui/lab";

export default function ForgotPassword({
  handleDialog,
  updatePassword,
  setRegisteredEmail,
}) {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [convertedNumber, setConvertedNumber] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("This is a message!");
  const [toastSeverity, setToastSeverity] = useState("info");
  const { REACT_APP_API_URL } = process.env;

  const validationSchema = yup.object({
    Email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
  });
  const formik = useFormik({
    initialValues: {
      Email: "",
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleClick(values);
      setRegisteredEmail(values.Email);
    },
  });
  const toastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const initiateOtp = async (values, userName, mobile, resend) => {
    setLoading(true);
    setError(false);
    await axios
      .post(`${REACT_APP_API_URL}/mylapay/merchant/send_otp`, {
        mobile: mobile,
        email: values.Email,
        userName: userName,
      })
      .then((response) => {
        if (response.data.status === 1) {
          if (resend === true) {
            setToastSeverity("success");
            setToastOpen(true);
            setToastMsg("OTP sent successfully!");
            setError(false);
          } else {
            setFormSubmitted(true);
          }
        } else {
          setError(true);
          setErrorMsg(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setError(true);
          setErrorMsg(error.response.statusText);
        } else if (error.request) {
          setError(true);
          setErrorMsg(error.request.message);
        } else {
          setError(true);
          setErrorMsg(error.message);
        }
      });
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(false);
    let otp = document.getElementById("contact_otp").value;

    await axios
      .post(`${REACT_APP_API_URL}/mylapay/merchant/verify_otp`, {
        otp: otp,
        email: formik.values.Email,
      })
      .then((response) => {
        if (response.data.status === 1) {
          handleDialog(false);
          updatePassword(true);
        } else {
          setError(true);
          setErrorMsg(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setError(true);
          setErrorMsg(error.response.statusText);
        } else if (error.request) {
          setError(true);
          setErrorMsg(error.request.message);
        } else {
          setError(true);
          setErrorMsg(error.message);
        }
      });
    setLoading(false);
  };

  const handleClick = async (values) => {
    setLoading(true);

    await axios
      .post(`${REACT_APP_API_URL}/mylapay/merchant/check_merchant`, {
        email: values.Email,
      })
      .then((response) => {
        if (response.data.status === 1) {
          setUserName(response.data.userName);
          setMobileNumber(response.data.mobile);
          var mobileNumber1 = response.data.mobile.toString().substring(2, 8);
          setConvertedNumber(
            response.data.mobile.toString().replace(mobileNumber1, "XXXXXX")
          );

          initiateOtp(
            values,
            response.data.userName,
            response.data.mobile,
            false
          );
        } else {
          setError(true);
          setErrorMsg(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(true);
          setErrorMsg(error.response.statusText);
        } else if (error.request) {
          setError(true);
          setErrorMsg(error.request.message);
        } else {
          setError(true);
          setErrorMsg(error.message);
        }
      });
    setLoading(false);
  };

  return (
    <>
      <DialogTitle id="form-dialog-title">
        Forgot Your Password? No worries!
      </DialogTitle>
      {formSubmitted ? (
        <DialogContent
          style={{
            maxWidth: "400px",
            paddingBottom: "1em",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                Enter the otp sent to mobile - {convertedNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="contact_otp"
                variant="outlined"
                label="OTP verification code"
                fullWidth
              />
              {error && (
                <Collapse in={error}>
                  <Box mt={2}>
                    <Alert severity="error">{errorMsg}</Alert>
                  </Box>
                </Collapse>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="body2">
                Didn't receive the code?{" "}
                <span
                  onClick={() => {
                    initiateOtp(formik.values, userName, mobileNumber, true);
                  }}
                  style={{
                    color: "#2caee4",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Resend OTP
                </span>
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                color="primary"
                variant="outlined"
                onClick={() => setFormSubmitted(false)}
              >
                Edit
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={verifyOtp}
                endIcon={
                  loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <ArrowForwardIcon />
                  )
                }
                disabled={loading}
              >
                Verify
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            open={toastOpen}
            autoHideDuration={6000}
            onClose={toastClose}
          >
            <Alert onClose={toastClose} severity={toastSeverity}>
              {toastMsg}
            </Alert>
          </Snackbar>
        </DialogContent>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div>
            <DialogContent style={{ maxWidth: "400px", paddingBottom: "1em" }}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography variant="body2" color="textPrimary" component="p">
                    Enter your registered email id
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    id="Email"
                    name="Email"
                    value={formik.values.Email}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.setFieldTouched("Email");
                      formik.handleChange(e);
                    }}
                    error={formik.touched.Email && Boolean(formik.errors.Email)}
                    helperText={formik.touched.Email && formik.errors.Email}
                  />
                </Grid>

                {error && (
                  <Grid item xs={12}>
                    <Collapse in={error}>
                      <Box mt={2}>
                        <Alert severity="error">{errorMsg}</Alert>
                      </Box>
                    </Collapse>
                  </Grid>
                )}
                <Grid item xs={8} style={{ textAlign: "auto" }}>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => handleDialog(false)}
                  >
                    Exit
                  </Button>
                </Grid>
                <Grid item xs={4} style={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    endIcon={loading && <CircularProgress size={16} />}
                    style={{ marginLeft: "auto" }}
                    type="submit"
                    disabled={loading}
                  >
                    Send Otp
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </div>
        </form>
      )}

      <style>
        {`
        #form-dialog-title {
          padding-bottom: 0px;
        }
        `}
      </style>
    </>
  );
}
