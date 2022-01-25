import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, Collapse, Box, CircularProgress, IconButton } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Alert } from "@material-ui/lab";
import { Close } from "@material-ui/icons";

export default function OrderLogin({ profilePopup, handleProfilePopup, setCusOrderData, setFsoOpen }) {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);
  const mobRegex = /^\d{10}$/;
  const otpRegex = /^\d{4}$/;
  const [numberSent, setNumberSent] = useState(false);
  const { REACT_APP_API_URL } = process.env;

  const formik = useFormik({
    initialValues: {
      mobile: "",
    },
    validationSchema: yup.object({
      mobile: yup.string().required("Please enter your mobile number").matches(mobRegex, 'Please enter a valid number'),
    }),
    onSubmit: (values) => {
      setError(false)
      initiateOtp(values)
    },
  });
  const formik2 = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: yup.object({
      otp: yup.string().required("Please enter OTP received").matches(otpRegex, 'Please enter a valid 4 digit OTP'),
    }),
    onSubmit: (values) => {
      setError(false)
      verifyOtp(values)
    },
  });

  const verifyOtp = async (values) => {
    setLoading(true)
    await axios.get(`/mylapay/customer/get/orders?mobile=${formik.values.mobile}&customerOtp=${values.otp}`).then(res => {
      if (res.data.status === 1) {
        setCusOrderData(res.data.data)
        setFsoOpen(true)
        setNumberSent(false)
        handleProfilePopup(false)
      } else {
        setError(true)
        setErrorMsg(res.data.data)
      }
    }).catch(error => {
      if (error.response) {
        setError(true)
        setErrorMsg(error.response.data.message)
      } else if (error.request) {
        setError(true)
        setErrorMsg(error.request)
      } else {
        setError(true)
        setErrorMsg("Error" + error.message)
      }
    })
    setLoading(false)
  }


  const initiateOtp = async (values) => {
    setLoading(true)
    await axios.post(`${REACT_APP_API_URL}/mylapay/auth/customer/otp-login`, values).then(res => {
      if (res.data.success === 1) {
        setNumberSent(true)
      } else {
        setError(true)
        setErrorMsg("Something went wrong, please try again")
      }
    }).catch(error => {
      if (error.response) {
        setError(true)
        setErrorMsg(error.response.data.message)
      } else if (error.request) {
        setError(true)
        setErrorMsg(error.request)
      } else {
        setError(true)
        setErrorMsg("Error" + error.message)
      }
    })
    setLoading(false)
  }

  return (
    <>
      <Dialog open={profilePopup}>
        <DialogTitle>Login to see your orders

          <IconButton
            style={{
              position: "absolute",
              right: "0",
              top: "0",
            }}
            aria-label="Close"
            onClick={() => {
              handleProfilePopup(false);
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ paddingBottom: "2em" }} >
          {!numberSent && <form onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth variant="outlined" label="Mobile Number"
                  type="tel"
                  name="mobile"
                  id="mobile"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.mobile && Boolean(formik.errors.mobile)
                  }
                  helperText={formik.touched.mobile && formik.errors.mobile}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large" color="primary" fullWidth disabled={loading} >
                  {loading ? <CircularProgress size={24} /> : "Send OTP"}
                </Button>
              </Grid>
            </Grid>
          </form>}

          {
            numberSent &&
            <form onSubmit={formik2.handleSubmit}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth variant="outlined" label="Enter OTP"
                    type="number"
                    name="otp"
                    id="otp"
                    onChange={formik2.handleChange}
                    error={
                      formik2.touched.otp && Boolean(formik2.errors.otp)
                    }
                    helperText={formik2.touched.otp && formik2.errors.otp}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="large" color="primary" fullWidth disabled={loading} >
                    {loading ? <CircularProgress size={24} /> : "Verify OTP"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          }

          <Collapse in={error}>
            <Box mt={2}>
              <Alert severity="error">{errorMsg}</Alert>
            </Box>
          </Collapse>
        </DialogContent>
      </Dialog>
    </>
  );
}
