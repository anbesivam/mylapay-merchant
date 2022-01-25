import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  MenuItem,
  Box,
  Button,
  Collapse,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import businessData from "./businessData";
import FileUpload from "./FileUpload";
import { useFormik } from "formik";
import * as yup from "yup";
import { setActiveStep } from "../../../redux/kycSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function TempReq() {
  const tempReqData = businessData[5].proof;
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const { REACT_APP_API_URL } = process.env;
  
  const handleSubmit = async (values) => {
    if (
      values.proof_name_0 === 0 &&
      values.proof_name_1 === 0 &&
      values.proof_name_2 === 0 &&
      values.proof_name_3 === 0 &&
      values.proof_name_4 === 0
    ) {
      setError(true);
      setErrorMsg("Please select at least one proof");
      return;
    }
    setLoading(true);
    let formData = new FormData();
    let busDetArray = [];

    // Append Inputs data
    for (let i = 0; i < 5; i++) {
      if (values["proof_name_" + i] === 0) continue;

      busDetArray.push({
        proof_name: values["proof_name_" + i],
        type: values["proof_type_" + i],
        identification_number: values["identification_number_" + i],
        name: values["name_" + i],
        file_name: values["file_" + i] ? values["file_" + i].name : "",
      });
    }

    // Append Files
    if (values.file_0 !== null) {
      formData.append("id_proof", values.file_0);
    }
    if (values.file_1 !== null) {
      formData.append("personal_address", values.file_1);
    }
    if (values.file_2 !== null) {
      formData.append("business_address", values.file_2);
    }
    if (values.file_3 !== null) {
      formData.append("statement", values.file_3);
    }
    if (values.file_4 !== null) {
      formData.append("letter_of_req", values.file_4);
    }

    formData.append("business_type", "tempruary_req_mela");
    formData.append("business_details", JSON.stringify(busDetArray));
    formData.append("current_step", 3);

    await axios
      .put(`${REACT_APP_API_URL}/mylapay/registration/upload_docs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          dispatch(setActiveStep(3));
        } else {
          setError(true);
          setErrorMsg(res.data.message);
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

  const setFile = (e, elName) => {
    formik.setFieldValue(elName, e.currentTarget.files[0]);
  };

  const validationSchema = yup.object({
    identification_number_0: yup.mixed()
    .test("len", "Enter a valid 10 digit PAN", (val) => {
      if (val) return val.toString().length === 10;
    })
    .when("proof_name_0", {
      is: (val) => val > 0,
      then: yup.mixed().required("Id is required"),
    }),
    name_0: yup.mixed().when("proof_name_0", {
      is: (val) => val > 0,
      then: yup.mixed().required("Name is required"),
    }),
    file_0: yup.mixed().when("proof_name_0", {
      is: (val) => val > 0,
      then: yup.mixed().required("File is required"),
    }),

    identification_number_1: yup.mixed().when("proof_name_1", {
      is: (val) => val > 0,
      then: yup.mixed().required("Id is required"),
    }),
    name_1: yup.mixed().when("proof_name_1", {
      is: (val) => val > 0,
      then: yup.mixed().required("Name is required"),
    }),
    file_1: yup.mixed().when("proof_name_1", {
      is: (val) => val > 0,
      then: yup.mixed().required("File is required"),
    }),

    identification_number_2: yup.mixed().when("proof_name_2", {
      is: (val) => val > 0,
      then: yup.mixed().required("Id is required"),
    }),
    name_2: yup.mixed().when("proof_name_2", {
      is: (val) => val > 0,
      then: yup.mixed().required("Name is required"),
    }),
    file_2: yup.mixed().when("proof_name_2", {
      is: (val) => val > 0,
      then: yup.mixed().required("File is required"),
    }),

    identification_number_3: yup.mixed().when("proof_name_3", {
      is: (val) => val > 0,
      then: yup.mixed().required("Id is required"),
    }),
    name_3: yup.mixed().when("proof_name_3", {
      is: (val) => val > 0,
      then: yup.mixed().required("Name is required"),
    }),
    file_3: yup.mixed().when("proof_name_3", {
      is: (val) => val > 0,
      then: yup.mixed().required("File is required"),
    }),

    identification_number_4: yup.mixed().when("proof_name_4", {
      is: (val) => val > 0,
      then: yup.mixed().required("Id is required"),
    }),
    name_4: yup.mixed().when("proof_name_4", {
      is: (val) => val > 0,
      then: yup.mixed().required("Name is required"),
    }),
    file_4: yup.mixed().when("proof_name_4", {
      is: (val) => val > 0,
      then: yup.mixed().required("File is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      proof_type_0: "Merchant Personal ID Proof",
      proof_name_0: 0,
      identification_number_0: "",
      name_0: "",
      file_0: null,

      proof_type_1: "Merchant Personal Address Proof",
      proof_name_1: 0,
      identification_number_1: "",
      name_1: "",
      file_1: null,

      proof_type_2: "Business Address Proof",
      proof_name_2: 0,
      identification_number_2: "",
      name_2: "",
      file_2: null,

      proof_type_3: "Bank Statement",
      proof_name_3: 0,
      identification_number_3: "",
      name_3: "",
      file_3: null,

      proof_type_4: "Letter of Req. from Authorized Person",
      proof_name_4: 0,
      identification_number_4: "",
      name_4: "",
      file_4: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_docs`)
        .then((response) => {
          if (response.data.success === 1) {
            if (!isMounted) return;
            let fillData = response.data.data.filter(
              (item) => item.firmType === "tempruary_req_mela"
            );
            if (fillData.length === 0) return;
            setPrefillData(fillData);
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

    for (let i = 0; i < prefillData.length; i++) {
      const el = prefillData[i];
      switch (el.proofType) {
        case "Merchant Personal ID Proof":
          formik.setFieldValue("proof_name_0", el.proofName);
          formik.setFieldValue(
            "identification_number_0",
            el.identificationNumber
          );
          formik.setFieldValue("name_0", el.nameAsPerDoc);
          formik.setFieldValue("file_0", {
            filePath: el.filePath,
            name: el.file_name,
          });
          break;

        case "Merchant Personal Address Proof":
          formik.setFieldValue("proof_name_1", el.proofName);
          formik.setFieldValue(
            "identification_number_1",
            el.identificationNumber
          );
          formik.setFieldValue("name_1", el.nameAsPerDoc);
          formik.setFieldValue("file_1", {
            filePath: el.filePath,
            name: el.file_name,
          });
          break;

        case "Business Address Proof":
          formik.setFieldValue("proof_name_2", el.proofName);
          formik.setFieldValue(
            "identification_number_2",
            el.identificationNumber
          );
          formik.setFieldValue("name_2", el.nameAsPerDoc);
          formik.setFieldValue("file_2", {
            filePath: el.filePath,
            name: el.file_name,
          });
          break;

        case "Bank Statement":
          formik.setFieldValue("proof_name_3", el.proofName);
          formik.setFieldValue(
            "identification_number_3",
            el.identificationNumber
          );
          formik.setFieldValue("name_3", el.nameAsPerDoc);
          formik.setFieldValue("file_3", {
            filePath: el.filePath,
            name: el.file_name,
          });
          break;

        case "Letter of Req. from Authorized Person":
          formik.setFieldValue("proof_name_4", el.proofName);
          formik.setFieldValue(
            "identification_number_4",
            el.identificationNumber
          );
          formik.setFieldValue("name_4", el.nameAsPerDoc);
          formik.setFieldValue("file_4", {
            filePath: el.filePath,
            name: el.file_name,
          });
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
          borderTop: "none",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
        }}
        mx="auto"
        px={4}
        pb={6}
        pt={4}
      >
        {tempReqData &&
          tempReqData.map((item, index) => {
            return (
              <Grid key={item.type} container spacing={4}>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={item.type}
                    id={`proof_name_${index}`}
                    name={`proof_name_${index}`}
                    select
                    value={formik.values["proof_name_" + index]}
                    onChange={formik.handleChange}
                    error={
                      formik.touched["proof_name_" + index] &&
                      Boolean(formik.errors["proof_name_" + index])
                    }
                    helperText={
                      formik.touched["proof_name_" + index] &&
                      formik.errors["proof_name_" + index]
                    }
                  >
                    {item.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Id Number"
                    id={`identification_number_${index}`}
                    name={`identification_number_${index}`}
                    value={formik.values["identification_number_" + index]}
                    onChange={formik.handleChange}
                    error={
                      formik.touched["identification_number_" + index] &&
                      Boolean(formik.errors["identification_number_" + index])
                    }
                    helperText={
                      formik.touched["identification_number_" + index] &&
                      formik.errors["identification_number_" + index]
                    }
                  ></TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Name as per Id"
                    id={`name_${index}`}
                    name={`name_${index}`}
                    value={formik.values["name_" + index]}
                    onChange={formik.handleChange}
                    error={
                      formik.touched["name_" + index] &&
                      Boolean(formik.errors["name_" + index])
                    }
                    helperText={
                      formik.touched["name_" + index] &&
                      formik.errors["name_" + index]
                    }
                  ></TextField>
                </Grid>
                <Grid item md={3}>
                  <FileUpload
                    id={`file_${index}`}
                    name={`file_${index}`}
                    value={formik.values["file_" + index]}
                    setfile={setFile}
                    error={
                      formik.touched["file_" + index] &&
                      Boolean(formik.errors["file_" + index])
                    }
                    helperText={
                      formik.touched["file_" + index] &&
                      formik.errors["file_" + index]
                    }
                  />
                </Grid>
              </Grid>
            );
          })}
      </Box>

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
          endIcon={loading ? <CircularProgress size={16} /> : <ArrowForward />}
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
