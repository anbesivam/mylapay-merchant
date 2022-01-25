import axios from "axios";
import * as yup from "yup";
const { REACT_APP_API_URL } = process.env;

const emptyInitVals = {
  type_0: "Merchant Personal Id proof",
  proof_name_0: "PAN Card",
  identification_number_0: "",
  name_0: "",
  file_0: null,
  type_1: "Merchant Personal Id proof",
  proof_name_1: "Aadhaar",
  identification_number_1: "",
  name_1: "",
  file_1: null,
  type_2: "Business Address Proof",
  proof_name_2: "Select any one",
  identification_number_2: "",
  name_2: "",
  file_2: null,
  type_3: "Bank Account Proof",
  proof_name_3: "Cancelled Cheque leaf",
  identification_number_3: "",
  name_3: "",
  file_3: null,
  type_4: "GSTN",
  proof_name_4: "Registered GSTN Certificate",
  identification_number_4: "",
  name_4: "",
  file_4: null,
};

const businessProofOptions = [
  "Select any one",
  "Telephone bill",
  "Internet bill",
  "Electricity bill",
  "Shop Agreement",
  "Bank Statement",
  "Same as Aadhaar",
];

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
    .test("len", "Enter valid 12 digit Aadhar Number", (val) => {
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

  proof_name_2: yup
    .mixed()
    .required("Required Field")
    .test(
      "is-selected",
      "Please select a value",
      (value, context) => value !== "Select any one"
    ),
  // identification_number_2: yup.mixed().required("Required Field"),
  // name_2: yup.mixed().required("Required Field"),
  file_2: yup.mixed().nullable().required("Required Field"),

  file_3: yup.mixed().nullable().required("Required Field"),
  identification_number_4:yup
  .string()
  .matches(/^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[Zz]{1}[0-9a-zA-Z]{1}$/,"Enter Valid GSTIN"),
});

export { businessProofOptions, yupSchema, emptyInitVals };
