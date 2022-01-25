import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Card,
  CardContent,
  Button,
  Collapse,
  CircularProgress,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useDispatch } from "react-redux";
import { setActiveStep } from "../../redux/kycSlice";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert } from "@material-ui/lab";

export default function ContactInfo() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  console.log(userDetails.iUser)

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
              `mylapay/registration/check/availability?value=${value}&key=contact_no&step=1&iUser=${userDetails.iUser}`
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
              `mylapay/registration/check/availability?value=${value}&key=Contact_Email&step=1&iUser=${userDetails.iUser}`
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
      handleClick(values);
    }
  });

  const handleClick = async (values) => {
    setLoading(true);
    await axios
      .put("/mylapay/registration/merchant_info", {
        contact_name: values.contactName,
        contact_email: values.contactEmail,
        contact_number: values.contactNumber,
        info_type: "contact info",
        current_step: 1,
      })
      .then((response) => {
        if (response.data.success === 1) {
          dispatch(setActiveStep(1));
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

  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get("/mylapay/registration/user_details")
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
  }, []);

  useEffect(() => {
    if (prefillData === null) return;
    if (prefillData.current_step === null || prefillData.current_step < 1)
      return;
    formik.setFieldValue("contactName", prefillData.Username);
    formik.setFieldValue("contactNumber", prefillData.contact_no);
    formik.setFieldValue("contactEmail", prefillData.contact_email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData]);


  return (
    <form onSubmit={formik.handleSubmit}>
      <Card variant="outlined">
        <CardContent>
          <Box maxWidth={600} mx="auto" px={4} py={6}>
            <Box mb={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Contact Name"
                id="contactName"
                name="contactName"
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
            </Box>
            <Box mb={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Contact Number"
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
                label="Contact Email"
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
        </CardContent>
      </Card>

      <Collapse in={error}>
        <Box mt={2}>
          <Alert severity="error">{errorMsg}</Alert>
        </Box>
      </Collapse>

      <Box mt={4} display="flex">
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={
            loading ? <CircularProgress size={16} /> : <ArrowForwardIcon />
          }
          style={{ marginLeft: "auto" }}
          type="submit"
          disabled={loading}
        >
          Save and continue
        </Button>
      </Box>
    </form>
  );
}
