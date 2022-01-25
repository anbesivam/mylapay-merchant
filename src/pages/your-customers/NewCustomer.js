import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Button,
  Collapse,
  CircularProgress,
} from '@material-ui/core';
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert } from "@material-ui/lab"; 
import Swal from "sweetalert2";

export default function ContactInfo({handleDialog}) {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const { REACT_APP_API_URL } = process.env;
  
  const validationSchema = yup.object({
    customerName: yup.string().required("Name is Required"),
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
              `${REACT_APP_API_URL}/mylapay/registration/check/availability?value=${value}&key=contact_email`,
              )
            .then((res) => res.data.data === 1)
      ),
  });
  const formik = useFormik({
    initialValues: {
      customerName: "",
      contactNumber: "",
      contactEmail: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleClick(values);
    }
  });
 
  const handleClick = async (values) => {
    setLoading(true);
    await axios
      .post("/mylapay/transaction/add/customer", {
        customerName: values.customerName,
        email: values.contactEmail,
        phone: values.contactNumber,
        iUser : userData.iUser
      })
      .then((response) => {
          if (response.data.status === 1) {
            handleDialog(false);
            Swal.fire({
              title: "Added",
              text: "Customer Added Successfully!",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#20295C",
            })
          } 
          else if(response.data.status === 409){
            setError(true);
            setErrorMsg("Customer details already exist");
          }else {
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

  return (
    <form onSubmit={formik.handleSubmit}>
    <div>
        <DialogTitle id="form-dialog-title">Contact Info</DialogTitle>
        <DialogContent>
        <Box style={{ width: "300px" }} mx="auto" px={4} py={2}>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Customer Name"
                id="customerName"
                name="customerName"
                value={formik.values.customerName}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("customerName");
                  formik.handleChange(e);
                }}
                error={
                  formik.touched.customerName &&
                  Boolean(formik.errors.customerName)
                }
                helperText={
                  formik.touched.customerName && formik.errors.customerName
                }
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Contact No."
                id="contactNumber"
                name="contactNumber"
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
            </Box>
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                id="contactEmail"
                name="contactEmail"
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
            </Box>
          </Box>
        </DialogContent>
        <Collapse in={error}>
          <Box mt={2}>
            <Alert severity="error">{errorMsg}</Alert>
          </Box>
        </Collapse>
        <DialogActions>
         
          <Box mt={4} display="flex">
           
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={
                loading ? <CircularProgress size={16} /> : ""
              }
              style={{ marginLeft: "auto" }}
              type="submit"
              disabled={loading}
            >
              Save
            </Button>
          </Box>
        </DialogActions>
     
      </div>
    </form>
  );
}
