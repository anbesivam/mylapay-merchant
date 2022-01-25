import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
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
import { yupSchema, emptyInitVals } from "./trustSocietyData";
import { setActiveStep } from "../../../redux/kycSlice";

export default function TrustSociety() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [initVals, setInitVals] = useState(emptyInitVals);
  const [curBusType, setCurBusType] = useState(null);
  const [filePathZero, setFilePathZero] = useState(null);
  const [filePathOne, setFilePathOne] = useState(null);
  const [filePathTwo, setFilePathTwo] = useState(null);
  const [filePathThree, setFilePathThree] = useState(null);
  const [filePathFour, setFilePathFour] = useState(null);
  const [filePathFive, setFilePathFive] = useState(null);
  const [filePathSix, setFilePathSix] = useState(null);
  const [filePathSeven, setFilePathSeven] = useState(null);
  const [filePathEight, setFilePathEight] = useState(null);
  const [filePathNine, setFilePathNine] = useState(null);

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
    for (let i = 0; i < 10; i++) {
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
        if (el.proofParty) temp[`party_${i}`] = el.proofParty;
      }
      setInitVals(temp);
    };
    generateInitialValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData]);

  useEffect(() => {
    console.log(prefillData);

    if (prefillData === null) return;

    for (let i = 0; i < prefillData.length; i++) {
      
      const el = prefillData[i];
      if(el.filePath){
        let tempFileName = el.filePath.split("/")[1];
        el.file_name = tempFileName;  
      }
      // let tempFileName = el.filePath.split("/")[1];
      // el.file_name = tempFileName;
      //console.log(tempFileName);
      switch (el.proofType) {
        case "Merchant Personal Id proof":
          if (el.proofParty === "1") {
            if(el.proofName === "PAN Card"){
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
              console.log("filePath");
              console.log(el.filePath.replace(/\\/g, "/"));
              formik.setFieldValue("file_full_path_0",el.filePath.replace(/\\/g, "/"));
              setFilePathZero(el.filePath.replace(/\\/g, "/"));
              formik.setFieldValue("iBusinessInfo_0", el.iBusinessInfo);
              formik.setFieldValue("status_0", el.status);
                
            }
            else if(el.proofName === "Aadhaar"){
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
              console.log("Aadhar filePath:",el.filePath.replace(/\\/g, "/"));
              formik.setFieldValue("file_full_path_1",el.filePath.replace(/\\/g, "/"));
              setFilePathOne(el.filePath.replace(/\\/g, "/"));
              console.log(formik.values.identification_number_1);
              formik.setFieldValue("iBusinessInfo_1", el.iBusinessInfo);
              formik.setFieldValue("status_1", el.status);  
              
            }
            
          } 
           else if (el.proofParty === "2") {
            if(el.proofName === "PAN Card"){
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
              formik.setFieldValue("file_full_path_2",el.filePath.replace(/\\/g, "/"));
              setFilePathTwo(el.filePath.replace(/\\/g, "/"));  
              formik.setFieldValue("iBusinessInfo_2", el.iBusinessInfo);
              formik.setFieldValue("status_2", el.status); 
               
            }
            else if(el.proofName === "Aadhaar"){
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
              formik.setFieldValue("file_full_path_3",el.filePath.replace(/\\/g, "/"));
              setFilePathThree(el.filePath.replace(/\\/g, "/"));  
              formik.setFieldValue("iBusinessInfo_3", el.iBusinessInfo);
              formik.setFieldValue("status_3", el.status); 
               
            }
            
          } 
          break;

        case "Company Proof":
          if(el.proofName === "Trust / Society Deed" || el.proofName === "Trust Deed"){
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
            formik.setFieldValue("file_full_path_4",el.filePath.replace(/\\/g, "/"));
            setFilePathFour(el.filePath.replace(/\\/g, "/"));  
            formik.setFieldValue("iBusinessInfo_4", el.iBusinessInfo);
            formik.setFieldValue("status_4", el.status);
            
          }
          else if(el.proofName === "Trust / Society PAN" || el.proofName === "Trust PAN"){
            formik.setFieldValue("proof_name_5", el.proofName);
            formik.setFieldValue(
              "identification_number_5",
              el.identificationNumber
            );
            formik.setFieldValue("name_5", el.nameAsPerDoc);
            formik.setFieldValue("file_5", {
              filePath: el.filePath,
              name: el.file_name,
            });
            formik.setFieldValue("file_full_path_5",el.filePath.replace(/\\/g, "/"));
            setFilePathFive(el.filePath.replace(/\\/g, "/"));  
            formik.setFieldValue("iBusinessInfo_5", el.iBusinessInfo);
            formik.setFieldValue("status_5", el.status);
            
          }
          else if(el.proofName === "Board Resolution Stating Opting for IPG Services"){
            formik.setFieldValue("proof_name_6", el.proofName);
            formik.setFieldValue(
              "identification_number_6",
              el.identificationNumber
            );
            formik.setFieldValue("name_6", el.nameAsPerDoc);
            formik.setFieldValue("file_6", {
              filePath: el.filePath,
              name: el.file_name,
            });
            formik.setFieldValue("file_full_path_6",el.filePath.replace(/\\/g, "/"));
            setFilePathSix(el.filePath.replace(/\\/g, "/"));  
            formik.setFieldValue("iBusinessInfo_6", el.iBusinessInfo);
            formik.setFieldValue("status_6", el.status);
            
          }
          else if(el.proofName === "List of Trustee"){
            formik.setFieldValue("proof_name_7", el.proofName);
            formik.setFieldValue(
              "identification_number_7",
              el.identificationNumber
            );
            formik.setFieldValue("name_7", el.nameAsPerDoc);
            if(el.filePath){
              formik.setFieldValue("file_7", {
                filePath: el.filePath,
                name: el.file_name,
              });
              formik.setFieldValue("file_full_path_7",el.filePath.replace(/\\/g, "/"));
              setFilePathSeven(el.filePath.replace(/\\/g, "/"));  
            }
              
            // formik.setFieldValue("file_7", {
            //   filePath: el.filePath,
            //   name: el.file_name,
            // });
            // formik.setFieldValue("file_full_path_7",el.filePath.replace(/\\/g, "/"));
            formik.setFieldValue("iBusinessInfo_7", el.iBusinessInfo);
            formik.setFieldValue("status_7", el.status);
            
          }
          else if(el.proofName === "GSTN"){
            formik.setFieldValue("proof_name_8", el.proofName);
            formik.setFieldValue(
              "identification_number_8",
              el.identificationNumber
            );
            formik.setFieldValue("name_8", el.nameAsPerDoc);
            if(el.filePath){
              formik.setFieldValue("file_8", {
                filePath: el.filePath,
                name: el.file_name,
              });
              formik.setFieldValue("file_full_path_8",el.filePath.replace(/\\/g, "/"));
              setFilePathEight(el.filePath.replace(/\\/g, "/"));  
            }
            // formik.setFieldValue("file_8", {
            //   filePath: el.filePath,
            //   name: el.file_name,
            // });
            // formik.setFieldValue("file_full_path_8",el.filePath.replace(/\\/g, "/"));
            formik.setFieldValue("iBusinessInfo_8", el.iBusinessInfo);
            formik.setFieldValue("status_8", el.status);
            
          }
           
          break;

        case "Bank Account Proof":
          formik.setFieldValue("proof_name_9", el.proofName);
          formik.setFieldValue(
            "identification_number_9",
            el.identificationNumber
          );
          formik.setFieldValue("name_9", el.nameAsPerDoc);
          if(el.filePath){
            formik.setFieldValue("file_9", {
              filePath: el.filePath,
              name: el.file_name,
            });
            formik.setFieldValue("file_full_path_9",el.filePath.replace(/\\/g, "/"));
            setFilePathNine(el.filePath.replace(/\\/g, "/"));
          }
          // formik.setFieldValue("file_9", {
          //   filePath: el.filePath,
          //   name: el.file_name,
          // });
          // formik.setFieldValue("file_full_path_9",el.filePath.replace(/\\/g, "/"));
          formik.setFieldValue("iBusinessInfo_9", el.iBusinessInfo);
          formik.setFieldValue("status_9", el.status);
          
          break;

        default:
          break;
      }
      
    }

    
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
        <Typography variant="h6">
          Merchant Personal Id proof (trustee 1)
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
              label="Name as per PAN"
              disabled="true"
            />
          </Grid>
          
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${filePathZero}`} target="_blank" rel="noreferrer" >
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
              label="Name as per Aadhaar"
              disabled="true"
            />
          </Grid>
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${filePathOne}`} target="_blank" rel="noreferrer" >
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
          </Grid>
        </Grid>
      </Box>

      <Box py={1}>
        <Typography variant="h6">
          Merchant Personal Id proof (trustee 2)
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
              disabled="true"
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
              disabled="true"
            />
          </Grid>
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${filePathTwo}`} target="_blank" rel="noreferrer" >
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
              id="identification_number_3"
              name="identification_number_3"
              value={formik.values.identification_number_3}
              disabled="true"
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
              disabled="true"
            />
          </Grid>
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${filePathThree}`} target="_blank" rel="noreferrer" >
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
          </Grid>
        </Grid>
      </Box>

      <Box pt={3} pb={1}>
        <Typography variant="h6">Trust / Society Proof</Typography>
      </Box>
      <Box p={2} className="card">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              Trust / Society Deed *
            </Typography>
          </Grid>
          {/* <Grid item xs={12} md={3}>
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
          </Grid> */}
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${filePathFour}`} target="_blank" rel="noreferrer" >
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}>
            <Typography style={{ marginTop: "1em" }} variant="body1">
              Trust / Society PAN *
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="identification_number_5"
              label="PAN Number"
              disabled="true"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_5"
              label="Name as per PAN"
              disabled="true"
            />
          </Grid>
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${filePathFive}`} target="_blank" rel="noreferrer" >
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body1">
              Board Resolution Stating Opting for IPG Services *
            </Typography>
          </Grid>
          {/* <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="identification_number_6"
              label="Id Number"
              disabled="true"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DocTextField
              formik={formik}
              itemName="name_6"
              label="Name as per Id"
              disabled="true"
            />
          </Grid> */}
          <Grid item md={1}>
            <a href={`${SERVER_IMAGE_URL}${filePathSix}`} target="_blank" rel="noreferrer" >
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>
          {
            filePathSeven ? (
              <>
                <Grid item xs={12} md={3}>
                  <Typography style={{ marginTop: "1em" }} variant="body1">
                    List of Trustee *
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} md={3}>
                  <DocTextField
                    formik={formik}
                    itemName="identification_number_7"
                    label="Id Number"
                    disabled="true"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DocTextField
                    formik={formik}
                    itemName="name_7"
                    label="Name as per Id"
                    disabled="true"
                  />
                </Grid> */}
                <Grid item md={1}>
                  <a href={`${SERVER_IMAGE_URL}${filePathSeven}`} target="_blank" rel="noreferrer" >
                    <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
                  </a>  
                </Grid>
                <Grid item xs={12} md={3}></Grid>
                <Grid item xs={12} md={3}></Grid>
              </>
            ):null
          }
          
          {
            filePathEight ? (
              <>
                <Grid item xs={12} md={3}>
                  <Typography style={{ marginTop: "1em" }} variant="body1">
                    GSTN
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <DocTextField
                    formik={formik}
                    itemName="identification_number_8"
                    label="GSTN Number"
                    disabled="true"
                  />
                </Grid>
                {/* <Grid item xs={12} md={3}>
                  <DocTextField
                    formik={formik}
                    itemName="name_8"
                    label="Name as per Id"
                    disabled="true"
                  />
                </Grid> */}
                <Grid item md={1}>
                  <a href={`${SERVER_IMAGE_URL}${filePathEight}`} target="_blank" rel="noreferrer" >
                    <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
                  </a>  
                </Grid>
                <Grid item xs={12} md={3}></Grid>
              </>
            ): null
          }
          
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
            <a href={`${SERVER_IMAGE_URL}${filePathNine}`} target="_blank" rel="noreferrer" >
              <img className="view_docs" src={process.env.PUBLIC_URL + '/view_docs.png'} alt="Document View" />   
            </a>  
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
