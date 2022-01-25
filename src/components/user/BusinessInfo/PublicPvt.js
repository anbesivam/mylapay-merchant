import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
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
import { yupSchema, emptyInitVals } from "./publicPvtData";
import { setActiveStep } from "../../../redux/kycSlice";
import { logOut } from "../../../redux/authSlice";
import Swal from "sweetalert2";

export default function PublicPvt() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [initVals, setInitVals] = useState(emptyInitVals);
  const [curBusType, setCurBusType] = useState(null);
  const [curBusName, setCurBusName] = useState(null);
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
    for (let i = 0; i < 12; i++) {
      if (values[`file_${i}`])
        formData.append(`file_${i}`, values[`file_${i}`]);

      busDetArray.push({
        proof_name: values["proof_name_" + i],
        type: values["type_" + i],
        identification_number: values["identification_number_" + i],
        name: values["name_" + i],
        file_name: values["file_" + i] ? values["file_" + i].name : "",
        order: i,
        party: values[`party_` + i] && values[`party_` + i],
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
            setCurBusName(response.data.business_name);
            let fillData = response.data.data.filter(
              (item) => item.firmType === response.data.business_type
            );
            if (fillData.length === 0) {
              formik.setFieldValue("name_7", response.data.business_name);
            } else {
              setPrefillData(fillData);
            }
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
        temp[`name_${i}`] =
          el.proofName === "Company PAN" && el.nameAsPerDoc === ""
            ? curBusName
            : el.nameAsPerDoc;
        temp[`file_${i}`] = file;
        if (el.proofParty) temp[`party_${i}`] = el.proofParty;
      }
      setInitVals(temp);
    };
    generateInitialValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData, curBusName]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className="card" border="1px solid #ddd" p={2} mb={1} display="flex">
        <Typography variant="body1">Business Type:</Typography>
        <Typography variant="body1" style={{ marginLeft: "1em" }}>
          {curBusType && curBusType}
        </Typography>
      </Box>
      <Box pb={1}>
        <Typography variant="h6">
          Merchant Personal Id proof (director 1)
        </Typography>
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

      <Box py={1}>
        <Typography variant="h6">
          Merchant Personal Id proof (director 2)
        </Typography>
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
              id="identification_number_2"
              name="identification_number_2"
              value={formik.values.identification_number_2}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldTouched("identification_number_2");
                formik.handleChange(e);
              }}
              error={
                formik.touched.identification_number_2 &&
                Boolean(formik.errors.identification_number_2)
              }
              helperText={
                formik.touched.identification_number_2 &&
                formik.errors.identification_number_2
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_2"
              label="Name as per PAN"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_2" />
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
              id="identification_number_3"
              name="identification_number_3"
              value={formik.values.identification_number_3}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldTouched("identification_number_3");
                formik.handleChange(e);
              }}
              error={
                formik.touched.identification_number_3 &&
                Boolean(formik.errors.identification_number_3)
              }
              helperText={
                formik.touched.identification_number_3 &&
                formik.errors.identification_number_3
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_3"
              label="Name as per Aadhaar"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_3" />
          </Grid>
        </Grid>
      </Box>

      <Box pt={3} pb={1}>
        <Typography variant="h6">Company Proof</Typography>
      </Box>
      <Box p={2} className="card">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              MOA *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_4" />
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>

          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              AOA *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_5" />
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>

          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              Certificate of Incorporation *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_6" />
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>

          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              Company PAN *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="PAN Number"
              variant="outlined"
              fullWidth
              id="identification_number_7"
              name="identification_number_7"
              value={formik.values.identification_number_7}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldTouched("identification_number_7");
                formik.handleChange(e);
              }}
              error={
                formik.touched.identification_number_7 &&
                Boolean(formik.errors.identification_number_7)
              }
              helperText={
                formik.touched.identification_number_7 &&
                formik.errors.identification_number_7
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_7"
              label="Name as per PAN"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_7" />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              GSTN *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="identification_number_8"
              label="GSTN Number"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_8" />
          </Grid>
          <Grid item xs={12} md={3}></Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body1">
              Board Resolution Stating Opting for IPG Services *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_9" />
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>

          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              List of Directors
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocFileUpload formik={formik} itemName="file_10" />
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>
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
            <DocFileUpload formik={formik} itemName="file_11" />
          </Grid>
        </Grid>
      </Box>

      {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(prefillData, null, 2)}</pre> */}

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
