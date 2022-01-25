import {
  Box,
  View,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@material-ui/core";
import { Add, ArrowBack, ArrowForward, Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

// import {
//   setShipDetails,
//   setDeliveryDetails,
//   setPaymentDetails,
// } from "../../redux/shipmentPageSlice";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(1), //grid padding
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

export default function DeliveryDetails({ shopID, stepChange }) {
  // const classes = useStyles();

  const shipDetails = useSelector((state) => state.shipmentPage.shipDetails);

  //console.log("Ship Details : " + JSON.stringify(shipDetails));

  //const [deliverycheck, setdeliverycheck] = useState(0);

  const [addressdetails, setaddressdetails] = useState([]);
  const [manifestURL, setManifestURL] = useState(false);
  const [labelButton, setLabelButton] = useState(false);

  const { REACT_APP_SHIPROCKET_URL } = process.env;

  //const inputArray = useSelector((state) => state.shipmentPage.deliveryDetails);
  //const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");

  const history = useHistory();

  const nextStep = () => {
    // dispatch(setPaymentDetails(inputArray));
    // stepChange(3);

    history.push(`/orders`);
  };

  const generateManifest = async () => {
    await axios
      .post(
        `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/manifest`,
        {
          awb_code: shipDetails.awbcode,
        }
      )
      .then((response) => {
        setManifestURL(true);
        let url = response.data.data.manifest_url;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `FileName.pdf`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.log(error));
  };
  const generateLabel = async () => {
    await axios
      .post(`${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/label`, {
        awb_code: shipDetails.awbcode,
      })
      .then((response) => {
        setLabelButton(true);
        let url = response.data.data.label_url;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `FileName.pdf`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.log(error));
  };

  const getData = async () => {
    await axios
      .post("/mylapay/customer/address", {
        email: shipDetails["email"],
        phone: shipDetails["phone"],
      })
      .then((response) => {
        // setData(response.data.message);
        // setLoading(false);

        if (response.data) {
          setaddressdetails(response.data.data[0]);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {};

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Paper elevation={0}>
          {shipDetails["awbcode"] != "" ? (
            <React.Fragment>
              {/* <Grid container spacing={1}>
              <Grid container item xs={12} spacing={3}>

                <Grid item xs={6}>
                  <Box mb={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      type="text"
                      // label="Customer Name"
                      value={addressdetails.customerName}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box mb={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      type="text"
                      // label="Customer Email"
                      value={addressdetails.email}
                      disabled
                    />
                  </Box>
                </Grid>

              </Grid>

              <Grid container item xs={12} spacing={3}>

                <Grid item xs={6}>
                  <Box mb={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      type="text"
                      // label="Customer Phone"
                      value={addressdetails.phone}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box mb={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      type="text"
                      // label="Customer Email"
                      value={addressdetails.email}
                      disabled
                    />
                  </Box>
                </Grid>

              </Grid>
            </Grid> */}

              <Grid container spacing={1} style={{ padding: 20 }}>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Customer Name:</label>
                    </Box>

                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        // label="Customer Name"
                        value={addressdetails["customerName"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Customer Email:</label>
                    </Box>

                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["email"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Customer Phone:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["phone"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Building_No:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Building_No"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Street Name:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Street_Name"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Landmark:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Landmark"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">City:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["City"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Pincode:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Pincode"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={1} style={{ padding: 20 }}>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        //endIcon={<ArrowForward />}
                        onClick={() => {
                          generateManifest();
                        }}
                      >
                        Generate Manifest
                      </Button>
                    </Box>

                    <Box mb={2}>
                      <span className="manifest_hint">
                        (Please click generate manifest button and save the
                        document to print and paste it on the package)
                      </span>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        //endIcon={<ArrowForward />}
                        onClick={() => {
                          generateLabel();
                        }}
                      >
                        Generate Label
                      </Button>
                    </Box>

                    <Box mb={2}>
                      <span className="manifest_hint">
                        (Please click generate Label button and save the
                        document to print and paste it on the package)
                      </span>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* <Box maxWidth="550px" mx="auto" p={1}>

              <Box mb={2}>
                  <label>Customer Delivery Address</label>
              </Box>
                
                
                

              </Box> */}

              <Box mx="auto" p={1}>
                {/* <div dangerouslySetInnerHTML={{ __html: awbcode}} /> */}

                <br></br>

                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      "<iframe src=https://shiprocket.co//tracking/" +
                      shipDetails["awbcode"] +
                      ' style="width:90%; height:450px"/>',
                  }}
                />
              </Box>
            </React.Fragment>
          ) : (
            <>
              <Grid container spacing={1} style={{ padding: 20 }}>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Customer Name:</label>
                    </Box>

                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        // label="Customer Name"
                        value={addressdetails["customerName"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Customer Email:</label>
                    </Box>

                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["email"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Customer Phone:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["phone"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Building_No:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Building_No"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Street Name:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Street_Name"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Landmark:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Landmark"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">City:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["City"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <label htmlFor="email">Pincode:</label>
                    </Box>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={addressdetails["Pincode"]}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
        <Collapse in={error}>
          <Box mt={2}>
            <Alert severity="error">{errorMsg}</Alert>
          </Box>
        </Collapse>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => {
              stepChange(1);
            }}
            disabled
          >
            Back
          </Button>
          {/* <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={
              loading ? <CircularProgress size={16} /> : <ArrowForward />
            }
            disabled={loading}
          >
            Publish Shop
          </Button> */}
          {shipDetails["awbcode"] !== "" && labelButton === true ? (
            manifestURL === true ? (
              <Button
                type="button"
                variant="contained"
                color="primary"
                endIcon={<ArrowForward />}
                onClick={() => {
                  nextStep();
                }}
              >
                Go to Orders
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                color="primary"
                endIcon={<ArrowForward />}
                onClick={() => {
                  nextStep();
                }}
                disabled
              >
                Go to Orders
              </Button>
            )
          ) : null}
          {shipDetails["awbcode"] !== "" && labelButton === false ? (
            manifestURL === false ? (
              <Button
                type="button"
                variant="contained"
                color="primary"
                endIcon={<ArrowForward />}
                onClick={() => {
                  nextStep();
                }}
                disabled
              >
                Go to Orders
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                color="primary"
                endIcon={<ArrowForward />}
                onClick={() => {
                  nextStep();
                }}
                disabled
              >
                Go to Orders
              </Button>
            )
          ) : null}
          {shipDetails["awbcode"] === "" ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              endIcon={<ArrowForward />}
              onClick={() => {
                nextStep();
              }}
            >
              Go to Orders
            </Button>
          ) : null}
        </Box>
      </form>

      {/* <Dialog style={{ width: "500px", margin: "auto" }} open={dialogOpen}>
        <DialogTitle>Add a new input field</DialogTitle>
        <DialogContent>
          <AddNewInputField
            handleDialog={handleDialog}
            handleInput={handleInput}
          />
        </DialogContent>
      </Dialog> */}
    </>
  );
}
