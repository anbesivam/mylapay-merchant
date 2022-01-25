import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import { ArrowForward, Close, Info } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import RejectedFileUpload from "./RejectedFileUpload";

export default function RejectedPartnership() {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [rejectedDocs, setRejectedDocs] = useState(null);
  const { REACT_APP_API_URL } = process.env;
  const [initVals, setInitVals] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [docRows, setDocRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [routeCheckDone, setRouteCheckDone] = useState(false);
  const history = useHistory();

  const setFile = (e, elName) => {
    formik.setFieldValue(elName, e.currentTarget.files[0]);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleIcon = (comments) => {
    setDialogContent(comments);
    setDialogOpen(true);
  };

  const createFileFromUrl = async (fileUrl, file_name) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], file_name))
    );
    return blob;
  };

  const getLabel = (index) => {
    if (rejectedDocs[index].proofParty) {
      return (
        formik.values[`type_${index}`] +
        ` (Partner ${rejectedDocs[index].proofParty})`
      );
    } else {
      return formik.values[`type_${index}`];
    }
  };

  // Checking Routes
  useEffect(() => {
    if (userDetails === null) return;

    switch (userDetails.is_approved) {
      case 0:
        history.push("/user/kyc-form");
        break;
      case 1:
        history.push("/");
        break;
      case 2:
        history.push("/rejected-docs");
        break;

      default:
        break;
    }

    setRouteCheckDone(true);
  }, [userDetails, history]);

  //   Getting Rejected Docs data
  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_details`)
        .then((response) => {
          if (response.data.success === 1) {
            if (!isMounted) return;
            if (response.data.data[0].user_docs.length > 0)
              setRejectedDocs(response.data.data[0].user_docs);
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
  }, [userDetails]);

  // Generate Iniital data
  useEffect(() => {
    if (!rejectedDocs) return;

    const generateInitialValues = async () => {
      let res = await Promise.all(
        rejectedDocs.map(async (item, index) => {
          let file = await createFileFromUrl(
            `${REACT_APP_API_URL}/uploads/${item.filePath}`,
            item.file_name
          );

          return {
            [`type_${index}`]: item.proofType,
            [`proof_name_${index}`]: item.proofName,
            [`identification_number_${index}`]: item.identificationNumber,
            [`name_${index}`]: item.nameAsPerDoc,
            [`file_${index}`]: file,
            fileUrl: `${REACT_APP_API_URL}/uploads/${item.filePath}`,
            // proofOptions: proofOptions.options,
            comments: item.comments,
            iBusinessInfo: item.iBusinessInfo,
          };
        })
      );
      setDocRows(res);
      //   Convert Array of Objects to flat object
      let object = Object.assign({}, ...res);
      delete object.proofOptions;
      delete object.fileUrl;
      delete object.comments;
      delete object.iBusinessInfo;
      setInitVals(object);
    };
    generateInitialValues();
  }, [rejectedDocs, REACT_APP_API_URL]);

  // Form Submit Function
  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    let busDetArray = [];
    for (let i = 0; i < docRows.length; i++) {
      if (values[`file_${i}`])
        formData.append(`file_${i}`, values[`file_${i}`]);

      busDetArray.push({
        proof_name: values["proof_name_" + i],
        type: values["type_" + i],
        identification_number: values["identification_number_" + i],
        name: values["name_" + i],
        file_name: values["file_" + i] ? values["file_" + i].name : "",
        // order: i,
        iBusinessInfo: docRows[i].iBusinessInfo,
        party: rejectedDocs[i].proofParty,
      });
    }
    formData.append("business_details", JSON.stringify(busDetArray));
    formData.append("business_type", userDetails.businessType);
    formData.append("current_step", 4);
    await axios
      .put(`${REACT_APP_API_URL}/mylapay/registration/upload_docs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          history.push("/approval");
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
          setErrorMsg(error.request);
        } else {
          setError(true);
          setErrorMsg(error.message);
        }
      });

    setLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initVals,
    onSubmit: (values) => {
      setError(false);
      let errors = [];
      docRows.forEach((item, index) => {
        if (
          item[`identification_number_${index}`] ===
            values[`identification_number_${index}`] &&
          item[`name_${index}`] === values[`name_${index}`] &&
          item[`file_${index}`] === values[`file_${index}`]
        ) {
          errors.push("Same Errors" + index);
        }
      });
      if (errors.length > 0) {
        setError(true);
        setErrorMsg(
          "Cannot submit the same data. Please edit atleast one field in each row"
        );
        return;
      } else {
        handleSubmit(values);
      }
    },
    validate: (values) => {
      let errors = {};
      Object.entries(values).forEach(([k, v]) => {
        let curIndex = k.split("_").pop();
        // Skip check for Name as in Id
        if (
          k.includes("name") &&
          (values[`proof_name_${curIndex}`] === "GSTN" ||
            values[`proof_name_${curIndex}`] ===
              "Board Resolution Stating Opting for IPG Services" ||
            values[`proof_name_${curIndex}`] === "List of Partners" ||
            values[`proof_name_${curIndex}`] === "Partnership deed" ||
            values[`proof_name_${curIndex}`] === "Cancelled Cheque leaf")
        )
          return;
        // Skip check for Id number
        if (
          k.includes("identification_number_") &&
          (values[`proof_name_${curIndex}`] ===
            "Board Resolution Stating Opting for IPG Services" ||
            values[`proof_name_${curIndex}`] === "List of Partners" ||
            values[`proof_name_${curIndex}`] === "Partnership deed" ||
            values[`proof_name_${curIndex}`] === "Cancelled Cheque leaf")
        )
          return;

        if (!v) errors[k] = "Required";
      });
      return errors;
    },
  });

  const getNumberLabel = (proof_name) => {
    switch (proof_name) {
      case "PAN Card":
        return "PAN Number";

      case "Partnership Firm PAN":
        return "PAN Number";

      case "Aadhaar":
        return "Aadhaar Number";

      case "GSTN":
        return "GSTN Number";

      default:
        return "Id Number";
    }
  };

  const getNameLabel = (proof_name) => {
    switch (proof_name) {
      case "PAN Card":
        return "Name as per PAN";

      case "Partnership Firm PAN":
        return "Name as per PAN";

      case "Aadhaar":
        return "Name as per Aadhar";

      default:
        return "Name as per Id";
    }
  };

  return (
    <Container>
      {userDetails && routeCheckDone && (
        <>
          <form onSubmit={formik.handleSubmit}>
            <Box
              p={4}
              mt={2}
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              {!initVals && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              )}

              <Grid container spacing={2}>
                {docRows &&
                  formik.values &&
                  docRows.map((item, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} md={11}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              label={getLabel(index)}
                              value={formik.values[`proof_name_${index}`]}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                          {formik.values[`proof_name_${index}`] !==
                            "Cancelled Cheque leaf" &&
                            formik.values[`proof_name_${index}`] !==
                              "Board Resolution Stating Opting for IPG Services" &&
                            formik.values[`proof_name_${index}`] !==
                              "List of Partners" &&
                            formik.values[`proof_name_${index}`] !==
                              "Partnership deed" && (
                              <>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    label={getNumberLabel(
                                      formik.values[`proof_name_${index}`]
                                    )}
                                    variant="outlined"
                                    fullWidth
                                    id={`identification_number_${index}`}
                                    name={`identification_number_${index}`}
                                    value={
                                      formik.values[
                                        "identification_number_" + index
                                      ]
                                    }
                                    onChange={formik.handleChange}
                                    error={
                                      formik.touched[
                                        "identification_number_" + index
                                      ] &&
                                      Boolean(
                                        formik.errors[
                                          "identification_number_" + index
                                        ]
                                      )
                                    }
                                    helperText={
                                      formik.touched[
                                        "identification_number_" + index
                                      ] &&
                                      formik.errors[
                                        "identification_number_" + index
                                      ]
                                    }
                                  />
                                </Grid>
                                {formik.values[`proof_name_${index}`] !==
                                  "GSTN" && (
                                  <Grid item xs={12} md={3}>
                                    <TextField
                                      label={getNameLabel(
                                        formik.values[`proof_name_${index}`]
                                      )}
                                      variant="outlined"
                                      fullWidth
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
                                    />
                                  </Grid>
                                )}
                              </>
                            )}
                          <Grid item xs={12} md={3}>
                            <RejectedFileUpload
                              fileUrl={docRows[index].fileUrl}
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
                      </Grid>
                      <Grid item xs={12} md={1} style={{ textAlign: "center" }}>
                        <IconButton onClick={() => handleIcon(item.comments)}>
                          <Info />
                        </IconButton>
                      </Grid>
                    </React.Fragment>
                  ))}
              </Grid>
            </Box>
            <Collapse in={error}>
              <Box mt={2}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setError(false);
                      }}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                  severity="error"
                >
                  {errorMsg}
                </Alert>
              </Box>
            </Collapse>
            <Box my={2} display="flex">
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={
                  loading ? <CircularProgress size={16} /> : <ArrowForward />
                }
                style={{ marginLeft: "auto" }}
                type="submit"
                disabled={loading}
              >
                Submit
              </Button>
            </Box>
          </form>

          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogContent>
              <DialogContentText>{dialogContent}</DialogContentText>
            </DialogContent>
          </Dialog>
          {/* <Grid container> */}
          {/* <Grid item xs={4}>
                <h3>RejectedDocs</h3>
                <pre>{JSON.stringify(rejectedDocs, null, 2)}</pre>
              </Grid> */}

          {/* <Grid item xs={4}>
            <h3>ProofDocs</h3>
            <pre>{JSON.stringify(proofDocs, null, 2)}</pre>
          </Grid> */}
          {/* <Grid item xs={4}>
              <h3>Document Rows</h3>
              <pre>{JSON.stringify(docRows, null, 2)}</pre>
            </Grid> */}
          {/* <Grid item xs={4}>
              <h3>Formik errors</h3>
              <pre>{JSON.stringify(formik.errors, null, 2)}</pre>
            </Grid> */}
          {/* <Grid item xs={4}>
              <h3>Formik Values</h3>
              <pre>{JSON.stringify(formik.values, null, 2)}</pre>
            </Grid> */}
          {/* </Grid> */}
        </>
      )}
    </Container>
  );
}
