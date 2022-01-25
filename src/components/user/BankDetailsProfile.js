import React, { useState,useEffect } from "react";
import {
  TextField,
  Box,
  Card,
  CardContent,
  Button,
  Collapse,
  CircularProgress,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert,Autocomplete } from "@material-ui/lab";
import { useHistory } from "react-router";
import { setActiveStep } from "../../redux/kycSlice";
import { useDispatch } from "react-redux";
import { ArrowBack } from "@material-ui/icons";

export default function BankDetails() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [accountTypeData, setaccountTypeData] = useState([]);
  const [bankNameData, setbankNameData] = useState([]);
  const { REACT_APP_API_URL } = process.env;

  const validationSchema = yup.object({
    accountType: yup.mixed().nullable().required("Required Field"),
    bankName: yup.mixed().nullable().required("Required Field"),
    beneficiaryName: yup
      .string()
      .required("Name is Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
    accountNumber: yup
      .string()
      .required("Account number is required")
      .min(9, "Too Short!")
      .max(18, "Too Long!")
      .test(
        "is-taken",
        "Account number already exist!",
        async (value, testContext) =>
          await axios
            .get(
              `${REACT_APP_API_URL}/mylapay/registration/check/availability?value=${value}&key=bankAccount_number&step=4&iUser=${userDetails.iUser}`
            )
            .then((res) => res.data.data === 1)
      ),
    ifscCode: yup.string().required("IFSC code is required"),
  });

  const formik = useFormik({
    initialValues: {
      accountType: "",
      bankName: "",
      beneficiaryName: "",
      accountNumber: "",
      ifscCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleClick(values);
    },
  });

  const handleClick = async (values) => {
    setLoading(true);
    await axios
      .put(`${REACT_APP_API_URL}/mylapay/registration/merchant_info`, {
        iAccType: values.accountType.iAccType,
        iBank: values.bankName.iBank,
        Beneficiary_name: values.beneficiaryName,
        ifsc_code: values.ifscCode,
        account_number: values.accountNumber,
        info_type: "bank details",
        current_step: 3,
      })
      .then((response) => {
        if (response.data.success === 1) {
          history.push("/post-boarding");
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
    //if (prefillData === null) return;
    // if (prefillData.current_step === null || prefillData.current_step < 1)
    //   return;
    // if(statesData === null) return;

    let temp = JSON.parse(localStorage.getItem("userDetails"));
    console.log(temp);
    //setPrefillData(temp);
    formik.setFieldValue("beneficiaryName", temp.bankAccount_name); 
    formik.setFieldValue("accountNumber", temp.bankAccount_number);
    formik.setFieldValue("ifscCode", temp.bankAccount_ifsc);

     axios
      .get(`${REACT_APP_API_URL}/mylapay/registration/get/banks`)
      .then((response) => {
        if (response.data.status === 1) {
          console.log(response);
          setaccountTypeData(response.data.data[0].Account_Type);
          console.log(accountTypeData);
          const preType = response.data.data[0].Account_Type.find(
            (item) => item.accountType === temp.accountType
          );
          console.log(temp.accountType);
          console.log(preType);
          setbankNameData(response.data.data[0].Bank_List);
          console.log(bankNameData);
          const preBankName = response.data.data[0].Bank_List.find(
            (item) => item.Bank_Name === temp.Bank_Name
          );
          formik.setFieldValue("accountType", preType);
          formik.setFieldValue("bankName", preBankName);
          console.log(preBankName);
          console.log(bankNameData);
        }
      })
      .catch((error) => {
        console.log(error);
      }); 

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card variant="outlined">
        <CardContent>
          <Box maxWidth={600} mx="auto" px={4} py={6}>
            <Box mb={2}>
              <Autocomplete
                options={accountTypeData}
                getOptionLabel={(option) => option.accountType}
                name="accountType"
                value={formik.values.accountType}
                disabled="true"
                onChange={(event, newValue) => {
                  formik.setFieldValue("accountType", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Account Type"
                    variant="outlined"
                    error={formik.touched.accountType && Boolean(formik.errors.accountType)}
                    helperText={formik.touched.accountType && formik.errors.accountType}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Autocomplete
                options={bankNameData}
                getOptionLabel={(option) => option.Bank_Name}
                name="bankName"
                value={formik.values.bankName}
                disabled="true"
                onChange={(event, newValue) => {
                  formik.setFieldValue("bankName", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bank Name"
                    variant="outlined"
                    error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                    helperText={formik.touched.bankName && formik.errors.bankName}
                  />
                )}
              />
            </Box>
            <Box mb={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Beneficiary Name"
                id="beneficiaryName"
                name="beneficiaryName"
                value={formik.values.beneficiaryName}
                disabled="true"
                onChange={formik.handleChange}
                error={
                  formik.touched.beneficiaryName &&
                  Boolean(formik.errors.beneficiaryName)
                }
                helperText={
                  formik.touched.beneficiaryName &&
                  formik.errors.beneficiaryName
                }
              />
            </Box>
            <Box mb={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Account Number"
                id="accountNumber"
                name="accountNumber"
                value={formik.values.accountNumber}
                disabled="true"
                onChange={(e) => {
                  formik.setFieldTouched("accountNumber");
                  formik.handleChange(e);
                }}
                error={
                  formik.touched.accountNumber &&
                  Boolean(formik.errors.accountNumber)
                }
                helperText={
                  formik.touched.accountNumber && formik.errors.accountNumber
                }
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                label="IFSC Code"
                id="ifscCode"
                name="ifscCode"
                value={formik.values.ifscCode}
                disabled="true"
                onChange={formik.handleChange}
                error={
                  formik.touched.ifscCode && Boolean(formik.errors.ifscCode)
                }
                helperText={formik.touched.ifscCode && formik.errors.ifscCode}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  minWidth: "49%",
                  color: "#fff"
                }}
                  
                >
                  Digital Agreement
              </Button>
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
          onClick={() => dispatch(setActiveStep(1))}
          startIcon={<ArrowBack />}
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
          component={Link}
          to={"/"}
          disabled={loading}
        >
          Go to main menu
        </Button>
      </Box>
    </form>
  );
}
