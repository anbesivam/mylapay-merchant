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
  proof_name_4: "Partnership Firm PAN",
  identification_number_4: "",
  name_4: "",
  file_4: null,

  type_5: "Company Proof",
  proof_name_5: "GSTN",
  identification_number_5: "",
  name_5: "",
  file_5: null,

  type_6: "Company Proof",
  proof_name_6: "Board Resolution Stating Opting for IPG Services",
  identification_number_6: "",
  name_6: "",
  file_6: null,

  type_7: "Company Proof",
  proof_name_7: "Partnership deed",
  identification_number_7: "",
  name_7: "",
  file_7: null,

  type_8: "Company Proof",
  proof_name_8: "List of Partners",
  identification_number_8: "",
  name_8: "",
  file_8: null,

  type_9: "Bank Account Proof",
  proof_name_9: "Cancelled Cheque leaf",
  identification_number_9: "",
  name_9: "",
  file_9: null,
};

const yupSchema = yup.object({
  identification_number_0: yup
    .mixed()
    .required("Required Field")
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
    .mixed()
    .required("Required Field")
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
    .mixed()
    .required("Required Field")
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
    .mixed()
    .required("Required Field")
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
  name_3: yup.mixed().required("Required Field"),
  file_3: yup.mixed().nullable().required("Required Field"),

  identification_number_4: yup
    .mixed()
    .required("Required Field")
    .test("len", "Enter a valid 10 digit PAN", (val) => {
      if (val) return val.toString().length === 10;
    })
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
  name_4: yup.mixed().required("Required Field"),
  file_4: yup.mixed().nullable().required("Required Field"),

  identification_number_5: yup.mixed().required("Required Field"),
  // name_5: yup.mixed().required("Required Field"),
  file_5: yup.mixed().nullable().required("Required Field"),

  // identification_number_6: yup.mixed().required("Required Field"),
  // name_6: yup.mixed().required("Required Field"),
  file_6: yup.mixed().nullable().required("Required Field"),

  file_9: yup.mixed().nullable().required("Required Field"),
});

export { yupSchema, emptyInitVals };
