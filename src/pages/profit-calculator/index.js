import { 
  Grid,
  Box, 
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Container
} from "@material-ui/core";
import { Add, Edit } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';


// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));


function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function ProfitCalculator() {
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [overlay_on, setoverlay_on] = useState(false);
  const [progress_on, setprogress_on] = useState(false);
  const [open, setOpen] = useState(false);
  const [netprofitOn, setnetprofitOn] = useState(false);
  const [serviceErrorMsg, setServiceErrorMsg] = useState("");
  const { REACT_APP_SHIPROCKET_URL } = process.env;

  const classes = useStylesFacebook();

  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let pickup_postcode = userDetails.pincode;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setoverlay_on(false);
  };


  const handleCloseConfirm = () => {
    setOpen(false);
    setoverlay_on(false);  
  };
  
  const validationSchema = yup.object({
    product_sale_value: yup
      .number("Enter a valid product sale value")
      .required("Required Field"),
    length: yup
      .number("Enter a valid length")
      //.max(100)
      .required("Required Field"),
    breadth: yup
      .number("Enter a valid breadth")
      .required("Required Field"),
    height: yup
      .number("Enter a valid height")
      .required("Required Field"),
    weight: yup
      .number("Enter a valid weight")
      .required("Required Field"),
    delivery_postcode: yup
      .number("Enter a valid postcode")
      .required("Required Field"),
    actual_product_price: yup
      .number("Enter a valid actual product price")
  });

  const formik = useFormik({
    initialValues: {
      product_sale_value: "",
      length: "",
      breadth: "",
      height: "",
      weight: "",
      delivery_postcode: "",
      platform_fee: "",
      shipmentCharges: "",
      gst: "",
      total_deduction: "",
      you_get: "",
      actual_product_price: "",
      net_profit: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
     handleClick(values);
    },
  });

  
  let handleProductSaleValueChange = (e) => {
    console.log(e.target.value);
    if(e.target.value > 0 || e.target.value === ""){
      formik.setFieldValue("product_sale_value",e.target.value);
    }
  }

  let handleLengthChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("length",e.target.value);
    }
  }
  let handleBreadthChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("breadth",e.target.value);
    }
  }
  let handleHeightChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("height",e.target.value);
    }
  }

  let handleWeightChange = (e) => {
    console.log(e.target.value);
    if((e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("weight",e.target.value);
    }
  }

  let handleDeliveryPostcodeChange = (e) => {
    console.log(e.target.value);
    if(e.target.value.length <= 6 && e.target.value >= 0){
      formik.setFieldValue("delivery_postcode",e.target.value);
    }
  }

  let handleActualProductPrice = (e) => {
    console.log(e.target.value);
    console.log(formik.values.product_sale_value);
    if(parseInt(e.target.value) >= 0){
      formik.setFieldValue("actual_product_price",e.target.value);
      let net_profit = (formik.values.you_get - e.target.value).toFixed(2);
      formik.setFieldValue("net_profit", net_profit);      
    }
    else if(e.target.value === ""){
      formik.setFieldValue("actual_product_price",e.target.value);
      formik.setFieldValue("net_profit", "");      
    }
  }

  const handleClick = (values) => {

    setoverlay_on(true);
    setprogress_on(true);

    let mylapay_platform_fee = ((2/100) * (values.product_sale_value));

    setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 25));

    let jsonData = {
      "pickup_postcode": parseInt(pickup_postcode),
      "delivery_postcode": parseInt(values.delivery_postcode),
      "cod": 0,
      "weight": values.weight,
      "length": parseInt(values.length),
      "breadth": parseInt(values.breadth),
      "height": parseInt(values.height),
      "declared_value": parseInt(values.product_sale_value),
      "mode": "surface"
    }

      axios
      .post(`${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/profitability/calculator`,jsonData
      )
      .then((response) => {
        setProgress((prevProgress) => (80));

        console.log(response);
        console.log(response.data.data.message);
        if(response.data.data.message){
          setprogress_on(false);
          setServiceErrorMsg(response.data.data.message);
          handleOpen();  
        } else{

          setnetprofitOn(true);

          let courier_companies_list = response.data.data.data.available_courier_companies;
          courier_companies_list.sort((a,b) => (a.rate > b.rate) ? 1 : ((b.rate > a.rate) ? -1 : 0))
          console.log(courier_companies_list);

          console.log(response.data.data.data.available_courier_companies[0].rate);
          let shipmentCharges = response.data.data.data.available_courier_companies[0].rate;
          let GST = ((mylapay_platform_fee+shipmentCharges) * (18/100));
          let total_deduction = (mylapay_platform_fee + shipmentCharges + GST).toFixed(2);
          let you_get = (parseInt(values.product_sale_value) - total_deduction).toFixed(2);
          let net_profit = (you_get - values.actual_product_price).toFixed(2);

          formik.setFieldValue("shipmentCharges", shipmentCharges);
          formik.setFieldValue("platform_fee", mylapay_platform_fee.toFixed(2));
          formik.setFieldValue("gst", GST.toFixed(2));
          formik.setFieldValue("total_deduction", total_deduction);
          formik.setFieldValue("you_get", you_get);
          if(values.actual_product_price){
            formik.setFieldValue("net_profit", net_profit);
          }

          setProgress((prevProgress) => (95));

          setoverlay_on(false);
          setprogress_on(false);

          if (response.data.success === 1) {
            console.log(response.data.data.data.available_courier_companies[0].rate);
          } else {
            //setError(true);
            //setErrorMsg(response.data.message);
          }

        }
        
      })
      .catch((error) => {
        console.log(error);
        // if (error.response) {
        //   setError(true);
        //   setErrorMsg(error.response.data.message);
        // } else if (error.request) {
        //   setError(true);
        //   setErrorMsg(error.request.message);
        // } else {
        //   setError(true);
        //   setErrorMsg(error.message);
        // }
      });

  }



  return (
    <>
    <Container className="full-height" style={{marginTop: "40px"}}>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{serviceErrorMsg}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please enter limited data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    <div className={`profitability_progress ${progress_on ? "progress_on" : "progress_off"}`}>
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
      />
    </div>
    <div className={`overlay ${ overlay_on ? "overlay_on" : "overlay_off"}`}></div> 
      <Grid container spacing={8}>
          
                <Grid item xs={12} md={1}>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box p={4} style={{ background: "#fff", borderRadius: ".5em" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="product sale value"
                          variant="outlined"
                          fullWidth
                          type="number"
                          name="product_sale_value"
                          value={formik.values.product_sale_value}
                          onChange={handleProductSaleValueChange}
                          error={formik.touched.product_sale_value && Boolean(formik.errors.product_sale_value)}
                          helperText={formik.touched.product_sale_value && formik.errors.product_sale_value}
                        />  
                      </Grid>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="L"
                              variant="outlined"
                              fullWidth
                              type="number"
                              name="length"
                              value={formik.values.length}
                              onChange={handleLengthChange}
                              error={formik.touched.length && Boolean(formik.errors.length)}
                              helperText={formik.touched.length && formik.errors.length}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="B"
                              variant="outlined"
                              fullWidth
                              name="breadth"
                              type="number"
                              value={formik.values.breadth}
                              onChange={handleBreadthChange}
                              error={formik.touched.breadth && Boolean(formik.errors.breadth)}
                              helperText={formik.touched.breadth && formik.errors.breadth}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="H"
                              variant="outlined"
                              fullWidth
                              name="height"
                              type="number"
                              value={formik.values.height}
                              onChange={handleHeightChange}
                              error={formik.touched.height && Boolean(formik.errors.height)}
                              helperText={formik.touched.height && formik.errors.height}
                            />
                          </Grid>
                        </Grid>
                          
                      </Grid>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                            label="Weight in Gms"
                            variant="outlined"
                            fullWidth
                            name="weight"
                            type="number"
                            value={formik.values.weight}
                            onChange={handleWeightChange}
                            error={formik.touched.weight && Boolean(formik.errors.weight)}
                            helperText={formik.touched.weight && formik.errors.weight}
                          />
                      </Grid>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                            label="Delivery Postcode"
                            variant="outlined"
                            fullWidth
                            name="delivery_postcode"
                            type="number"
                            value={formik.values.delivery_postcode}
                            onChange={handleDeliveryPostcodeChange}
                            error={formik.touched.delivery_postcode && Boolean(formik.errors.delivery_postcode)}
                            helperText={formik.touched.delivery_postcode && formik.errors.delivery_postcode}
                          />
                      </Grid>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={12} style={{ display: "flex"}}>
                        <Button
                        style={{
                          marginTop: "auto",
                          backgroundColor: "#20295C",
                          marginRight: "2%",
                          color: "#fff",
                          minWidth: "49%",
                        }}
                          size="large"
                          variant="contained"
                          onClick={formik.handleSubmit}
                        >
                          Calculate
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{
                            minWidth: "49%",
                            color: "#fff"
                          }}
                            onClick={formik.resetForm}
                          >
                            Reset
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Box p={4} className="profit_output" style={{ background: "#fff", borderRadius: ".5em" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            
                            label="Platform Fee"
                            variant="outlined"
                            fullWidth
                            name="platform_fee"
                            value={formik.values.platform_fee}
                            disabled="true"
                            onChange={formik.handleChange}
                            error={formik.touched.platform_fee && Boolean(formik.errors.platform_fee)}
                            helperText={formik.touched.platform_fee && formik.errors.platform_fee}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            
                            label="Shipment charges"
                            variant="outlined"
                            fullWidth
                            name="shipmentCharges"
                            value={formik.values.shipmentCharges}
                            disabled="true"
                            onChange={formik.handleChange}
                            error={formik.touched.shipmentCharges && Boolean(formik.errors.shipmentCharges)}
                            helperText={formik.touched.shipmentCharges && formik.errors.shipmentCharges}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            
                            label="GST"
                            variant="outlined"
                            fullWidth
                            name="gst"
                            value={formik.values.gst}
                            disabled="true"
                            onChange={formik.handleChange}
                            error={formik.touched.gst && Boolean(formik.errors.gst)}
                            helperText={formik.touched.gst && formik.errors.gst}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            
                            label="Total Deduction"
                            variant="outlined"
                            fullWidth
                            name="total_deduction"
                            value={formik.values.total_deduction}
                            disabled="true"
                            onChange={formik.handleChange}
                            error={formik.touched.total_deduction && Boolean(formik.errors.total_deduction)}
                            helperText={formik.touched.total_deduction && formik.errors.total_deduction}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            
                            label="You Get"
                            variant="outlined"
                            fullWidth
                            name="you_get"
                            value={formik.values.you_get}
                            disabled="true"
                            onChange={formik.handleChange}
                            error={formik.touched.you_get && Boolean(formik.errors.you_get)}
                            helperText={formik.touched.you_get && formik.errors.you_get}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            
                            label="Actual Product Price"
                            variant="outlined"
                            fullWidth
                            name="actual_product_price"
                            type="number"
                            value={formik.values.actual_product_price}
                            onChange={handleActualProductPrice}
                            error={formik.touched.actual_product_price && Boolean(formik.errors.actual_product_price)}
                            helperText={formik.touched.actual_product_price && formik.errors.actual_product_price}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField

                            label="Your Net Profit"
                            variant="outlined"
                            fullWidth
                            name="net_profit"
                            value={formik.values.net_profit}
                            disabled="true"
                            onChange={formik.handleChange}
                            error={formik.touched.net_profit && Boolean(formik.errors.net_profit)}
                            helperText={formik.touched.net_profit && formik.errors.net_profit}
                          />
                        </Grid>
                      </Grid>
                    </Box>   
                </Grid>  
                <Grid item xs={12} md={1}>
                </Grid>    
          
      </Grid>
      </Container>
      </> 
  );
}

{
  /*
  <Container className="full-height" style={{marginTop: "20px"}}>
  </Container>
  */
}

{/* <Grid item xs={12} md={4}>
                <Box p={4} className={`${ netprofitOn ? "net_profit_on" : "net_profit_off"}`} style={{ background: "#fff", borderRadius: ".5em" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Actual Product Price"
                        variant="outlined"
                        fullWidth
                        name="actual_product_price"
                        type="number"
                        value={formik.values.actual_product_price}
                        onChange={handleActualProductPrice}
                        error={formik.touched.actual_product_price && Boolean(formik.errors.actual_product_price)}
                        helperText={formik.touched.actual_product_price && formik.errors.actual_product_price}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Your Net Profit"
                        variant="outlined"
                        fullWidth
                        name="net_profit"
                        value={formik.values.net_profit}
                        onChange={formik.handleChange}
                        error={formik.touched.net_profit && Boolean(formik.errors.net_profit)}
                        helperText={formik.touched.net_profit && formik.errors.net_profit}
                      />
                    </Grid>
                  </Grid>
                </Box>   
            </Grid> */}