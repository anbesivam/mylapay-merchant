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
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
export default function EditAddress({
  addressOpen,
  setAddressOpen,
  getAddress,
  prefillAddressData,
  getShipmentOptionsaddaddress,
}) {
  console.log(prefillAddressData);
  console.log(addressOpen);

  const [loading, setLoading] = useState(false);
  const [prefillAddress, setPrefillAddressData] = useState(prefillAddressData);
  const [pincodeData, setpincodeData] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const { REACT_APP_DELHIVERY_URL } = process.env;
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const iShop = useSelector((state) => state.paymentPage.iShop);
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
      buildingNo: yup.string().required("Required Field"),
      streetName: yup.string().required("Required Field"),
      landmark: yup.string().required("Required Field"),
      pincode: yup.number().required("Required Field"),
      city: yup.string().required("Required Field"),
      state: yup.string().required("Required Field"),
    }),
    onSubmit: (values) => {
      //
      //   alert(JSON.stringify(values));
      formSubmit(values);
    },
  });

  const formSubmit = async (values) => {
    setLoading(true);

    values.addressId = prefillAddress.iShop_Address;
    await axios
      .put("/mylapay/shop/shop_address", values)
      .then((response) => {
        if (response.data.success) {
          toast.success("Address Updated successfully!");

          checkServiceability(prefillAddress.iShop_Address, values.pincode);
          setAddressOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log(error);
      });

    setLoading(false);
  };
  const checkServiceability = async (iShop_Address, pincode) => {
    await axios
      .get(
        `${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/pincode/serviceability?Pincode=${pincode}`
      )
      .then((response) => {
        if (response.data.success) {
          editWareHouse(iShop_Address);
        } else {
          Swal.fire({
            title: "We're Sorry!",
            text: "Selected pincode is not serviceable for Delhivery Shipment",
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
  const editWareHouse = async (iShop_Address) => {
    let imid = userDetails.imid;

    await axios
      .post(`${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/edit/warehouse`, {
        imid: imid,
        iShop_Address: iShop_Address,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          getShipmentOptionsaddaddress();
          getAddress();
          toast.success("Success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (prefillAddress === null) return;

    formik.setFieldValue("buildingNo", prefillAddress.Building_No);
    formik.setFieldValue("streetName", prefillAddress.Street_Name);
    formik.setFieldValue("landmark", prefillAddress.Landmark);
    formik.setFieldValue("city", prefillAddress.City);
    formik.setFieldValue("state", prefillAddress.State);
    formik.setFieldValue("pincode", prefillAddress.Pincode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillAddress]);

  useEffect(() => {
    if (pincodeData.length === 0) return;
    const cityData = pincodeData[0].city;

    formik.setFieldValue("state", pincodeData[0].stateName);
    formik.setFieldValue("city", cityData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincodeData]);

  const getStateandCity = async (values) => {
    setError(false);
    await axios
      .get(`/mylapay/registration/get/statecity?pincode=${values}`)
      .then((response) => {
        if (response.data.status === 1) {
          setpincodeData(response.data.data);
          if (response.data.data.length === 0) {
            setError(true);
            setErrorMsg("Enter a valid pincode");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Dialog
        open={addressOpen}
        onClose={() => {
          setAddressOpen(false);
        }}
      >
        <DialogTitle>{"Edit Shop address"}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  label="Building No."
                  fullWidth
                  name="buildingNo"
                  id="buildingNo"
                  onChange={formik.handleChange}
                  value={formik.values.buildingNo}
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
                  onChange={formik.handleChange}
                  value={formik.values.streetName}
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
                  onChange={formik.handleChange}
                  value={formik.values.city}
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
                  onChange={formik.handleChange}
                  value={formik.values.state}
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
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    formik.setFieldTouched("pincode");
                    getStateandCity(formik.values.pincode);
                  }}
                  value={formik.values.pincode}
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
                  value={formik.values.landmark}
                  error={
                    formik.touched.landmark && Boolean(formik.errors.landmark)
                  }
                  helperText={formik.touched.landmark && formik.errors.landmark}
                />
              </Grid>
            </Grid>

            <Box display="flex" py={2} justifyContent="flex-end">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
