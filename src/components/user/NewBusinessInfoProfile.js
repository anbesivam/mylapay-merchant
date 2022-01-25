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
// import { Link } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useDispatch } from "react-redux";
import { setActiveStep } from "../../redux/kycSlice";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert, Autocomplete } from "@material-ui/lab";

export default function NewBusinessInfoProfile({ handleDialog }) {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const [statesData, setStatesData] = useState(null);
  const imid = JSON.parse(localStorage.getItem("imid"));
  const { REACT_APP_API_URL } = process.env;

  const validationSchema = yup.object({
    description: yup.string().required("Required Field"),
    business_name: yup
      .string()
      .required("Required Field")
      .test(
        "is-taken",
        "Business name Already Registered!",
        async (value, testContext) =>
          await axios
            .get(
              `${REACT_APP_API_URL}/mylapay/registration/check/availability?value=${value}&key=merBussinessName&step=1&imid=${imid}`
            )
            .then((res) => res.data.data === 1)
      ),
    daily_sale_amount: yup
      .number("Enter a valid amount")
      .required("Required Field"),
    street_name: yup
      .string()
      .required("Required Field")
      .min(10, "Address Too Short!")
      .max(200, "Address Too Long!"),
    pincode: yup
      .number("Enter a valid number")
      .required("Required Field")
      .test("len", "Enter a valid 6 digit pincode", (val) => {
        if (val) return val.toString().length === 6;
      }),
    state: yup.mixed().required("Required Field"),
    city: yup
      .string()
      .required("Required Field")
      .test("alphabets", "Name must only contain alphabets", (value) => {
        let regex = /^[A-Za-z]+$/;
        if (regex.test(value)) {
          return true;
        }
        return false;
      }),
    iMCC: yup.mixed().required("Required Field"),
  });
  const businessData = [
    {
      name: "Individuals - HUF",
      value: "Individuals - HUF",
    },
    {
      name: "Individuals / Professionals",
      value: "Individuals / Professionals",
    },
    {
      name: "Proprietoryship",
      value: "Proprietoryship",
    },
    {
      name: "Partnership",
      value: "Partnership",
    },
    {
      name: "LLPs",
      value: "LLPs",
    },
    {
      name: "Public Ltd Companies",
      value: "Public Ltd Companies",
    },
    {
      name: "Private Ltd Companies",
      value: "Private Ltd Companies",
    },
    {
      name: "Trust or Society",
      value: "Trust or Society",
    },
  ];
  const formik = useFormik({
    initialValues: {
      business_name: "",
      description: "",
      daily_sale_amount: "",
      street_name: "",
      door_number: "",
      landmark: "",
      pincode: "",
      state: null,
      city: "",
      iMCC: null,
      businessType: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleClick(values);
    },
  });

  const handleClick = async (values) => {
    setLoading(true);
    await axios
      .post(`${REACT_APP_API_URL}/mylapay/registration/business_info`, {
        business_name: values.business_name,
        description: values.description,
        daily_sale_amount: values.daily_sale_amount,
        doorNumber: values.door_number,
        streetName: values.street_name,
        Landmark: values.landmark,
        pincode: values.pincode,
        state: values.state.stateCode,
        city: values.city,
        iMCC: values.iMCC.MCC_Code,
        businessType: values.businessType.value,
        // info_type: "contact info",
        // current_step: 1,
        current_step: 3,
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
        console.log(error);
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
    dispatch(setActiveStep(1));
    //handleDialog(false);
  }

  const handleBackContactInfo = () => {
    dispatch(setActiveStep(3));
    //handleDialog(false);
  }

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
    const getMccData = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/state_and_mcc`)
        .then((response) => {
          if (response.data.status === 1) {
            if (!isMounted) return;
            // setMccData(response.data.data);
            setCategoriesData(response.data.data.MCC_Codes);
            setStatesData(response.data.data.States);
            // console.log(response.data.data.States);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getUserData();
    getMccData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (prefillData === null) return;

    if (prefillData.current_step === null) return;
    if (statesData === null) return;
    const preState = statesData.find(
      (item) => item.stateCode === prefillData.State
    );
    const preCat = categoriesData.find(
      (item) => item.MCC_Code === prefillData.iMCC
    );
    const preType = businessData.find(
      (item) => item.value === prefillData.businessType
    );

    formik.setFieldValue("business_name", prefillData.business_name);
    formik.setFieldValue("description", prefillData.description);
    formik.setFieldValue("daily_sale_amount", prefillData.daily_sale_amount);
    formik.setFieldValue("door_number", prefillData.Door_Number);
    formik.setFieldValue("street_name", prefillData.Street_Name);
    formik.setFieldValue("landmark", prefillData.Landmark);
    formik.setFieldValue("pincode", prefillData.pincode);
    formik.setFieldValue("state", preState);
    formik.setFieldValue("city", prefillData.City);
    formik.setFieldValue("iMCC", preCat);
    formik.setFieldValue("businessType", preType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData, statesData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card variant="outlined">
        <CardContent>
          <Box
            maxWidth={600}
            mx="auto"
            px={{ xs: 2, md: 4 }}
            py={{ xs: 3, md: 6 }}
          >
            {businessData && (
              <Box mb={2}>
                <Autocomplete
                  options={businessData}
                  getOptionLabel={(option) => option.name}
                  // getOptionSelected={(option, value) => option.name === value.name}
                  name="businessType"
                  value={formik.values.businessType}
                  disabled="true"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("businessType", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Business Type"
                      variant="outlined"
                      error={
                        formik.touched.businessType &&
                        Boolean(formik.errors.businessType)
                      }
                      helperText={
                        formik.touched.businessType &&
                        formik.errors.businessType
                      }
                    />
                  )}
                />
              </Box>
            )}

            {categoriesData && (
              <Box mb={2}>
                <Autocomplete
                  options={categoriesData}
                  getOptionLabel={(option) => option.ISODescription}
                  name="iMCC"
                  value={formik.values.iMCC}
                  disabled="true"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("iMCC", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Business Category"
                      variant="outlined"
                      error={formik.touched.iMCC && Boolean(formik.errors.iMCC)}
                      helperText={formik.touched.iMCC && formik.errors.iMCC}
                    />
                  )}
                />
              </Box>
            )}
            <Box mb={2}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                label="Description"
                id="description"
                name="description"
                value={formik.values.description}
                disabled="true"
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("description");
                  formik.handleChange(e);
                }}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Business Registered Name"
                id="business_name"
                name="business_name"
                value={formik.values.business_name}
                disabled="true"
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("business_name");
                  formik.handleChange(e);
                }}
                error={
                  formik.touched.business_name &&
                  Boolean(formik.errors.business_name)
                }
                helperText={
                  formik.touched.business_name && formik.errors.business_name
                }
              />
            </Box>
            <Box mb={2}>
              <TextField
                type="number"
                fullWidth
                variant="outlined"
                label="Average daily sale amount"
                id="daily_sale_amount"
                name="daily_sale_amount"
                value={formik.values.daily_sale_amount}
                disabled="true"
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("daily_sale_amount");
                  formik.handleChange(e);
                }}
                error={
                  formik.touched.daily_sale_amount &&
                  Boolean(formik.errors.daily_sale_amount)
                }
                helperText={
                  formik.touched.daily_sale_amount &&
                  formik.errors.daily_sale_amount
                }
              />
            </Box>
            
            <Box mb={2}>
              <TextField
                fullWidth
                rows={3}
                variant="outlined"
                label="Building No."
                id="door_number"
                name="door_number"
                disabled="true"
                value={formik.values.door_number}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("door_number");
                  formik.handleChange(e);
                }}
                error={formik.touched.door_number && Boolean(formik.errors.door_number)}
                helperText={formik.touched.door_number && formik.errors.door_number}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                rows={3}
                variant="outlined"
                label="Street Name"
                id="street_name"
                name="street_name"
                value={formik.values.street_name}
                disabled="true"
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("street_name");
                  formik.handleChange(e);
                }}
                error={formik.touched.street_name && Boolean(formik.errors.street_name)}
                helperText={formik.touched.street_name && formik.errors.street_name}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                rows={3}
                variant="outlined"
                label="Landmark"
                id="landmark"
                name="landmark"
                disabled="true"
                value={formik.values.landmark}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("landmark");
                  formik.handleChange(e);
                }}
                error={formik.touched.landmark && Boolean(formik.errors.landmark)}
                helperText={formik.touched.landmark && formik.errors.landmark}
              />
            </Box>

            <Box mb={2}>
              <TextField
                type="number"
                fullWidth
                variant="outlined"
                label="Pincode"
                id="pincode"
                name="pincode"
                value={formik.values.pincode}
                disabled="true"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                onBlur={(e) => {
                  formik.setFieldTouched("pincode");
                  formik.handleChange(e);
                }}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              />
            </Box>

            {statesData && (
              <Box mb={2}>
                <Autocomplete
                  options={statesData}
                  getOptionLabel={(option) => option.stateName}
                  name="state"
                  value={formik.values.state}
                  disabled="true"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("state", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      variant="outlined"
                      error={
                        formik.touched.state && Boolean(formik.errors.state)
                      }
                      helperText={formik.touched.state && formik.errors.state}
                    />
                  )}
                />
              </Box>
            )}
            <Box mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="City"
                id="city"
                name="city"
                value={formik.values.city}
                disabled="true"
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("city");
                  formik.handleChange(e);
                }}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
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
          variant="outlined"
          color="primary"
          size="large"
          onClick={handleBackContactInfo}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={
            loading ? <CircularProgress size={16} /> : <ArrowForwardIcon />
          }
          style={{ marginLeft: "auto" }}
          onClick={handleNext}
          disabled={loading}
        >
          Next
        </Button>
      </Box>
      {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(formik.errors, null, 2)}</pre> */}
    </form>
  );
}
