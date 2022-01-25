import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Box,
  Card,
  CardContent,
  Button,
  Collapse,
  Typography,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert, Autocomplete } from "@material-ui/lab";
//import { useHistory } from "react-router";
import { setActiveStep } from "../../redux/kycSlice";
import { useDispatch } from "react-redux";
import { ArrowBack } from "@material-ui/icons";
import Survey from "./Survey";
import DigitalAgreement from "./DigitalAgreement";
import { Container } from "@material-ui/core";
import { jsPDF } from "jspdf";
import ReactToPrint from "react-to-print";
import domtoimage from "dom-to-image";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function BankDetails() {
  //const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [showSurvey, setShowSurvey] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bankData, setBankData] = useState(null);
  const [accountTypeData, setAccountTypeData] = useState(null);
  const [showDigitalAgreement, setShowDigitalAgreement] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [uploadFile, setUploadFile] = useState();
  const { REACT_APP_API_URL, REACT_APP_SHOPAPI_URL } = process.env;
  const componentRef = useRef();
  // console.log(userDetails);

  const validationSchema = yup.object({
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
      beneficiaryName: "",
      accountNumber: "",
      ifscCode: "",
      iBank: "",
      bankName: "",
      iAccType: "",
      accountType: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleClick(values);
    },
  });

  const handleClick = async (values) => {
    setError(false);
    setLoading(true);
    await axios
      .put(`${REACT_APP_API_URL}/mylapay/registration/merchant_info`, {
        Beneficiary_name: values.beneficiaryName,
        ifsc_code: values.ifscCode,
        account_number: values.accountNumber,
        iBank: values.bankName.iBank,
        iAccType: values.accountType.iAccType,
        info_type: "bank details",
        current_step: 3,
        payuDigitalAgreement: 1,
      })
      .then((response) => {
        if (response.data.success === 1) {
          // history.push("/post-boarding");
          setSuccess(true);
          setShowSurvey(true);
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
  const sendAttachment = async () => {
    await axios
      .get(
        `${REACT_APP_SHOPAPI_URL}/mylapay/registration/test/email-attachment`
      )
      .then((response) => {
        if (response.data.status === 1) {
          console.log("success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let isMounted = true;
    const getBankDetails = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/get/banks`)
        .then((response) => {
          if (response.data.status === 1) {
            if (!isMounted) return;
            setBankData(response.data.data[0].Bank_List);
            setAccountTypeData(response.data.data[0].Account_Type);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getBankDetails();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (bankData === null) return;
    if (accountTypeData === null) return;

    const preBankData = bankData.find(
      (item) => item.iAccType === formik.values.iBank
    );
    const preAccTypeData = accountTypeData.find(
      (item) => item.MCC_Code === formik.values.iAccType
    );
    formik.setFieldValue("bankName", preBankData);
    formik.setFieldValue("accountType", preAccTypeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankData]);

  const handleDigitalAgreement = () => {
    setShowDigitalAgreement(true);
  };
  const handleDigital = (showAgree, agree) => {
    setShowDigitalAgreement(showAgree);
    //console.log(agree);
    // if(agree === "agree"){
    //   setAgreement(true);
    // } else{
    //   setAgreement(false);
    // }
  };

  const handleChangechk = async (event) => {
    if (event.target.checked) {
      //console.log(event.target.checked);
      //setShowDigitalAgreement(true);
      setAgreement(true);
      pdfDownload(event);
      // await axios
      //   .get(`${REACT_APP_SHOPAPI_URL}/mylapay/registration/test/email-attachment`)
      //   .then((response) => {
      //     if (response.data.status === 1) {
      //       console.log("success");
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    } else {
      //console.log(event.target.checked);
      //setShowDigitalAgreement(false);
      setAgreement(false);
    }
  };

  const showAgreementPopup = () => {
    setShowDigitalAgreement(true);
    //setAgreement(true);
  };

  const addFooters = async (doc) => {
    const pageCount = doc.internal.getNumberOfPages();

    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Adding Header
      await domtoimage
        .toPng(document.getElementById("pdf-header"), { quality: 1.0 })
        .then(function (dataUrl) {
          doc.addImage(dataUrl, "png", 0, 0, 790, 118);
        })
        .catch(function (error) {
          alert("Error while adding header!");
        });

      // Adding Footer
      await domtoimage
        .toPng(document.getElementById("pdf-footer"), { quality: 1.0 })
        .then(function (dataUrl) {
          doc.addImage(dataUrl, "png", 0, 869, 790, 248);
        })
        .catch(function (error) {
          alert("Error while adding footer!");
        });
    }
    // window.open(doc.output("bloburl"), "_blank");
    setUploadFile(doc.output("blob"));

    doc.save("Agreement.pdf");
  };

  const pdfDownload = (e) => {
    e.preventDefault();
    //console.log(e);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [790, 1117],
    });
    doc.html(document.getElementById("pdf-view"), {
      margin: [120, 0, 260, 0],
      callback: () => {
        addFooters(doc);
      },
    });
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card variant="outlined">
          <CardContent>
            <Box maxWidth={600} mx="auto" px={4} py={6}>
              {bankData && (
                <Box mb={1}>
                  <Autocomplete
                    options={bankData}
                    //getOptionLabel={(option) => option.Bank_Name}
                    getOptionLabel={(option) =>
                      option ? option.Bank_Name : ""
                    }
                    name="bankName"
                    value={formik.values.bankName}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("bankName", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Bank"
                        variant="outlined"
                        error={
                          formik.touched.bankName &&
                          Boolean(formik.errors.bankName)
                        }
                        helperText={
                          formik.touched.bankName && formik.errors.bankName
                        }
                      />
                    )}
                  />
                </Box>
              )}
              {accountTypeData && (
                <Box mb={1}>
                  <Autocomplete
                    options={accountTypeData}
                    //getOptionLabel={(option) => option.accountType}
                    getOptionLabel={(option) =>
                      option ? option.accountType : ""
                    }
                    name="accountType"
                    value={formik.values.accountType}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("accountType", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Account Type"
                        variant="outlined"
                        error={
                          formik.touched.accountType &&
                          Boolean(formik.errors.accountType)
                        }
                        helperText={
                          formik.touched.accountType &&
                          formik.errors.accountType
                        }
                      />
                    )}
                  />
                </Box>
              )}
              <Box mb={1}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Beneficiary Name"
                  id="beneficiaryName"
                  name="beneficiaryName"
                  value={formik.values.beneficiaryName}
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
              <Box mb={1}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Account Number"
                  id="accountNumber"
                  name="accountNumber"
                  value={formik.values.accountNumber}
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
                  onChange={formik.handleChange}
                  error={
                    formik.touched.ifscCode && Boolean(formik.errors.ifscCode)
                  }
                  helperText={formik.touched.ifscCode && formik.errors.ifscCode}
                />
              </Box>
              {/* <Box mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    minWidth: "150px",
                    height: "40px",
                    color: "#fff"
                  }}
                   onClick={handleDigitalAgreement} 
                   disabled={(formik.values.bankName !== "" && formik.values.accountType !== "" && formik.values.beneficiaryName !== "" && formik.values.ifscCode !== "" && formik.values.accountNumber !== "") ? false : true}
                  >
                    Digital Agreement
                </Button>
              </Box> */}
              <Box mt={2} style={{ display: "flex" }}>
                <Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ padding: "6px" }}
                          onChange={handleChangechk}
                          disabled={
                            formik.values.bankName !== "" &&
                            formik.values.accountType !== "" &&
                            formik.values.beneficiaryName !== "" &&
                            formik.values.ifscCode !== "" &&
                            formik.values.accountNumber !== ""
                              ? false
                              : true
                          }
                        />
                      }
                    />
                  </FormGroup>
                </Typography>
                <a
                  href="javascript:void(0)"
                  onClick={showAgreementPopup}
                  style={{
                    marginTop: "5px",
                    color: "#333",
                    textDecoration: "none",
                    borderBottom: "1px solid black",
                    marginBottom: "8px",
                  }}
                >
                  Merchant Agreement
                </a>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <DigitalAgreement
          showDigitalAgreement={showDigitalAgreement}
          setShowDigitalAgreement={setShowDigitalAgreement}
          pageData={{
            bankName: formik.values.bankName,
            accountType: formik.values.accountType,
            beneficiaryName: formik.values.beneficiaryName,
            ifscCode: formik.values.ifscCode,
            accountNumber: formik.values.accountNumber,
            userDetails: userDetails,
          }}
          setUploadFile={setUploadFile}
          handleDigital={handleDigital}
        />

        <Collapse in={error}>
          <Box mt={2}>
            <Alert severity="error">{errorMsg}</Alert>
          </Box>
        </Collapse>

        <Collapse in={success}>
          <Box mt={2}>
            <Alert severity="success">Details submitted successfully!</Alert>
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
            type="submit"
            disabled={loading || !agreement}
          >
            Save and continue
          </Button>
        </Box>
      </form>

      <Survey showSurvey={showSurvey} setShowSurvey={setShowSurvey} />
      <Dialog
        open={false}
        //onClose={() => setShowDigitalAgreement(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>
          <div>{`Nodal Registration Authorization`} </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ReactToPrint
              trigger={() => (
                <Button
                  color="secondary"
                  variant="contained"
                  disableElevation
                  style={{ color: "#fff" }}
                >
                  Print out
                </Button>
              )}
              content={() => componentRef.current}
            />
            <Button
              color="secondary"
              variant="contained"
              disableElevation
              style={{ color: "#fff", marginLeft: "1em" }}
              onClick={pdfDownload}
            >
              Download pdf
            </Button>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContentText>
            <Container>
              <table
                ref={componentRef}
                className="template-wrap hideDigital"
                cellspacing="0"
                cellpadding="0"
              >
                <thead>
                  <tr>
                    <td>
                      <div id="pdf-header" className="header">
                        <div className="brand">
                          <div className="title">{`${userDetails.business_name}`}</div>
                        </div>
                        <div className="header-bar">
                          <div className="header-bar-grey"></div>
                          <div className="header-bar-blue"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div id="pdf-view" className="template-body">
                        <p>
                          <b>To,</b>
                        </p>
                        <p>
                          PayU Payments Private Limited,
                          <br />
                          4th Floor, Pearl Tower,
                          <br />
                          Plot Number -51, Sector 32,
                          <br />
                          Gurgaon – 122001 Haryana
                        </p>

                        <p>Dear Sir,</p>

                        <p>
                          <b>
                            Subject: Authorization for Nodal Bank Registration
                          </b>
                        </p>
                        <p>
                          <b>{formik.values.beneficiaryName}</b>, a sole
                          proprietorship/partnership/company (hereinafter
                          referred to as “Sub-Merchant”), having its registered
                          office at{" "}
                          <b>
                            {`${userDetails.Door_Number}, ${userDetails.Street_Name}, ${userDetails.Landmark}, ${userDetails.City} - ${userDetails.pincode}`}{" "}
                          </b>{" "}
                          entered into an agreement with <span>Payu</span>{" "}
                          (hereinafter referred to a “Master Merchant”) on{" "}
                          {new Date().toString()} in order to sell Products on
                          Mastervfc Merchant s Website{" "}
                          <b>https://www.mylapay.com</b> (“Website”) and collect
                          payments for purchase of the Products by Customers
                          online.
                        </p>
                        <p>
                          The Sub-Merchant has been given to understand that
                          Master Merchant has entered into a service agreement
                          with PayU (“Agreement”) for using the aggregate
                          Internet Payment Gateway Solutions offered by PayU
                          Payments Private Limited (“PayU”) in order to
                          facilitate the Customers to make payment of Customer
                          Charge and facilitate the Sub-Merchants to collect
                          Payments for purchase of products through its Website.
                        </p>
                        <p>
                          The Sub-Merchant understands and accepts that the
                          Payments made by its Customers will be settled through
                          PayU’s Nodal Account. The Sub-Merchant understands
                          that PayU is required to register Sub-Merchant with
                          PayU at PayUMoney.com and its Nodal Bank in order to
                          settle the Payments. Sub-Merchant consent and
                          authorize PayU to register it with PayUMoney.com and
                          its Nodal Bank and to settle the Payments to
                          Sub-Merchant designated bank account, the details of
                          which are provided below:
                        </p>
                        <p>
                          Name of Bank: <b>{formik.values.Bank_Name}</b>
                          <br />
                          Name of Legal Entity on Bank Account:{" "}
                          <b>{formik.values.beneficiaryName}</b>
                          <br />
                          Bank Account Number:{" "}
                          <b>{formik.values.accountNumber}</b>
                          <br />
                          IFSC Code: <b>{formik.values.ifscCode}</b>
                        </p>
                        <p>
                          Sub-Merchant agrees to provide all assistance to PayU
                          in order to complete the PayU and Nodal Bank
                          registration process and provide PayU with the
                          following details and documents:
                        </p>
                        <ol>
                          <li>attested copy of Pan Card of Legal Entity</li>
                          <li>cancelled cheque</li>
                          <li>
                            Such other information as may be requested by PayU
                            from time to time
                          </li>
                        </ol>
                        <p>
                          The Sub-Merchant agrees to comply with and be bound by
                          the Agreement, the sub-merchant terms and conditions
                          on PayUMoney.com and all obligations thereunder with
                          respect to the Sub-Merchants and indemnify PayU and
                          the Acquiring Banks with respect to any breach of the
                          Sub-merchant’s obligations under the Agreement. The
                          Sub-Merchant understands and agrees that PayU will be
                          settling and distributing the Payments collected from
                          the Customers to the Sub-Merchant in the manner
                          instructed by the Master Merchant. Notwithstanding
                          anything stated in this letter, the Sub-Merchant
                          acknowledges that PayU shall not be liable in any
                          manner whatsoever to the Sub-Merchant, its Customers
                          or any third party with respect to the manner in which
                          the Payments are settled and distributed and all
                          disputes and claim shall be settled between the Master
                          Merchant and the Sub-Merchant, without making PayU a
                          party to any such dispute claim, proceeding, etc.
                        </p>
                        <p>
                          The Sub-Merchant represent, warrant and undertakes
                          that:
                        </p>
                        <ol type="a">
                          <li>
                            it is duly organized and validly existing under the
                            laws of the India;
                          </li>
                          <li>
                            the execution and the delivery of this letter and
                            the authorization and consent provided herein does
                            not breach the Sub-Merchant&lsquo;s organizational
                            documents or any law, provisions of any contract or
                            order of court applicable to the Sub-Merchant; and
                          </li>
                          <li>
                            has obtained the requisite approvals, licenses,
                            registration, etc in accordance to the laws, rules,
                            regulations in force in India, in order to sell the
                            Products.
                          </li>
                          <li>
                            The person executing this Agreement is duly
                            authorized to execute the Agreement for and on
                            behalf of the respective Party and shall have the
                            authority to bind the respective Party accordingly.
                          </li>
                        </ol>
                        <p>
                          For the Purpose of this letter, the following words
                          and expressions shall have the following meanings:
                        </p>
                        <p>
                          "Products" shall mean goods and/or services offered
                          for sale by the Sub-Merchant on the Master Merchant’s
                          Website.
                        </p>
                        <p>
                          “Customer” means persons who will purchase Products,
                          offered by the Sub-Merchant on the Master Merchant’s
                          Website and through the Internet Payment Gateway using
                          a Valid Card or net banking account or any other
                          acceptable modes of payment mechanism, provided by
                          PayU.
                        </p>
                        <p>
                          “Nodal Account" shall mean the nodal bank account held
                          by PayU with any of the bank for the purpose of
                          facilitating online payments with respect to RBI
                          notification dated 24th Nov 2009.
                        </p>
                        <p>
                          “Sub-Merchant” shall mean distributors and franchisees
                          who a have entered into a contract with the Master
                          Merchant in order to sell the Products to Customers
                          through the Master Merchant on the Website.
                        </p>
                        <p>
                          “Payments” shall mean Customer Charge minus the
                          Transaction Discount Rate.
                        </p>
                        <p>For [●]:</p>
                        <div>
                          <h3 className="signature_valid">Signature Valid</h3>
                          <p className="digital_signed_by">
                            Digitally signed by
                          </p>
                          <p className="signature_person">
                            {formik.values.beneficiaryName}
                          </p>
                          <p className="signature_date">
                            {new Date().toString()}
                          </p>
                          <img
                            className="site-logo"
                            src="/checked.png"
                            alt="Mylapay Logo"
                            width="290px"
                            height="70px"
                            style={{
                              maxWidth: "500px",
                              maxHeight: "100%",
                              position: "relative",
                              top: "-85px",
                              left: "96px",
                              width: "54px",
                              height: "auto",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <td>
                      <div id="pdf-footer">
                        <div className="template-footer">
                          <div className="phone-grid">
                            <div className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-telephone-fill"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                                />
                              </svg>
                            </div>
                            <div className="footer-text">
                              <div>{`${userDetails.contact_no}`}</div>
                              {/* <div>(33) 785 9865 4780</div> */}
                            </div>
                          </div>
                          <div className="email-grid">
                            <div className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-globe2"
                                viewBox="0 0 16 16"
                              >
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                              </svg>
                            </div>
                            <div className="footer-text">
                              <div>{`${userDetails.contact_email}`}</div>
                              {/* //<div>www.jsn-smith.com</div> */}
                            </div>
                          </div>
                        </div>

                        <div className="template-bottom-bar">
                          <div className="template-bottom-address">
                            <div className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-geo-alt-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                              </svg>
                            </div>
                            <div className="address-text">
                              {`${userDetails.Door_Number},${userDetails.Street_Name},${userDetails.City}`}
                            </div>
                          </div>
                          <div className="template-bottom-link"></div>
                          <div className="template-bottom-right"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              backgroundColor: "#248de7",
              color: "white",
            }}
            // onClick={() => {
            //   setMerchantAgree(true);
            //   setDigitalAgree(false);
            // }}
            color="primary"
          >
            Merchant Agreement
          </Button>
          <Button
            style={{
              backgroundColor: "#248de7",
              color: "white",
            }}
            // onClick={() => {
            //   setDigitalAgree(true);
            //   setMerchantAgree(false);
            // }}
            color="primary"
          >
            Nodal Registration authorization
          </Button>
          <Button
            style={{
              backgroundColor: "rgb(239 4 102)",
              color: "white",
            }}
            onClick={() => handleDigital(false, "agree")}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
