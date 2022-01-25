import {
  Box,
  Button,
  Collapse,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
  IconButton,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  TextField,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  ArrowBack,
  ArrowForward,
  LocalShipping,
  Help,
  HourglassFullSharp,
  DirectionsWalk,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./css/StepOne.module.css";
// import debounce from 'lodash.debounce';
import _ from "lodash";
import AddAddress from "./AddAddress";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

//import { setShipmentDetails } from "../../redux/paymentPageSlice";
export default function ShipmentDetails({ shopID, stepChange }) {
  const { REACT_APP_SHOP_URL } = process.env;

  const [dialogdeliveryOpen, setdialogdeliveryOpen] = useState(false);
  const iShop = useSelector((state) => state.paymentPage.iShop);
  const [shopnullcheck, setshopnullcheck] = useState(false);
  const [deliverychargeoption, setdeliverychargeoption] = React.useState(0);

  const shopDetails = useSelector((state) => state.paymentPage.shopDetails);

  console.log("Shop details in shipment : " + JSON.stringify(shopDetails));

  const dispatch = useDispatch();
  //const inputArray = useSelector((state) => state.paymentPage.shipmentDetails);
  const [inputArray, setInputArray] = useState(null);

  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);
  const [deliverydata, setdeliverydata] = useState([]);

  const [dataloop, setDataloop] = useState([]);
  const [chargesloop, setchargesloop] = useState([]);

  const [shipmentdata, setshipmentdata] = useState([]);

  const [previewurl, setpreviewurl] = useState("");

  const [merc_delivery, setmerc_delivery] = useState([]);
  const [error, setError] = useState(false);
  const [errorsecond, setErrorsecond] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [errorMsgsecond, setErrorMsgsecond] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [selectedTat, setSelectedTat] = useState(0);
  const [selectedsecondTat, setSelectedsecondTat] = useState(0);
  const [tat_type, settat_type] = useState();

  const [tatFlag, setTatFlag] = useState(true);
  const [addressOpen, setAddressOpen] = useState(false);

  const handleChange = (event) => {
    setSelectedTat(event.target.value);
  };

  const handleChangesecondtat = (event) => {
    setSelectedsecondTat(event.target.value);
  };

  const [kilometerweightval, setkilometerweightval] = React.useState([]);

//   {
//     "ikilometer" : 1,
//     "km_amount" : 10,
//     "iweight" : 1,
//     "weight_amount": 20
// }

  /* Debounce callback function starts here */

  const [checkval, setcheckval] = React.useState({
    courier: false,
    merchant: false,
    selfpickup: false,
    deliverynotapplicable: false,
    deliveryapplicable: false,
    shipmentOptions: [],
    mercDeliveryCharge: [],
  });

  const [debouncedState, setDebouncedState] = useState("");

  const [deliverycheck, setdeliverycheck] = useState(false);

  const handleChangedebounce = (tags, index) => (event) => {
    if (event.target.value <= tags) {
      debounce(event.target.value);
      let newArr = [...data]; // copying the old datas array
      newArr[index].Delivery_Charge = event.target.value; // replace e.target.value with whatever you want to change it to
      setData(newArr);
    } else {
      console.log("not ok");

      let newArr = [...data]; // copying the old datas array
      newArr[index].Delivery_Charge = tags; // replace e.target.value with whatever you want to change it to

      setData(newArr);
    }
  };


  const handleChangekilometer = (index) => (event) => {
    if (event.target.value !="") {
      debounce(event.target.value);
      let newArr = [...kilometerweightval]; // copying the old datas array
      newArr[index].km_amount = parseInt(event.target.value); // replace e.target.value with whatever you want to change it to
      setkilometerweightval(newArr);
    } else {
      console.log("not ok");

      let newArr = [...kilometerweightval]; // copying the old datas array
      newArr[index].km_amount = parseInt(0); // replace e.target.value with whatever you want to change it to

      setkilometerweightval(newArr);
    }
    console.log("Kilometer value changes : " + JSON.stringify(kilometerweightval));

  };

  const handleChangeweigth = (iweight, index) => (event) => {
    if (event.target.value !="") {
      debounce(event.target.value);
      let newArr = [...kilometerweightval]; // copying the old datas array
      newArr[index].weight_amount = parseInt(event.target.value);
      newArr[index].iweight = parseInt(iweight); // replace e.target.value with whatever you want to change it to
      setkilometerweightval(newArr);
    } else {
      console.log("not ok");

      let newArr = [...kilometerweightval]; // copying the old datas array
      newArr[index].weight_amount = parseInt(0); // replace e.target.value with whatever you want to change it to
      newArr[index].iweight = parseInt(iweight);

      setkilometerweightval(newArr);
    }
    console.log("Kilometer value changes : " + JSON.stringify(kilometerweightval));

  };

  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedState(_searchVal);
      // send the server request here
    }, 1000),
    []
  );

  /* Debounce callback function ends here */

  const IconWithTooltip = (value) => (
    <Tooltip title="Mylapay allow you to set your exact shop location with address through google maps for better delivery management 
    
    Click check box against the customer self pickup if you wish to allow your customers to pick up the orders from your shop through a direct customer visit or through dunzo.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltipcourier = (value) => (
    <Tooltip title="Click check box against the courier shipment which will
    enable you to deliver your products to 25000+ pin locations
    across the country through more than 15 courier cargo
    options.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltipdoor = (value) => (
    <Tooltip title="Click check box against the Merchant Door Delivery if you have an option to deliver your customer on your own.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltiptatdays = (value) => (
    <Tooltip title="Select Days in which you can accept orders. Order will be auto cancelled if the order is not accepted with the TAT">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltiptathours = (value) => (
    <Tooltip title="Select Hours in which you can accept orders. Order will be auto cancelled if the order is not accepted with the TAT">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltiphandoverdays = (value) => (
    <Tooltip title="Select Days in which you can prepare and handover the orders for shipment.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltiphandoverhours = (value) => (
    <Tooltip title="Select Hours in which you can prepare and handover the orders for shipment.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );
  

  const handleChangechk = (event) => {
    if (event.target.checked) {
      let newArray = [...checkval.shipmentOptions, 1];

      if (checkval.shipmentOptions.includes(1)) {
        newArray = newArray.filter((day) => day !== 1);
      }
      setcheckval({
        ...checkval,
        courier: true,
        deliverynotapplicable: false,
        shipmentOptions: newArray,
      });
    } else {
      let newArray = [...checkval.shipmentOptions, 1];
      if (checkval.shipmentOptions.includes(1)) {
        newArray = newArray.filter((day) => day !== 1);
      }

      setcheckval({ ...checkval, courier: false, shipmentOptions: newArray });
    }
  };

  const handleDialogdelivery = (value) => {
    // setdialogdeliveryOpen(value);

    if (value == true) {

      // setmerc_delivery(newArray);


      // Swal.fire({
      //   title: "Delivery Charge",
      //   text: "Would you like to charge for door delivery?",
      //   icon: "info",
      //   showCancelButton: true,
      //   confirmButtonColor: "#20295C",
      //   cancelButtonColor: "#d33",
      //   confirmButtonText: "Yes",
      //   cancelButtonText: "No",
      // }).then(async (result) => {
      //   if (result.isConfirmed) {

      //     let newArray = [...checkval.shipmentOptions, 2];
      //     if (checkval.shipmentOptions.includes(2)) {
      //       newArray = newArray.filter((day) => day !== 2);
      //     }

      //     setcheckval({
      //       ...checkval,
      //       merchant: true,
      //       deliverynotapplicable: false,
      //       shipmentOptions: newArray,
      //     });

      //     setdialogdeliveryOpen(true);
          
      //   }
      // });

      let newArray = [...checkval.shipmentOptions, 2];
      if (checkval.shipmentOptions.includes(2)) {
        newArray = newArray.filter((day) => day !== 2);
      }

      setcheckval({
        ...checkval,
        merchant: true,
        deliverynotapplicable: false,
        shipmentOptions: newArray,
      });



      // setdialogdeliveryOpen(true);
    } else {
      let newArray = [...checkval.shipmentOptions, 2];
      if (checkval.shipmentOptions.includes(2)) {
        newArray = newArray.filter((day) => day !== 2);
      }

      setcheckval({
        ...checkval,
        merchant: false,
        mercDeliveryCharge: [],
        shipmentOptions: newArray,
      });

      // setmerc_delivery([]);
    }
  };

  const handleDialogpickup = (value) => {
    if (value == true) {
      setAddressOpen(true);
      let newArray = [...checkval.shipmentOptions, 3];
      if (checkval.shipmentOptions.includes(3)) {
        newArray = newArray.filter((day) => day !== 3);
      }
      setcheckval({ ...checkval, selfpickup: true, shipmentOptions: newArray });
    } else {
      if (checkval.courier == false && checkval.merchant == false) {
        setOpen(true);
        
      } else {
        let newArray = [...checkval.shipmentOptions, 3];
        if (checkval.shipmentOptions.includes(3)) {
          newArray = newArray.filter((day) => day !== 3);
        }

        setcheckval({
          ...checkval,
          selfpickup: false,
          shipmentOptions: newArray,
        });
      }
    }
  };

  const onConfirm = () => {
    setcheckval({ ...checkval, selfpickup: false });
  };

  const handleChangedomain = (event) => {
    console.log("Check radio : " + event.target.value);

    if (event.target.value == "1") {
      settat_type(1);
    } else {
      settat_type(2);
    }
  };

  const deliverychargesubmit = async (e) => {

    await axios
      .post("/mylapay/shop/shipping/charges", {
        iShop: iShop,
        shippingCharge: kilometerweightval,
      })
      .then((res) => {
        if (res.data.status === 1) {

          toast.success("Shipment Delivery charges updated Sucessfully", {
            position: "top-center",
          });

          handleDialogClosed(false);
          
        } 
      })
      .catch((err) => {
        console.log(err);
      });
  };


  

  const handleChangedeliverycharge = (event) => {
    console.log("Check radio : " + event.target.value);

    // if (event.target.value == "1") {
    //   settat_type(1);
    // } else {
    //   settat_type(2);
    // }

    if (event.target.value == "1") {
      setdeliverychargeoption(1);
      // formik.setFieldValue("ownDomain", "");
      
    } else {
      setdeliverychargeoption(2);
      // const res = formik.values.shop_name.replace(/ /g, "");
      // formik.setFieldValue("ownDomain", "");
    }
  };

  const handledeliverynotapplicable = (value) => {
    // setdialogdeliveryOpen(value);
    console.log("delivery not applicable");

    const remove = [1, 2];

    if (value == true) {
      setcheckval({
        ...checkval,
        deliverynotapplicable: true,
        deliveryapplicable: false,
        merchant: false,
        courier: false,
        selfpickup: false,
        shipmentOptions: [4],
      });
      setdeliverycheck(value);
      setSelectedTat(0);
      setSelectedsecondTat(0);
      settat_type();
    } else {
      setdeliverycheck(value);

      let newArray = [...checkval.shipmentOptions, 4];
      if (checkval.shipmentOptions.includes(4)) {
        newArray = newArray.filter((day) => day !== 4);
      }

      setcheckval({
        ...checkval,
        deliverynotapplicable: false,
        shipmentOptions: newArray,
      });
    }
  };

  const handledeliveryappicable = (value) => {
    // setdialogdeliveryOpen(value);
    console.log("delivery applicable");

    const remove = [1, 2];

    if (value == true) {
      setcheckval({
        ...checkval,
        deliverynotapplicable: false,
        deliveryapplicable: true,
        merchant: false,
        courier: false,
        selfpickup: false,
        shipmentOptions: [5],
      });
      setdeliverycheck(false);
      // setSelectedTat(0);
      setSelectedsecondTat(0);
    } else {
      setdeliverycheck(true);

      let newArray = [...checkval.shipmentOptions, 5];
      if (checkval.shipmentOptions.includes(5)) {
        newArray = newArray.filter((day) => day !== 5);
      }

      setcheckval({
        ...checkval,
        deliveryapplicable: false,
        shipmentOptions: newArray,
      });
    }
  };

  const handleDialogClosed = (value) => {
    setdialogdeliveryOpen(false);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    section1: {
      margin: theme.spacing(2, 1),
    },
    section2: {
      margin: theme.spacing(4),
    },
    section3: {
      margin: theme.spacing(3, 1, 1),
    },
  }));

  const classes = useStyles();

  const getShipmentOptions = async () => {

    if(iShop!=null)
    {
      await axios
      .get(`/mylapay/shop/shipment_options?iShop=${iShop}`)
      .then((res) => {
        if (res.data.status === 1) {
          let shipDetails = {
            shipmentOptions: JSON.parse(res.data.data[0].iShipment_Opt),
          };
          setInputArray(shipDetails);
          setshipmentdata(res.data.data);

          setSelectedTat(res.data.data[0].handover_tat);
          setSelectedsecondTat(res.data.data[0].accept_tat);
          settat_type(res.data.data[0].tat_type);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else
    {
      setshopnullcheck(true);
    }
    
  };


  const getShipmentOptionsaddaddress = async () => {

    if(iShop!=null)
    {
      await axios
      .get(`/mylapay/shop/shipment_options?iShop=${iShop}`)
      .then((res) => {
        if (res.data.status === 1) {
          // let shipDetails = {
          //   shipmentOptions: JSON.parse(res.data.data[0].iShipment_Opt),
          // };
          // setInputArray(shipDetails);
          setshipmentdata(res.data.data);

          setSelectedTat(res.data.data[0].handover_tat);
          setSelectedsecondTat(res.data.data[0].accept_tat);
          settat_type(res.data.data[0].tat_type);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else
    {
      setshopnullcheck(true);
    }
    
  };

  const getDeliveryList = async () => {
    await axios
      .get("/mylapay/shop/delivery_charge_range")
      .then((res) => {
        if (inputArray) {
          res.data.data.filter((item, index) => {
            if (
              inputArray["mercDeliveryCharge"][index]["iDelivery_Charge"] ===
              item.iDelivery_Charge
            ) {
              item.Delivery_Charge =
                inputArray["mercDeliveryCharge"][index]["Delivery_Charge"];
            }
          });
        }
        // setData(res.data.data);

        setDataloop(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getshippingList = async () => {
    await axios
      .get("/mylapay/shop/shipping/range")
      .then((res) => {

        setchargesloop(res.data.data);
        console.log("chargesloop: " + JSON.stringify(res.data.data));

        // res.data.data.kilometers.filter((item, index) => {
          
        //   setkilometerweightval()

        // });

        // setkilometerweightval
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const getshippingcharges = async () => {
    await axios
    .get("/mylapay/shop/shipping/charges/"+ iShop)
    .then((res) => {

      console.log("shipping charges: " + JSON.stringify(res.data.data));

      if(res.data.data.length>0)
      {
        const records = res.data.data;

        const newRecords = records.map(item =>  {

            if(item.weight_amount!=0)
            {
              setdeliverychargeoption(2)
            }

            return {...kilometerweightval ,
              ikilometer: item.ikilometer,
              km_amount: item.km_amount,
              iweight: item.iweight,
              weight_amount: item.weight_amount,
            }
        }); 
        setkilometerweightval(newRecords)
      }
      else
      {
        axios
        .get("/mylapay/shop/shipping/range")
        .then((res) => {

          const records = res.data.data.kilometers

          const newRecords = records.map(item =>  {
              return {...kilometerweightval ,
                ikilometer: item.ikilometer,
                km_amount: 0,
                iweight: 0,
                weight_amount: 0,
              }
          }); 
          setkilometerweightval(newRecords)

          console.log("kilometerweightval 1: " + JSON.stringify(newRecords));

        })
        .catch((err) => {
          console.log(err);
        });

      }

    })
    .catch((err) => {
      console.log(err);
    });

  };

  

  useEffect(() => {
    getShipmentOptions();
    getDeliveryList();
    getshippingList();
    getshippingcharges();
  }, []);

  useEffect(() => {
    if (inputArray === null) return;
    if (inputArray != null) {
      if (inputArray["shipmentOptions"] != null) {
        if (inputArray["shipmentOptions"].length > 0) {
          let courier = false;
          let merchant = false;
          let selfpickup = false;
          let delivery = false;
          let deliveryapplicable = false;

          inputArray["shipmentOptions"].filter((item, index) => {
            if (item === 1) {
              courier = true;
            }

            if (item === 2) {
              merchant = true;
            }

            if (item === 3) {
              selfpickup = true;
            }

            if (item === 4) {
              delivery = true;

              handledeliverynotapplicable(true);
            }

            if (item === 5) {
              deliveryapplicable = true;

              handledeliveryappicable(true);
            }
          });

          setcheckval({
            ...checkval,
            courier: courier,
            merchant: merchant,
            selfpickup: selfpickup,
            deliverynotapplicable: delivery,
            deliveryapplicable: deliveryapplicable,
            shipmentOptions: inputArray["shipmentOptions"],
          });
        } else {
          setcheckval({
            ...checkval,
            courier: false,
            merchant: false,
            selfpickup: false,
            shipmentOptions: [],
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputArray]);

  const handlePreviewClick = async (e) => {
    setLoading(true);

    await axios
      .post("/mylapay/shop/shipment_options", {
        iShop: iShop,
        shipmentOptions: JSON.stringify(checkval.shipmentOptions),
        handover_tat: selectedTat,
        accept_tat: selectedsecondTat,
        tat_type: tat_type,
      })
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);

          let url = `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}`;

          setpreviewurl(
            "<iframe src=" + url + " style='width:130%; height:450px'/>"
          );

          setDialogOpen(true);

          //dispatch(setShipmentDetails(null));
          // stepChange(3);
        } else {
          setError(true);
          setErrorMsg(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          setError(true);
          setErrorMsg(err.response.data.message || err.response.statusText);
        } else if (err.request) {
          setError(true);
          setErrorMsg(err.request.message);
        } else {
          setError(true);
          setErrorMsg(err.message);
        }
      });
    setLoading(false);
  };

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  const handleDialogClose = (value) => {
    handleDialog(false);
  };

  const handlefullscreen = () => {
    window.open(
      `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}`
    );
  };

  const handlesubmitfinal = async (e) => {
    setLoading(true);

    if (selectedTat == 0 && checkval.deliverynotapplicable == false) {
      setError(true);
      setErrorMsg("Please select Expected TAT for an order");
      return;
    } else {
      setError(false);
    }

    if (selectedsecondTat == 0 && checkval.deliverynotapplicable == false) {
      setErrorsecond(true);
      setErrorMsgsecond("Please select Expected TAT for an order");
      return;
    } else {
      setErrorsecond(false);
    }

    await axios
      .post("/mylapay/shop/shipment_options", {
        iShop: iShop,
        shipmentOptions: JSON.stringify(checkval.shipmentOptions),
        handover_tat: selectedTat,
        accept_tat: selectedsecondTat,
        tat_type: tat_type,
      })
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);
          //dispatch(setShipmentDetails(null));
          // stepChange(3);
          toast.success("Shipment Configured Sucessfully", {
            position: "top-center",
          });
        } else {
          setError(true);
          setErrorMsg(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          setError(true);
          setErrorMsg(err.response.data.message || err.response.statusText);
        } else if (err.request) {
          setError(true);
          setErrorMsg(err.request.message);
        } else {
          setError(true);
          setErrorMsg(err.message);
        }
      });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    console.log("Post Data : " + JSON.stringify(checkval));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.stepCtaWrap}>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            style={{ color: "#fff" }}
            onClick={handlePreviewClick}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            style={{ color: "#fff", marginLeft: "1em" }}
            onClick={() => {
              handlesubmitfinal();
            }}
          >
            Save
          </Button>
        </div>

        <Paper elevation={0}>
          <Grid container spacing={2} elevation={3}>
            <Grid item xs={2}></Grid>

            <Grid item xs={8} style={{ textAlign: "center" }}>
              <div className={styles.accToolTip} style={{ marginTop: "10px" }}>
                Mylapay provides integrated shipment facility with multiple
                courier options for long distance delivery across the country
                and with dunzo for a short distance delivery in major metro
                cities. You can configure the shipment arrangement with simple
                sections.
              </div>
            </Grid>

            <Grid item xs={2}></Grid>

            <Grid item xs={5} style={{ textAlign: "center", marginBottom:"15px" }}>
              <div >
                <label
                  
                  style={{ marginLeft: "100px" }}
                >
                  <input
                    type="checkbox"
                    id="deliveryappicable"
                    name="deliveryappicable"
                    value="5"
                    checked={checkval.deliveryapplicable}
                    onChange={(e) => {
                      handledeliveryappicable(e.target.checked);
                    }}
                  />
                  Yes, I would go with Mylapay Shipment Facility
                </label>
              </div>
            </Grid>
            <Grid item xs={1}></Grid>

            <Grid item xs={5} style={{ textAlign: "center", marginBottom:"15px" }}>
              <div >
                <label
                  
                  style={{ marginLeft: "100px" }}
                >
                  <input
                    type="checkbox"
                    id="selopt"
                    name="deliverynotapplicable"
                    value="4"
                    checked={checkval.deliverynotapplicable}
                    onChange={(e) => {
                      handledeliverynotapplicable(e.target.checked);
                    }}
                  />
                  My business is service related, delivery not applicable
                </label>
              </div>
            </Grid>
          </Grid>
          {deliverycheck == false ? (
            <>
              <Grid container spacing={3} elevation={3}>
                <Grid item xs={3} style={{ textAlign: "center" }}>
                  <LocalShipping style={{fontSize:"1.1em"}}></LocalShipping>
                  <Typography gutterBottom variant="h6">
                    Delivery
                  </Typography>
                </Grid>

                <Grid item xs={4} align="center" md={4}>
                  <label className={classes.section2} mb={4}>
                    <input
                      type="checkbox"
                      id="selopt"
                      name="courier"
                      checked={checkval.courier}
                      value={1}
                      onChange={handleChangechk}
                      // onChange={e=> {
                      //   handleChangechk()
                      // }}
                    />
                    Courier shipment
                    <IconWithTooltipcourier />
                  </label>

                  {/* <div
                    className={styles.accToolTipTop}
                    style={{ marginTop: "10px" }}
                  >
                    Click check box against the courier shipment which will
                    enable you to deliver your products to 25000+ pin locations
                    across the country through more than 15 courier cargo
                    options.
                  </div> */}
                </Grid>

                <Grid item xs={4} align="center" md={4}>
                  <label className={classes.section2}>
                    <input
                      type="checkbox"
                      id="selopt"
                      name="merchant"
                      value={2}
                      checked={checkval.merchant}
                      onChange={(e) => {
                        handleDialogdelivery(e.target.checked);
                      }}
                    />
                    Merchant Door Delivery
                    <IconWithTooltipdoor />
                  </label>

                  {/* <div
                    className={styles.accToolTipTop}
                    style={{ marginTop: "10px" }}
                  >
                    Click check box against the Merchant Door Delivery if you
                    have an option to deliver your customer on your own.
                  </div> */}
                </Grid>
              </Grid>
              

              <Divider variant="middle" style={{marginBottom:"15px"}} />
           

              <Grid container spacing={3} elevation={3}>
                {/* <Grid item xs={2}>
                </Grid> */}

                <Grid item xs={3} style={{ textAlign: "center" }}>
                  <DirectionsWalk style={{fontSize:"1.1em"}}></DirectionsWalk>
                  <Typography gutterBottom variant="h6">
                    Pickup
                  </Typography>
                </Grid>

                <Grid item xs={4} align="center">
                  <label className={classes.section2}>
                    <input
                      type="checkbox"
                      id="selopt"
                      name="selfpickup"
                      checked={checkval.selfpickup}
                      value={3}
                      // onChange={handleChangechk}
                      onChange={(e) => {
                        handleDialogpickup(e.target.checked);
                      }}
                    />
                    Customer self pickup
                    
                  </label>
                  <IconWithTooltip />

                  {/* <div
                    className={styles.accToolTipTop}
                    style={{ marginTop: "10px" }}
                  >
                    Click check box against the customer self pickup if you wish
                    to allow your customers to pick up the orders from your shop
                    through a direct customer visit or through dunzo.
                  </div> */}
                </Grid>

                <Grid item xs={3} align="center">
                  {shipmentdata.length>0?
                    <div className={styles.accToolTip}>
                      <Typography gutterBottom variant="h6">
                        Address
                      </Typography>
                      

                      <Typography align="left">
                        {shipmentdata[0].Street_Name + ", "}
                      </Typography>

                      <Typography align="left">
                        {shipmentdata[0].Building_No + ", "}
                      </Typography>

                      <Typography align="left">
                        {shipmentdata[0].Landmark + ", "}
                      </Typography>

                      <Typography align="left">
                        {shipmentdata[0].City + ", "}
                      </Typography>

                      <Typography align="left">
                        {shipmentdata[0].State + ", "}
                      </Typography>
                    </div>
                  :
                  null

                  }
                  
                </Grid>
              </Grid>

              <Divider variant="middle" style={{marginBottom:"15px"}} />

              {/* {shopDetails.iTemplate != 3 ? */}

              <Grid container spacing={3} elevation={3}>
                <Grid item xs={2} style={{ textAlign: "center" }}></Grid>

                <Grid item xs={10} style={{ textAlign: "center" }}>
                  <Box>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="row-radio-buttons-group"
                      >
                        {shopDetails && shopDetails.iTemplate != 3 ? (
                          <FormControlLabel
                            value="1"
                            checked={tat_type === 1}
                            onChange={handleChangedomain}
                            control={<Radio />}
                            label="Days"
                          />
                        ) : (
                          <FormControlLabel
                            value="1"
                            disabled
                            checked={tat_type === 1}
                            onChange={handleChangedomain}
                            control={<Radio />}
                            label="Days"
                          />
                        )}

                        <FormControlLabel
                          value="2"
                          checked={tat_type === 2}
                          onChange={handleChangedomain}
                          control={<Radio />}
                          label="Hours"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={3}
                  style={{ textAlign: "center", marginTop: "-65px" }}
                >
                  <HourglassFullSharp style={{fontSize:"1.1em"}}></HourglassFullSharp>
                  <Typography gutterBottom variant="h6">
                    TaT
                  </Typography>
                  <span style={{ fontSize: "1em" }}>(Turn around Time)</span>
                  {/* <Typography gutterBottom variant="h6">
                          (Turn around Time)
                    </Typography> */}
                </Grid>

                <Grid item xs={4} style={{ textAlign: "center" }}>
                  {tatFlag && (
                    <>
                      <Box style={{ marginTop: "20px" }}>
                        <FormControl
                          variant="outlined"
                          style={{ minWidth: "150px" }}
                        >
                          <InputLabel
                            id="demo-simple-select-helper-label"
                            className="shipmenttat"
                          >
                            <em>Order Acceptance</em>
                          </InputLabel>
                          <Select
                            value={selectedTat}
                            label="Expected TAT"
                            onChange={handleChange}
                          >
                            <MenuItem value={0}>None</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                          </Select>
                        </FormControl>

                        

                        {tat_type == 1 ? (
                          <IconWithTooltiptatdays />
                        ) : tat_type == 2 ? (
                          <IconWithTooltiptathours />
                        ) : null}
                        
                        

                        <Collapse in={error}>
                          <Box mt={2}>
                            <Alert severity="error">{errorMsg}</Alert>
                          </Box>
                        </Collapse>

                      </Box>
                    </>
                  )}
                </Grid>

                <Grid item xs={4} style={{ textAlign: "center" }}>
                  {tatFlag && (
                    <Box style={{ marginTop: "20px" }}>
                      <FormControl
                        variant="outlined"
                        style={{ minWidth: "150px" }}
                      >
                        <InputLabel
                          id="demo-simple-select-helper-label"
                          className="shipmenttathandover"
                        >
                          <em>Shipment Handover</em>
                        </InputLabel>
                        <Select
                          value={selectedsecondTat}
                          label="Expected TAT"
                          onChange={handleChangesecondtat}
                        >
                          <MenuItem value={0}>None</MenuItem>
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={6}>6</MenuItem>
                          <MenuItem value={7}>7</MenuItem>
                          <MenuItem value={8}>8</MenuItem>
                          <MenuItem value={9}>9</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                        </Select>
                      </FormControl>

                      {tat_type == 1 ? (
                          <IconWithTooltiphandoverdays />
                        ) : tat_type == 2 ? (
                          <IconWithTooltiphandoverhours />
                        ) : null}

                      <Collapse in={errorsecond}>
                        <Box mt={2}>
                          <Alert severity="error">{errorMsgsecond}</Alert>
                        </Box>
                      </Collapse>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <Grid container spacing={3} elevation={3}>
              <Grid item xs={3}></Grid>

              <Grid item xs={6}>
                No delivery option selected for your shop!
              </Grid>
            </Grid>
          )}
        </Paper>
        {/* <Collapse in={error}>
          <Box mt={2}>
            <Alert severity="error">{errorMsg}</Alert>
          </Box>
        </Collapse> */}
        {/* <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => {
              stepChange(1);
            }}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            onClick={() => {
              handlesubmitfinal();
            }}
          >
            Save & Continue
          </Button>
        </Box> */}
      </form>
      {addressOpen && (
        <AddAddress
          addressOpen={addressOpen}
          getShipmentOptionsaddaddress={getShipmentOptionsaddaddress}
          setAddressOpen={setAddressOpen}
        />
      )}

      <Dialog
        style={{ width: "900px", margin: "auto" }}
        open={dialogdeliveryOpen}
        maxWidth="md"
      >
        <DialogTitle id="idc">
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Add Delivery Charges</Box>
            <Box>
              <IconButton
                onClick={() => {
                  handleDialogClosed(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <>
            <form>
              <Paper elevation={0}>
                <Grid container spacing={2}>
                  {/* {dataloop.map((item, index) => {
                    return (
                      <Grid item xs={12}>
                        {" "}
                        <Box mb={2}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            type="text"
                            label={item.Charge_Range}
                            value={item.Delivery_Charge}
                            onChange={handleChangedebounce(
                              item.Maximum_Charge,
                              index
                            )}
                          />
                        </Box>
                      </Grid>
                    );
                  })} */}

                  {chargesloop!=""?

                  <>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="gender"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="1"
                            checked={deliverychargeoption === 1}
                            onChange={handleChangedeliverycharge}
                            control={<Radio />}
                            label="Kilometer"
                          />
                          <FormControlLabel
                            value="2"
                            checked={deliverychargeoption === 2}
                            onChange={handleChangedeliverycharge}
                            control={<Radio />}
                            label="kilometer with weight"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {kilometerweightval.length>0?
                    <>
                      {deliverychargeoption==1?

                      <>
                        {chargesloop.kilometers.map((item, index) => {
                          return (
                            <>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                // label={
                                //   item.Maximum_Charge !== 0
                                //     ? `${item.Charge_Range} (Max ${item.Maximum_Charge})`
                                //     : `${item.Charge_Range} (Free)`
                                // }
                                label={
                                  item.km_range_label + " km"
                                }
                                value={kilometerweightval[index].km_amount}
                                onChange={handleChangekilometer(
                                  // item.km_end_range,
                                  index
                                )}
                              />
                            </Grid>

                            <Grid item xs={3}>
                            </Grid>
                            </>
                          );
                        })}
                      </>
                    
                    :
                    null}

                    </>
                    :
                    null}
                    

                    {kilometerweightval.length>0?
                    <>
                    {deliverychargeoption==2?

                      <>

                      <Grid item xs={6}>
                        {chargesloop['kilometers'].map((item, index) => {
                          return (
                            <>
                            <Grid item xs={12} style={{marginBottom:"10px"}}>
                              <TextField
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                // label={
                                //   item.Maximum_Charge !== 0
                                //     ? `${item.Charge_Range} (Max ${item.Maximum_Charge})`
                                //     : `${item.Charge_Range} (Free)`
                                // }
                                label={
                                  item.km_range_label + " km"
                                }
                                value={kilometerweightval[index].km_amount}
                                onChange={handleChangekilometer(
                                  // item.km_end_range,
                                  index
                                )}
                              />
                            </Grid>
                            </>
                          );
                        })}
                      </Grid>


                      <Grid item xs={6}>

                        {kilometerweightval.length>0?

                          <>
                            {chargesloop['weight'].map((item, index) => {
                              return (
                                <>
                                <Grid item xs={12} style={{marginBottom:"10px"}}>
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    // label={
                                    //   item.Maximum_Charge !== 0
                                    //     ? `${item.Charge_Range} (Max ${item.Maximum_Charge})`
                                    //     : `${item.Charge_Range} (Free)`
                                    // }
                                    label={
                                      item.weight_label + " Grams"
                                    }
                                    // value={item.Delivery_Charge}
                                    value={kilometerweightval[index].weight_amount}
                                    onChange={handleChangeweigth(
                                      item.iweight,
                                      index
                                    )}
                                  />
                                </Grid>
                                </>
                              );
                            })}
                          
                          </>
                        :
                        null}
                      </Grid>
                      </>

                      :
                      null} 
                  </>
                  :
                  null}

                  </>
                  :
                  null}

                  

                    {/* {dataloop.map((item, index) => {
                      return (
                        <>
                        <Grid item xs={12}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            label={
                              item.Maximum_Charge !== 0
                                ? `${item.Charge_Range} (Max ${item.Maximum_Charge})`
                                : `${item.Charge_Range} (Free)`
                            }
                            value={item.Delivery_Charge}
                            onChange={handleChangedebounce(
                              item.Maximum_Charge,
                              index
                            )}
                          />
                        </Grid>
                        </>
                      );
                    })} */}


                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        // endIcon={
                        //   loading ? <CircularProgress size={16} /> : ""
                        // }
                        style={{ marginRigth: "auto" }}
                        // disabled={loading}
                        onClick={() => {
                          deliverychargesubmit()
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </form>
          </>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-dialog"
      >
        <DialogTitle id="confirm-dialog">
          No delivery option selected for your shop!
        </DialogTitle>
        <DialogContent>Please click yes for continue</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            color="secondary"
          >
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ width: "103%", margin: "auto" }}
        fullWidth
        maxWidth="100%"
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Shop Preview</Box>

            <Box>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "99px", width: "160px" }}
                onClick={handlefullscreen}
              >
                Full Screen
              </Button>
            </Box>

            <Box>
              <IconButton
                onClick={() => {
                  handleDialog(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <div
            style={{ width: "75%", height: "450px" }}
            dangerouslySetInnerHTML={{ __html: previewurl }}
          />
        </DialogContent>
      </Dialog>


      <Dialog
        open={shopnullcheck}
        fullWidth
        maxWidth="sm"
        onClose={() => {
          setshopnullcheck(false);
          stepChange(0);
        }}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Information</Box>
            <Box>
              <IconButton
                onClick={() => {
                  setshopnullcheck(false);
                  stepChange(0);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent style={{textAlign:"center"}}>

          Please Configure your shop to Configure your Shipment

        </DialogContent>

      </Dialog>
    </>
  );
}
