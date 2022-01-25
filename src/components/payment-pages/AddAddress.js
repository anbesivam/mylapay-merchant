import { Box, CircularProgress, TextField } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import toast from "react-hot-toast";
import { ArrowBack } from "@material-ui/icons";
import MapLocation from "./MapLocation";
import Swal from "sweetalert2";
export default function AddAddress({
  addressOpen,
  getShipmentOptionsaddaddress,
  setAddressOpen,
  getAddress,
  addressType,
  alertFlag,
  setAlertFlag,
}) {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [center, setCenter] = useState({
    lat: 13.058036876104014,
    lng: 80.25821622454173,
  });
  const iShop = useSelector((state) => state.paymentPage.iShop);
  const { REACT_APP_DELHIVERY_URL } = process.env;
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const formik = useFormik({
    initialValues: {
      buildingNo: "",
      streetName: "",
      landmark: "",
      pincode: "",
      city: "",
      state: "",
    },
    validationSchema: yup.object({
      buildingNo: yup
        .string()
        .required("Required Field")
        .matches(/\d+/, "Must have atleast one number"),
      streetName: yup.string().required("Required Field"),
      landmark: yup.string().required("Required Field"),
      pincode: yup.number().required("Required Field"),
      city: yup.string().required("Required Field"),
      state: yup.string().required("Required Field"),
    }),
    onSubmit: (values) => {
      formSubmit(values);
    },
  });

  const formSubmit = async (values) => {
    // if (alertFlag && addressType == 2) {
    //   //1-single location,2-mulitple location
    //   Swal.fire({
    //     title: "Are you sure?",
    //     text: "We are going to deactivate all single location(All single location addresses should be deactivated).",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#20295C",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Ok",
    //   }).then(async (result) => {
    //     if (result.isConfirmed) {
    //       setLoading(true);
    //       values.iShop = iShop;
    //       values.latitude = center.lat;
    //       values.longitude = center.lng;
    //       values.addressType = addressType;
    //       await axios
    //         .post("/mylapay/shop/shop_address", values)
    //         .then((response) => {
    //           if (response.data.status) {
    //             // toast.success("Address added successfully!");
    //             getShipmentOptionsaddaddress();
    //             setAlertFlag(false);
    //             checkServiceability(
    //               response.data.iShop_Address,
    //               values.pincode
    //             );
    //             //createWareHouse(response.data.iShop_Address);
    //             setAddressOpen(false);
    //             getAddress();
    //           } else {
    //             toast.error("Something went wrong");
    //           }
    //         })
    //         .catch((error) => {
    //           toast.error("Something went wrong");
    //           console.log(error);
    //         });

    //       setLoading(false);
    //     } else {
    //       setAddressOpen(false);
    //     }
    //   });
    // } else {
    setLoading(true);
    values.iShop = iShop;
    values.latitude = center.lat;
    values.longitude = center.lng;
    values.addressType = addressType;
    await axios
      .post("/mylapay/shop/shop_address", values)
      .then((response) => {
        if (response.data.status) {
          // toast.success("Address added successfully!");
          getShipmentOptionsaddaddress();
          checkServiceability(response.data.iShop_Address, values.pincode);
          //createWareHouse(response.data.iShop_Address);
          setAddressOpen(false);
          getAddress();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log(error);
      });

    setLoading(false);
    // }
  };
  const checkServiceability = async (iShop_Address, pincode) => {
    await axios
      .get(
        `${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/pincode/serviceability?Pincode=${pincode}`
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          createWareHouse(iShop_Address);
        } else {
          Swal.fire({
            title: "We're Sorry!",
            text: "Not Serviceable for Delhivery Shipment",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#20295C",
            showCancelButton: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const createWareHouse = async (iShop_Address) => {
    let imid = userDetails.imid;

    await axios
      .post(`${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/create/warehouse`, {
        imid: imid,
        iShop_Address: iShop_Address,
        iShop: iShop,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          getShipmentOptionsaddaddress();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (selectedAddress === null) return;
    let split_arr = selectedAddress.split(", ");
    if (split_arr.length === 7) {
      let stateandpin = split_arr[split_arr.length - 2];
      let state_pin = stateandpin.split(" ");

      formik.setFieldValue("buildingNo", split_arr[0] + ", " + split_arr[1]);
      formik.setFieldValue("streetName", split_arr[2]);
      formik.setFieldValue("city", split_arr[3] + ", " + split_arr[4]);
      formik.setFieldValue("state", state_pin[0] + state_pin[1]);
      formik.setFieldValue("pincode", state_pin[2]);
    } else {
      let stateandpin = split_arr[split_arr.length - 2];
      let state_pin = stateandpin.split(" ");

      formik.setFieldValue("buildingNo", split_arr[0]);
      formik.setFieldValue("streetName", split_arr[1]);
      formik.setFieldValue("city", split_arr[2]);
      formik.setFieldValue("state", state_pin[0] + state_pin[1]);
      formik.setFieldValue("pincode", state_pin[2]);
    }
  }, [selectedAddress]);

  return (
    <>
      <Dialog
        open={addressOpen}
        onClose={() => {
          setAddressOpen(false);
        }}
      >
        <DialogTitle>{"Add Shop Address"}</DialogTitle>
        <DialogContent>
          {activeStep === 1 ? (
            <MapLocation
              setActiveStep={setActiveStep}
              setSelectedAddress={setSelectedAddress}
              center={center}
              setCenter={setCenter}
            />
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="Building No."
                    fullWidth
                    name="buildingNo"
                    id="buildingNo"
                    value={formik.values.buildingNo}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.buildingNo &&
                      Boolean(formik.errors.buildingNo)
                    }
                    helperText={
                      formik.touched.buildingNo && formik.errors.buildingNo
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="Street & Area Name"
                    fullWidth
                    name="streetName"
                    id="streetName"
                    value={formik.values.streetName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.streetName &&
                      Boolean(formik.errors.streetName)
                    }
                    helperText={
                      formik.touched.streetName && formik.errors.streetName
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="City"
                    fullWidth
                    name="city"
                    id="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="State"
                    fullWidth
                    name="state"
                    id="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="Pincode"
                    fullWidth
                    name="pincode"
                    id="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.pincode && Boolean(formik.errors.pincode)
                    }
                    helperText={formik.touched.pincode && formik.errors.pincode}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    label="Landmark"
                    fullWidth
                    name="landmark"
                    id="landmark"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.landmark && Boolean(formik.errors.landmark)
                    }
                    helperText={
                      formik.touched.landmark && formik.errors.landmark
                    }
                  />
                </Grid>
              </Grid>

              <Box display="flex" py={2} justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBack />}
                  onClick={() => {
                    setActiveStep(1);
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
            </form>
          )}
        </DialogContent>
        {/* {activeStep === 1 && (
          <Box display="flex" py={2} px={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => {
                setActiveStep(2);
              }}
            >
              Next
            </Button>
          </Box>
        )} */}
      </Dialog>
    </>
  );
}
