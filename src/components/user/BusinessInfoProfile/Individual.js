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
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DocTextField from "./DocTextField";
import {
  businessProofOptions,
  yupSchema,
  emptyInitVals,
} from "./individualData";
import { setActiveStep } from "../../../redux/kycSlice";

export default function Individual() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [initVals] = useState(emptyInitVals);
  const [curBusType, setCurBusType] = useState(null);
  const dispatch = useDispatch();
  const { REACT_APP_API_URL } = process.env;

  const SERVER_IMAGE_URL = `${REACT_APP_API_URL}/uploads/`;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initVals,
    validationSchema: yupSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleNext = () => {
    dispatch(setActiveStep(2));
    //handleDialog(false);
  }
  // Form Submit
  const handleSubmit = async (values) => {
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
    // formData.append("current_step", 2);
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
            console.log(fillData);
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
    console.log(prefillData);
    let temp = {};
    // let tempArray = [];
    
    for (let i = 0; i < prefillData.length; i++) {
      let tempActionIndex = "";
      const el = prefillData[i];
      console.log(el);
      if(el.filePath){
        let tempFileName = el.filePath.split("/")[1];
        el.file_name = tempFileName;  
      }
      // let tempFileName = el.filePath.split("/")[1];
      // el.file_name = tempFileName;
      //alert("proof");
      if(el.proofType === "Merchant Personal Id proof" && el.proofName === "PAN Card") {
        formik.setFieldValue("identification_number_0",el.identificationNumber);
        formik.setFieldValue("name_0",el.nameAsPerDoc);
        formik.setFieldValue("file_0", {
          filePath: el.filePath,
          name: el.file_name,
        });
        formik.setFieldValue("iBusinessInfo_0", el.iBusinessInfo);
        formik.setFieldValue("status_0", el.status);
        console.log(el.filePath);
        formik.setFieldValue("file_full_path_0",el.filePath.replace(/\\/g, "/"));
        temp[`type_0`] = el.proofType;
        temp[`proof_name_0`] = el.proofName;
        temp[`identification_number_0`] = el.identificationNumber;
        temp[`name_0`] = el.nameAsPerDoc;
        temp[`status_0`] = el.status;
        if(el.status === 1){
          tempActionIndex = 0; 
        } 
        //setfile_0(el.filePath.replace(/\\/g, "/"));

      }
      if(el.proofType === "Merchant Personal Id proof" && el.proofName === "Aadhaar") {
        formik.setFieldValue("identification_number_1",el.identificationNumber);
        formik.setFieldValue("name_1",el.nameAsPerDoc);
        formik.setFieldValue("file_1", {
          filePath: el.filePath,
          name: el.file_name,
        });
        formik.setFieldValue("iBusinessInfo_1", el.iBusinessInfo);
        formik.setFieldValue("status_1", el.status);
        formik.setFieldValue("file_full_path_1",el.filePath.replace(/\\/g, "/"));
        temp[`type_1`] = el.proofType;
        temp[`proof_name_1`] = el.proofName;
        temp[`identification_number_1`] = el.identificationNumber;
        temp[`name_1`] = el.nameAsPerDoc;
        if(el.status === 1){
          tempActionIndex = 1;  
        }

      }
      if(el.proofType === "Business Address Proof") {
        formik.setFieldValue("proof_name_2", el.proofName);
        // formik.setFieldValue("identification_number_2",el.identificationNumber);
        // formik.setFieldValue("name_2",el.nameAsPerDoc);
        formik.setFieldValue("file_2", {
          filePath: el.filePath,
          name: el.file_name,
        });
        formik.setFieldValue("iBusinessInfo_2", el.iBusinessInfo);
        formik.setFieldValue("status_2", el.status);
        formik.setFieldValue("file_full_path_2",el.filePath.replace(/\\/g, "/"));
        temp[`type_2`] = el.proofType;
        temp[`proof_name_2`] = el.proofName;
        if(el.status === 1){
         tempActionIndex = 2;   
        }
        // temp[`identification_number_2`] = el.identificationNumber;
        // temp[`name_2`] = el.nameAsPerDoc;
      }
      if(el.proofType === "Bank Account Proof") {
        formik.setFieldValue("file_3", {
          filePath: el.filePath,
          name: el.file_name,
        });
        formik.setFieldValue("iBusinessInfo_3", el.iBusinessInfo);
        formik.setFieldValue("status_3", el.status);
        formik.setFieldValue("file_full_path_3",el.filePath.replace(/\\/g, "/"));
        temp[`type_3`] = el.proofType;
        temp[`proof_name_3`] = el.proofName;
        temp[`identification_number_3`] = el.identificationNumber;
        temp[`name_3`] = el.nameAsPerDoc;
        if(el.status === 1){
          tempActionIndex = 3;   
        }
      }
      if(el.proofType === "GSTN") {
        formik.setFieldValue("identification_number_4",el.identificationNumber);
        formik.setFieldValue("name_4",el.nameAsPerDoc);
        if(el.filePath){
          formik.setFieldValue("file_4", {
            filePath: el.filePath,
            name: el.file_name,
          });
          formik.setFieldValue("file_full_path_4",el.filePath.replace(/\\/g, "/"));  
        }
        // formik.setFieldValue("file_4", {
        //   filePath: el.filePath,
        //   name: el.file_name,
        // });
        formik.setFieldValue("iBusinessInfo_4", el.iBusinessInfo);
        formik.setFieldValue("status_4", el.status);
        //formik.setFieldValue("file_full_path_4",el.filePath.replace(/\\/g, "/"));
        temp[`type_4`] = el.proofType;
        temp[`proof_name_4`] = el.proofName;
        temp[`identification_number_4`] = el.identificationNumber;
        temp[`name_4`] = el.nameAsPerDoc;
        
      }
      
    }  
 
    
    //setInitVals(temp);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData]);

  // Create File from URL
  // const createFileFromUrl = async (fileUrl, file_name) => {
  //   let blob = await fetch(fileUrl).then((r) =>
  //     r.blob().then((blobFile) => new File([blobFile], file_name))
  //   );
  //   return blob;
  // };

  // Generate InitVals from PrefillData
  // useEffect(() => {
  //   if (prefillData === null) return;

  //   const generateInitialValues = async () => {
  //     let temp = {};

  //     for (let i = 0; i < prefillData.length; i++) {
  //       const el = prefillData[i];

  //       let file = null;
  //       if (el.filePath) {
  //         file = await createFileFromUrl(
  //           `${REACT_APP_API_URL}/uploads/${el.filePath}`,
  //           el.file_name
  //         );
  //       }

  //       temp[`type_${i}`] = el.proofType;
  //       temp[`proof_name_${i}`] = el.proofName;
  //       temp[`identification_number_${i}`] = el.identificationNumber;
  //       temp[`name_${i}`] = el.nameAsPerDoc;
  //       temp[`file_${i}`] = file;
  //     }
  //     setInitVals(temp);
  //   };
  //   generateInitialValues();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [prefillData]);

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
              disabled="true"
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
              disabled="true"
              label="Name as per PAN"
            />
          </Grid>
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${formik.values["file_full_path_0"]}`} target="_blank" rel="noreferrer">
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
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
              disabled="true"
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
              disabled="true"
              label="Name as per Aadhaar"
            />
          </Grid>
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${formik.values["file_full_path_1"]}`} target="_blank" rel="noreferrer">
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
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
              disabled="true"
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
          {/* <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="identification_number_2"
              disabled="true"
              label="Id Number"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_2"
              disabled="true"
              label="Name as per Id"
            />
          </Grid> */}
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${formik.values["file_full_path_2"]}`} target="_blank" rel="noreferrer">
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
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
              Cancelled Cheque leaf *
            </Typography>
          </Grid>

          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${formik.values["file_full_path_3"]}`} target="_blank" rel="noreferrer">
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
          </Grid>
        </Grid>
      </Box>

      {
        formik.values["file_full_path_4"] ? (
          <>
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
                    disabled="true"
                    label="GSTN Number"
                  />
                </Grid>
                {/* <Grid item xs={12} md={3}>
                  <DocTextField
                    formik={formik}
                    itemName="name_4"
                    label="Name as per Id"
                  />
                </Grid> */}
                <Grid item md={1}>
                  <a href={`${SERVER_IMAGE_URL}${formik.values["file_full_path_4"]}`} target="_blank" rel="noreferrer">
                    <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
                  </a>  
                </Grid>
              </Grid>
            </Box>      
          </>
        ) : null
      }
      

      {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(prefillData, null, 2)}</pre> */}

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
          onClick={() => dispatch(setActiveStep(0))}
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
          onClick={handleNext}
          disabled={loading}
        >
          Next
        </Button>
      </Box>
    </form>
  );
}
