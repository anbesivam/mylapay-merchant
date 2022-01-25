import axios from "axios";
import * as yup from "yup";
const { REACT_APP_API_URL } = process.env;
  
const emptyInitVals = {
  type_0: "Merchant Personal Id proof",
  proof_name_0: "PAN Card",
  identification_number_0: "",
  name_0: "",
  file_0: null,
  party_0: 1,

  type_1: "Merchant Personal Id proof",
  proof_name_1: "Aadhaar",
  identification_number_1: "",
  name_1: "",
  file_1: null,
  party_1: 1,

  type_2: "Merchant Personal Id proof",
  proof_name_2: "PAN Card",
  identification_number_2: "",
  name_2: "",
  file_2: null,
  party_2: 2,

  type_3: "Merchant Personal Id proof",
  proof_name_3: "Aadhaar",
  identification_number_3: "",
  name_3: "",
  file_3: null,
  party_3: 2,

  type_4: "Company Proof",
  proof_name_4: "MOA",
  identification_number_4: "",
  name_4: "",
  file_4: null,

  type_5: "Company Proof",
  proof_name_5: "AOA",
  identification_number_5: "",
  name_5: "",
  file_5: null,

  type_6: "Company Proof",
  proof_name_6: "Certificate of Incorporation",
  identification_number_6: "",
  name_6: "",
  file_6: null,

  type_7: "Company Proof",
  proof_name_7: "Company PAN",
  identification_number_7: "",
  name_7: "",
  file_7: null,

  type_8: "Company Proof",
  proof_name_8: "GSTN",
  identification_number_8: "",
  name_8: "",
  file_8: null,

  type_9: "Company Proof",
  proof_name_9: "Board Resolution Stating Opting for IPG Services",
  identification_number_9: "",
  name_9: "",
  file_9: null,

  type_10: "Company Proof",
  proof_name_10: "List of Directors",
  identification_number_10: "",
  name_10: "",
  file_10: null,

  type_11: "Bank Account Proof",
  proof_name_11: "Cancelled Cheque leaf",
  identification_number_11: "",
  name_11: "",
  file_11: null,
};

const yupSchema = yup.object({
  identification_number_0: yup
    .string()
    .required("Required Field")
    .test("len", "Enter a valid 10 digit PAN", (val) => {
      if (val) return val.toString().length === 10;
    })
    .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,"PAN number is not valid!")
    .test(
      "is-taken",
      "Already Exist!",
      async (value, testContext) =>
        await axios
          .get(`${REACT_APP_API_URL}/mylapay/registration/check/availability`, {
            params: {
              step: 2,
              proofName: "PAN Card",
              identificationNumber: value,
            },
          })
          .then((res) => res.data.data === 1)
    ),
  name_0: yup.mixed().required("Required Field"),
  file_0: yup.mixed().nullable().required("Required Field"),

  identification_number_1: yup
    .string()
    .required("Required Field")
    .matches(/^[0-9\s]+$/, "Only Numbers are allowed for this field ")
    .test("len", "Enter a valid 12 digit Aadhar Number", (val) => {
      if (val) return val.toString().length === 12;
    })
    .test(
      "is-taken",
      "Already Exist!",
      async (value, testContext) =>
        await axios
          .get(`${REACT_APP_API_URL}/mylapay/registration/check/availability`, {
            params: {
              step: 2,
              proofName: "Aadhaar",
              identificationNumber: value,
            },
          })
          .then((res) => res.data.data === 1)
    ),
  name_1: yup.mixed().required("Required Field"),
  file_1: yup.mixed().nullable().required("Required Field"),

  identification_number_2: yup
    .string()
    .required("Required Field")
    .test("len", "Enter a valid 10 digit PAN", (val) => {
      if (val) return val.toString().length === 10;
    })
    .test(
      "is-taken",
      "Director 2 PAN number is same as Director 1 PAN number",(value, testContext) =>{
        if(value) return value !== testContext.from[0].value.identification_number_0;
      }
    )
    .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,"PAN number is not valid!")
    .test(
      "is-taken",
      "Already Exist!",
      async (value, testContext) =>
        await axios
          .get(`${REACT_APP_API_URL}/mylapay/registration/check/availability`, {
            params: {
              step: 2,
              proofName: "PAN Card",
              identificationNumber: value,
            },
          })
          .then((res) => res.data.data === 1)
    ),
  name_2: yup.mixed().required("Required Field"),
  file_2: yup.mixed().nullable().required("Required Field"),

  identification_number_3: yup
    .string()
    .required("Required Field")
    .matches(/^[0-9\s]+$/, "Only Numbers are allowed for this field ")
    .test("len", "Enter a valid 12 digit Aadhar Number", (val) => {
      if (val) return val.toString().length === 12;
    })
    .test(
      "is-taken",
      "Director 2 Aadhar number is same as Director 1 Aadhar number",(value, testContext) =>{
        if(value) return value !== testContext.from[0].value.identification_number_1;
      }
    )
    .test(
      "is-taken",
      "Already Exist!",
      async (value, testContext) =>
        await axios
          .get(`${REACT_APP_API_URL}/mylapay/registration/check/availability`, {
            params: {
              step: 2,
              proofName: "Aadhaar",
              identificationNumber: value,
            },
          })
          .then((res) => res.data.data === 1)
    ),
  name_3: yup.mixed().required("Required Field"),
  file_3: yup.mixed().nullable().required("Required Field"),

  // identification_number_4: yup.mixed().required("Required Field"),
  // name_4: yup.mixed().required("Required Field"),
  file_4: yup.mixed().nullable().required("Required Field"),

  // identification_number_5: yup.mixed().required("Required Field"),
  // name_5: yup.mixed().required("Required Field"),
  file_5: yup.mixed().nullable().required("Required Field"),

  // identification_number_6: yup.mixed().required("Required Field"),
  // name_6: yup.mixed().required("Required Field"),
  file_6: yup.mixed().nullable().required("Required Field"),

  identification_number_7: yup
    .string()
    .required("Required Field")
    .test("len", "Enter a valid 10 digit PAN", (val) => {
      if (val) return val.toString().length === 10;
    })
    .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,"PAN number is not valid!")
    .test(
      "is-taken",
      "Company PAN number should not be same as Director 1 or Director 2 PAN number",(value, testContext) =>{
        if(value) return value !== testContext.from[0].value.identification_number_0; 
      }
    )
    .test(
      "is-taken",
      "Company PAN number should not be same as Director 1 or Director 2 PAN number",(value, testContext) =>{
        if(value) return value !== testContext.from[0].value.identification_number_2; 
      }
    )
    .test(
      "is-taken",
      "Already Exist!",
      async (value, testContext) =>
        await axios
          .get(`${REACT_APP_API_URL}/mylapay/registration/check/availability`, {
            params: {
              step: 2,
              proofName: "PAN Card",
              identificationNumber: value,
            },
          })
          .then((res) => res.data.data === 1)
    ),

  name_7: yup.mixed().required("Required Field"),
  file_7: yup.mixed().nullable().required("Required Field"),

  identification_number_8: yup
  .string()
  .required("Required Field")
  .matches(/^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[Zz]{1}[0-9a-zA-Z]{1}$/,"Enter Valid GSTIN"),
  // name_8: yup.mixed().required("Required Field"),
  file_8: yup.mixed().nullable().required("Required Field"),

  // identification_number_9: yup.mixed().required("Required Field"),
  // name_9: yup.mixed().required("Required Field"),
  file_9: yup.mixed().nullable().required("Required Field"),

  // identification_number_10: yup.mixed().required("Required Field"),
  // name_10: yup.mixed().required("Required Field"),
  // file_10: yup.mixed().nullable().required("Required Field"),

  file_11: yup.mixed().nullable().required("Required Field"),
});

export { yupSchema, emptyInitVals };
