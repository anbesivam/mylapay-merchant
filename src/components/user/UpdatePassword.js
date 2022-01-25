import {
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Button,
  Collapse,
  CircularProgress,
  Grid,
  Typography
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert } from "@material-ui/lab";
import { Dialog } from "@material-ui/core";

export default function ContactInfo({
  otpVerified,
  updatePasswordFunc,
  registeredEmail
}) {
  
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const { REACT_APP_API_URL } = process.env;

  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .required("Enter a password")
      .min(8, "Must be 8 characters or more")
      .matches(/[a-z]+/, "Must have atleast 1 lowercase character")
      .matches(/[A-Z]+/, "Must have atleast 1 uppercase character")
      .matches(/[@$!%*#?&]+/, "Must have atleast 1 special character")
      .matches(/\d+/, "Must have atleast 1 number"),
    confirmPassword: yup
      .string()
      .test("len", "Password does not match", (val) => {
        if(val) return val === formik.values.newPassword;
      }),
  });
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      handleClick(values);
    },
  });
  const handleClick = async (values) => {
    setLoading(true);
    
    await axios
      .put(`${REACT_APP_API_URL}/mylapay/merchant/update_password`, {
        email: registeredEmail,
        newPassword: values.newPassword
      })
      .then((response) => {
        if (response.data.status === 1) {
          updatePasswordFunc(false);
          Swal.fire({
            title: "Success",
            text: "Your Password updated successfully!",
            icon: "success",
            confirmButtonColor: "#20295C",
            confirmButtonText: "Okay",
          })
          
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
    {otpVerified && (
      <Dialog open={true}>
        <DialogTitle id="form-dialog-title">Create New Password</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <DialogContent style={{ maxWidth: "400px",paddingBottom: "1em" }}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="body2" component="p">
                    Enter your new password
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="New Password"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.setFieldTouched("newPassword");
                      formik.handleChange(e);
                    }}
                    error={
                      formik.touched.newPassword &&
                      Boolean(formik.errors.newPassword)
                    }
                    helperText={
                      formik.touched.newPassword && formik.errors.newPassword
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.setFieldTouched("confirmPassword");
                      formik.handleChange(e);
                    }}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                    }
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
                    onClick={() => updatePasswordFunc(false)}
                  >
                    Exit
                  </Button>
                </Grid>
                <Grid item xs={4} style={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    endIcon={
                      loading && (
                        <CircularProgress size={16} />
                      )
                    }
                    style={{ marginLeft: "auto" }}
                    type="submit"
                    disabled={loading}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </div>
        </form>
      </Dialog>
    )}
    </>
  );
}
