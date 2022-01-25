import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { ArrowBack, ArrowForward, Save } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DocFileUpload from "./DocFileUpload";
import DocTextField from "./DocTextField";
import Swal from "sweetalert2";
import {
  businessProofOptions,
  yupSchema,
  emptyInitVals,
} from "./individualData";
import { setActiveStep } from "../../../redux/kycSlice";
import { logOut } from "../../../redux/authSlice";

export default function Proprietoryship() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [initVals, setInitVals] = useState(emptyInitVals);
  const [curBusType, setCurBusType] = useState(null);
  const dispatch = useDispatch();
  const { REACT_APP_API_URL } = process.env;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initVals,
    validationSchema: yupSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  // Form Submit
  const handleSubmit = async (values, svnxit) => {
    setLoading(true);
    let formData = new FormData();
    let busDetArray = [];

    // Append Inputs data
    for (let i = 0; i < 5; i++) {
      if (values[`file_${i}`])
        formData.append(`file_${i}`, values[`file_${i}`]);

      busDetArray.push({
        proof_name: values["proof_name_" + i],
        type: values["type_" + i],
        identification_number: values["identification_number_" + i],
        name: values["name_" + i],
        file_name: values["file_" + i] ? values["file_" + i].name : "",
        order: i,
      });
    }

    formData.append("business_type", curBusType);
    formData.append("business_details", JSON.stringify(busDetArray));
    if (svnxit) {
      formData.append("current_step", 1);
      formData.append("saveAndExit", true);
    } else {
      formData.append("current_step", 2);
    }
    await axios
      .put(`${REACT_APP_API_URL}/mylapay/registration/upload_docs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          if (svnxit) {
            Swal.fire({
              title: "Success!",
              text: "Details saved successfully!",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#20295C",
            }).then(() => {
              localStorage.clear();
              dispatch(logOut());
              return;
            });
          }
          dispatch(setActiveStep(2));
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

  // handle Same as Aadhar
  useEffect(() => {
    if (!formik.values) return;
    if (formik.values.proof_name_2 === "Same as Aadhaar") {
      formik.setFieldValue(
        "identification_number_2",
        formik.values.identification_number_1
      );
      formik.setFieldValue("name_2", formik.values.name_1);
      formik.setFieldValue("file_2", formik.values.file_1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.proof_name_2,
    formik.values.identification_number_1,
    formik.values.name_1,
    formik.values.file_1,
  ]);

  // Prefill Data
  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_docs`)
        .then((response) => {
          if (response.data.success === 1) {
            if (!isMounted) return;
            setCurBusType(response.data.business_type);
            let fillData = response.data.data.filter(
              (item) => item.firmType === response.data.business_type
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

  // Create File from URL
  const createFileFromUrl = async (fileUrl, file_name) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], file_name))
    );
    return blob;
  };

  // Generate InitVals from PrefillData
  useEffect(() => {
    if (prefillData === null) return;

    const generateInitialValues = async () => {
      let temp = {};

      for (let i = 0; i < prefillData.length; i++) {
        const el = prefillData[i];

        let file = null;
        if (el.filePath) {
          file = await createFileFromUrl(
            `${REACT_APP_API_URL}/uploads/${el.filePath}`,
            el.file_name
          );
        }

        temp[`type_${i}`] = el.proofType;
        temp[`proof_name_${i}`] = el.proofName;
        temp[`identification_number_${i}`] = el.identificationNumber;
        temp[`name_${i}`] = el.nameAsPerDoc;
        temp[`file_${i}`] = file;
      }
      console.log(temp);
      setInitVals(temp);
    };
    generateInitialValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className="card" border="1px solid #ddd" p={2} mb={1} display="flex">
        <Typography variant="body1">Business Type:</Typography>
        <Typography variant="body1" style={{ marginLeft: "1em" }}>
          {curBusType && curBusType}
        </Typography>
      </Box>
      <Box pb={1}>
        <Typography variant="h6">Merchant Personal Id proof</Typography>
      </Box>
      <Box p={2} className="card">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              PAN Card *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="PAN Number"
              variant="outlined"
              fullWidth
              id="identification_number_0"
              name="identification_number_0"
              value={formik.values.identification_number_0}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldTouched("identification_number_0");
                formik.handleChange(e);
              }}
              error={
                formik.touched.identification_number_0 &&
                Boolean(formik.errors.identification_number_0)
              }
              helperText={
                formik.touched.identification_number_0 &&
                formik.errors.identification_number_0
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_0"
              label="Name as per PAN"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_0" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              Aadhaar *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Aadhaar Number"
              variant="outlined"
              fullWidth
              id="identification_number_1"
              name="identification_number_1"
              value={formik.values.identification_number_1}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldTouched("identification_number_1");
                formik.handleChange(e);
              }}
              error={
                formik.touched.identification_number_1 &&
                Boolean(formik.errors.identification_number_1)
              }
              helperText={
                formik.touched.identification_number_1 &&
                formik.errors.identification_number_1
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_1"
              label="Name as per Aadhaar"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_1" />
          </Grid>
        </Grid>
      </Box>

      <Box pt={3} pb={1}>
        <Typography variant="h6">Business Address Proof</Typography>
      </Box>
      <Box p={2} className="card">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Business Address Proof *"
              select
              id="proof_name_2"
              name="proof_name_2"
              value={formik.values.proof_name_2}
              onChange={formik.handleChange}
              error={
                formik.touched.proof_name_2 &&
                Boolean(formik.errors.proof_name_2)
              }
              helperText={
                formik.touched.proof_name_2 && formik.errors.proof_name_2
              }
            >
              {businessProofOptions &&
                businessProofOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_2" />
          </Grid>
        </Grid>
      </Box>

      <Box pt={3} pb={1}>
        <Typography variant="h6">Bank Account Proof</Typography>
      </Box>
      <Box p={2} className="card">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              Cancelled Cheque leaf / Bank Statement *
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_3" />
          </Grid>
        </Grid>
      </Box>

      <Box pt={3} pb={1}>
        <Typography variant="h6">GSTN</Typography>
      </Box>
      <Box p={2} className="card">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              Registered GSTN Certificate
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="identification_number_4"
              label="Id Number"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_4"
              label="Name as per Id"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_4" />
          </Grid>
        </Grid>
      </Box>

      <Collapse in={error}>
        <Box mt={2}>
          <Alert severity="error">{errorMsg}</Alert>
        </Box>
      </Collapse>

      <Box mt={4} display={{ xs: "grid", sm: "flex" }} gridGap="1em">
        <Button
          style={{ marginRight: "auto" }}
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => dispatch(setActiveStep(0))}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Button
          style={{ marginRight: "1em" }}
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => handleSubmit(formik.values, true)}
          startIcon={<Save />}
        >
          Save & exit
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={loading ? <CircularProgress size={16} /> : <ArrowForward />}
          type="submit"
          disabled={loading}
        >
          Save and continue
        </Button>
      </Box>
    </form>
  );
}
