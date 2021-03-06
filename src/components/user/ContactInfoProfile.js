import {
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Button,
  Collapse,
  Dialog,
  CircularProgress,
  Grid,
  Typography,
  Snackbar
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useDispatch } from "react-redux";
import { setActiveStep } from "../../redux/kycSlice";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert } from "@material-ui/lab";
import Swal from "sweetalert2";

export default function ContactInfoProfile() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("This is a message!");
  const [toastSeverity, setToastSeverity] = useState("info");
  const [verifyOtpDialog, setVerifyOtpDialog] = useState(false);
  const[textFieldState,setTextFieldState] = useState(true);
  const { REACT_APP_API_URL } = process.env;

  const toastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const validationSchema = yup.object({
    contactName: yup.string().required("Name is Required"),
    contactNumber: yup
      .string()
      .matches(/^\d{10}$/, "Enter a valid phone number")
      .required("Phone number is required")
      .test(
        "is-taken",
        "Contact no Already Registered!",
        async (value, testContext) =>
          await axios
            .get(
              `${REACT_APP_API_URL}/mylapay/registration/check/availability?value=${value}&key=contact_no`
            )
            .then((res) => res.data.data === 1)
      ),
    contactEmail: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required")
      .test(
        "is-taken",
        "Email Already Exist!!",
        async (value, testContext) =>
          await axios
            .get(
              `${REACT_APP_API_URL}/mylapay/registration/check/availability?value=${value}&key=contact_email`
            )
            .then((res) => res.data.data === 1)
      ),
  });
  const formik = useFormik({
    initialValues: {
      contactName: "",
      contactNumber: "",
      contactEmail: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (prefillData.contact_no === values.contactNumber) {
        handleClick(values);
      } else {
        initiateOtp(values);
        handleDialog(true);
      }
    },
  });
  const handleDialog = (value) => {
    setVerifyOtpDialog(value);
  };
  const handleClick = async (values) => {
    setLoading(true);
    await axios
      .put(`${REACT_APP_API_URL}/mylapay/registration/merchant_info`, {
        contact_name: values.contactName,
        contact_email: values.contactEmail,
        contact_number: values.contactNumber,
        info_type: "contact info",
        current_step: 3,
        // current_step: 0,
      })
      .then((response) => {
        if (response.data.success === 1) {
          dispatch(setActiveStep(0));
          handleDialog(false);
        } else {
          setError(true);
          setErrorMsg(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(true);
          setErrorMsg(error.response.data.message);
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

  const handleNext = () => {
    dispatch(setActiveStep(0));
    //handleDialog(false);
  }
  const initiateOtp = async (values,resend) => {
    setLoading(true);
    await axios
      .post(`${REACT_APP_API_URL}/mylapay/registration/send_otp`, {
        mobile: values.contactNumber,
        email: values.contactEmail,
        userName: values.contactName
      })
      .then((response) => {
        if (response.data.status === 1) {
          if (resend === true) {
            setToastSeverity("success");
            setToastOpen(true);
            setToastMsg("OTP sent successfully!");
            
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
      .post(`${REACT_APP_API_URL}/mylapay/registration/verify_otp`, {
        otp,
      })
      .then((response) => {
        if (response.data.status === 1) {
          setVerifyOtpDialog(false);
          Swal.fire({
            title:??"Success!",
            text:??"Your contact information has been saved",
            icon:??"success",
            confirmButtonText:??"OK",
            confirmButtonColor: "#20295C"
          })
          .then(() => {
            setToastOpen(true);
            setToastMsg("Your contact information has been saved");
            setToastSeverity("success");
            handleClick(formik.values);
          });
          
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
  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_details`)
        .then((response) => {
          if (response.data.success === 1) {
            if (!isMounted) return;
            setPrefillData(response.data.data[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getUserData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  useEffect(() => {
    if (prefillData === null) return;
    if (prefillData.current_step === null) return;
    formik.setFieldValue("contactName", prefillData.Username);
    formik.setFieldValue("contactNumber", prefillData.contact_no);
    formik.setFieldValue("contactEmail", prefillData.contact_email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData]);

  const textFieldStateFunc = async ()=>{
    setTextFieldState(!textFieldState);
    console.log(textFieldState)
  }
  return (
    <>
      <DialogTitle marginLeft="10rem" id="form-dialog-title">Contact Info</DialogTitle>
      <Grid item xs={8} style={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={textFieldStateFunc}
          style={{ marginRight: "15px" }}
        >
          Edit
        </Button>
      </Grid>
      {formSubmitted ? (
        <Dialog open={verifyOtpDialog}>
          <DialogContent
            style={{
              maxWidth: "400px",
              paddingBottom: "1em",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Please enter the otp sent to your mobile number
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
                      initiateOtp(formik.values, true);
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
          </DialogContent>
        </Dialog>
        
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div>
            <DialogContent style={{ paddingBottom: "1em" }}>
              <Grid container spacing={2}>
                <Grid item xs={8} textAlign="right">
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Contact Name"
                    id="contactName"
                    name="contactName"
                    disabled={textFieldState}
                    value={formik.values.contactName}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.setFieldTouched("contactName");
                      formik.handleChange(e);
                    }}
                    error={
                      formik.touched.contactName &&
                      Boolean(formik.errors.contactName)
                    }
                    helperText={
                      formik.touched.contactName && formik.errors.contactName
                    }
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Contact Number"
                    id="contactNumber"
                    name="contactNumber"
                    disabled={textFieldState}
                    value={formik.values.contactNumber}
                    onChange={(e) => {
                      formik.setFieldTouched("contactNumber");
                      formik.handleChange(e);
                    }}
                    error={
                      formik.touched.contactNumber &&
                      Boolean(formik.errors.contactNumber)
                    }
                    helperText={
                      formik.touched.contactNumber && formik.errors.contactNumber
                    }
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Contact Email"
                    id="contactEmail"
                    name="contactEmail"
                    disabled={textFieldState}
                    value={formik.values.contactEmail}
                    onChange={(e) => {
                      formik.setFieldTouched("contactEmail");
                      formik.handleChange(e);
                    }}
                    error={
                      formik.touched.contactEmail &&
                      Boolean(formik.errors.contactEmail)
                    }
                    helperText={
                      formik.touched.contactEmail && formik.errors.contactEmail
                    }
                  />
                </Grid>
                {error && (
                  <Grid item xs={8}>
                    <Collapse in={error}>
                      <Box mt={2}>
                        <Alert severity="error">{errorMsg}</Alert>
                      </Box>
                    </Collapse>
                  </Grid>
                )}
                <Grid item xs={8} style={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={
                      loading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <ArrowForwardIcon />
                      )
                    }
                    //onClick={handleNext}
                    style={{ marginLeft: "auto" }}
                    type="submit"
                    disabled={loading}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </div>
        </form>
      )}
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={toastClose}>
        <Alert onClose={toastClose} severity={toastSeverity}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
