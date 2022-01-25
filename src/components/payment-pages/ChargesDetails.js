import {
  Box,
  Button,
  Collapse,
  Grid,
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  InputLabel,
  RadioGroup,
  DialogActions,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  Switch,
  Paper,
  NativeSelect,
  InputBase,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@material-ui/core";
import {
  ArrowBack,
  ArrowForward,
  Help,
  LocalShipping,
  DirectionsBike,
  DirectionsWalk,
  AddLocation,
  HourglassFullSharp,
  Add,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./css/StepOne.module.css";
import { makeStyles, withStyles } from "@material-ui/core/styles";
// import debounce from 'lodash.debounce';
import _ from "lodash";
import Pricing from "../../components/merchant-agreement-pricing/Pricing";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";
import {
  setSelectedAddress,
  setAddressType,
} from "../../redux/paymentPageSlice";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStylestab = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 700,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const useStylesselect = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
}));

const useStylestextfield = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
}));

export default function ShipmentDetails({ shopID, stepChange }) {
  const classestextfield = useStylestextfield();

  const [convenienceFee, setConvenienceFee] = useState();
  const iShop = useSelector((state) => state.paymentPage.iShop);
  const addressType = useSelector((state) => state.paymentPage.addressType);

  const [inputArray, setInputArray] = useState(null);
  const [ShipmentArray, setShipmentArray] = useState(null);

  const [value, setValue] = React.useState(0);
  // const [addressType, setAddressType] = React.useState(0);

  const [shopnullcheck, setshopnullcheck] = useState(false);

  const { REACT_APP_SHOP_URL } = process.env;
  const [previewurl, setpreviewurl] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const shopDetails = useSelector((state) => state.paymentPage.shopDetails);

  // console.log("Shop details in shipment : " + JSON.stringify(shopDetails));

  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);
  const [dataloop, setDataloop] = useState([]);

  const [merc_delivery, setmerc_delivery] = useState([]);

  const [delivery_option, setdelivery_option] = React.useState(0);

  const [singleormultiple, setsingleormultiple] = React.useState();

  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");

  const [errorsecond, setErrorsecond] = useState(false);
  const [errorMsgsecond, setErrorMsgsecond] = useState("Something went wrong");

  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const [chargesloop, setchargesloop] = useState([]);
  const [kilometerweightval, setkilometerweightval] = React.useState([]);

  const [addressOpen, setAddressOpen] = useState(false);
  const [shipmentdata, setshipmentdata] = useState([]);
  const [selectedTat, setSelectedTat] = useState(0);
  const [selectedsecondTat, setSelectedsecondTat] = useState(0);
  const [tat_type, settat_type] = useState();
  const [tatFlag, setTatFlag] = useState(true);
  const [viewAllAddress, setViewAllAddress] = React.useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const [addressList, setAddressList] = React.useState([]);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [addressData, setAddressData] = useState([]);
  const [selectedaddressData, setselectedaddressData] = useState({});
  const [alertFlag, setAlertFlag] = useState(false);
  const history = useHistory();

  // const [checkval, setcheckval] = React.useState({
  //   courier: false,
  //   merchant: false,
  //   selfpickup: false
  // });

  const [checkval, setcheckval] = React.useState({
    courier: false,
    dunzo: false,
    merchant: false,
    selfpickup: false,
    deliverynotapplicable: false,
    deliveryapplicable: false,
    shipmentOptions: [],
    mercDeliveryCharge: [],
  });

  const [multipleaddress, setmultipleaddress] = React.useState([]);

  const [debouncedState, setDebouncedState] = useState("");

  const handleChangekilometer = (index) => (event) => {
    if (event.target.value != "") {
      debounce(event.target.value);
      let newArr = [...kilometerweightval]; // copying the old datas array
      newArr[index].km_amount = parseInt(event.target.value); // replace e.target.value with whatever you want to change it to
      setkilometerweightval(newArr);
    } else {
      // console.log("not ok");

      let newArr = [...kilometerweightval]; // copying the old datas array
      newArr[index].km_amount = parseInt(0); // replace e.target.value with whatever you want to change it to

      setkilometerweightval(newArr);
    }
    // console.log(
    //   "Kilometer value changes : " + JSON.stringify(kilometerweightval)
    // );
  };

  const IconWithTooltip = (value) => (
    <Tooltip title="Mylapay allows you to charge customers for the shipment delivery and recover your cost on product handling, packages and settlement fees through convenience fee collection.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltipmain = (value) => (
    <Tooltip
      title="Mylapay provides integrated shipment facility with multiple
    courier options for long distance delivery across the country
    and with dunzo for a short distance delivery in major metro
    cities. You can configure the shipment arrangement with simple
    sections."
    >
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const IconWithTooltipcourier = (value) => (
    <Tooltip
      title="Click Switch against the courier shipment which will
    enable you to deliver your products to 25000+ pin locations
    across the country through more than 15 courier cargo
    options."
    >
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const IconWithTooltipdoor = (value) => (
    <Tooltip title="Click Switch against the Merchant Door Delivery if you have an option to deliver your customer on your own.">
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const IconWithTooltippickup = (value) => (
    <Tooltip
      title="Mylapay allow you to set your exact shop location with address through google maps for better delivery management 
    
    Click Switch against the customer self pickup if you wish to allow your customers to pick up the orders from your shop through a direct customer visit or through dunzo."
    >
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const IconWithTooltiptatdays = (value) => (
    <Tooltip title="Select Days in which you can accept orders. Order will be auto cancelled if the order is not accepted with the TAT">
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const IconWithTooltiptathours = (value) => (
    <Tooltip title="Select Hours in which you can accept orders. Order will be auto cancelled if the order is not accepted with the TAT">
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const IconWithTooltiphandoverdays = (value) => (
    <Tooltip title="Select Days in which you can prepare and handover the orders for shipment.">
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const IconWithTooltiphandoverhours = (value) => (
    <Tooltip title="Select Hours in which you can prepare and handover the orders for shipment.">
      <Help style={{ fontSize: "16px", marginLeft: "3px" }} />
    </Tooltip>
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangesecondtat = (event) => {
    setSelectedsecondTat(event.target.value);
  };

  const handleChangedebounce = (tags, index) => (event) => {
    if (event.target.value <= tags) {
      debounce(event.target.value);
      let newArr = [...data]; // copying the old datas array
      newArr[index].Delivery_Charge = event.target.value; // replace e.target.value with whatever you want to change it to
      setData(newArr);
    } else {
      let newArr = [...data]; // copying the old datas array
      newArr[index].Delivery_Charge = tags; // replace e.target.value with whatever you want to change it to

      setData(newArr);
    }
  };
  const handleConveniencedebounce = () => (event) => {
    //max 2 percentage
    if (event.target.value <= 2) {
      debounce(event.target.value);
      setConvenienceFee(event.target.value);
    } else {
      setConvenienceFee(2);
    }
  };
  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedState(_searchVal);
      // send the server request here
    }, 1000),
    []
  );

  const [age, setAge] = React.useState("");
  const handleChangeselect = (event) => {
    // setAge(event.target.value);
    setSelectedTat(event.target.value);
  };

  // const handleChangedomain = (event) => {
  //   console.log("Check radio : " + event.target.value);

  //   if (event.target.value == "yes") {
  //     setdelivery_option(0);
  //   } else {
  //     setdelivery_option(1);
  //   }
  // };

  const handleChangelocation = async (event) => {
    let addressType;
    //1-single location,2-multiple location
    if (event.target.value == "yes") {
      setsingleormultiple(1);
      dispatch(setAddressType(1));
      addressType = 1;
    } else {
      setsingleormultiple(2);
      dispatch(setAddressType(2));
      addressType = 2;
    }
    getAddress(addressType);
    // await axios
    //   .post(`/mylapay/shop/address_type`, {
    //     iShop: iShop,
    //     addressType: addressType,
    //   })
    //   .then((res) => {
    //     if (res.data.success) {
    //
    //       // toast.success("Success", {
    //       //   position: "top-center",
    //       // });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  const handleAddressActive = async (event, item) => {
    let isActive;
    if (event.target.checked) {
      isActive = 1;
    } else {
      isActive = 0;
    }

    await axios
      .put(`/mylapay/shop/shop_address/active`, {
        addressId: item.iShop_Address,
        status: isActive,
        addressType: addressType,
        iShop: iShop,
      })
      .then((res) => {
        if (res.data.success) {
          getAddress();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangedomain = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });

    if (event.target.checked) {
      // let newArray = [...checkval.shipmentOptions, 4];
      // if (checkval.shipmentOptions.includes(4)) {
      //   newArray = newArray.filter((day) => day !== 4);
      // }

      // console.log("working merchant added : " + JSON.stringify(newArray))

      // setcheckval({
      //   ...checkval,
      //   courier: checkval.courier,
      //   merchant: checkval.merchant,
      //   selfpickup: checkval.selfpickup,
      //   deliverynotapplicable: false,
      //   deliveryapplicable: true,
      //   shipmentOptions: [4],
      // });

      setcheckval({
        ...checkval,
        courier: false,
        merchant: false,
        selfpickup: false,
        dunzo: false,
        deliverynotapplicable: false,
        deliveryapplicable: true,
        shipmentOptions: [5],
      });
    } else {
      setcheckval({
        ...checkval,
        courier: false,
        merchant: false,
        selfpickup: false,
        dunzo: false,
        deliverynotapplicable: true,
        deliveryapplicable: false,
        shipmentOptions: [4],
      });
    }
  };

  const handleChangetat = (event) => {
    // console.log("Check radio : " + event.target.value);

    if (event.target.value == "1") {
      settat_type(1);
    } else {
      settat_type(2);
    }
  };

  const handleDialogdelivery = (value) => {
    if (value == true) {
      let newArray = [...checkval.shipmentOptions, 2];
      if (checkval.shipmentOptions.includes(2)) {
        newArray = newArray.filter((day) => day !== 2);
      }

      console.log("working merchant added : " + JSON.stringify(newArray));

      setcheckval({
        ...checkval,
        merchant: true,
        deliverynotapplicable: false,
        shipmentOptions: newArray,
      });
    } else {
      console.log(
        "working merchant remove : " + JSON.stringify(checkval.shipmentOptions)
      );

      let newArray = [...checkval.shipmentOptions];
      if (checkval.shipmentOptions.includes(2)) {
        newArray = newArray.filter((day) => day !== 2);
      }

      setcheckval({
        ...checkval,
        courier: checkval.courier,
        merchant: false,
        selfpickup: checkval.selfpickup,
        dunzo: checkval.dunzo,
        mercDeliveryCharge: [],
        shipmentOptions: newArray,
      });
    }
  };

  const handleDialogselfpickup = (value) => {
    if (value == true) {
      let newArray = [...checkval.shipmentOptions, 3];
      if (checkval.shipmentOptions.includes(3)) {
        newArray = newArray.filter((day) => day !== 3);
      }

      console.log("working merchant added : " + JSON.stringify(newArray));

      setcheckval({
        ...checkval,
        selfpickup: true,
        deliverynotapplicable: false,
        shipmentOptions: newArray,
      });
    } else {
      console.log(
        "working merchant remove : " + JSON.stringify(checkval.shipmentOptions)
      );

      let newArray = [...checkval.shipmentOptions];
      if (checkval.shipmentOptions.includes(3)) {
        newArray = newArray.filter((day) => day !== 3);
      }

      setcheckval({
        ...checkval,
        courier: checkval.courier,
        merchant: checkval.merchant,
        selfpickup: false,
        dunzo: checkval.dunzo,
        mercDeliveryCharge: [],
        shipmentOptions: newArray,
      });
    }
  };

  const handleDialogpickup = (value) => {
    if (value == true) {
      //setAddressOpen(true);
      let newArray = [...checkval.shipmentOptions, 3];
      if (checkval.shipmentOptions.includes(3)) {
        newArray = newArray.filter((day) => day !== 3);
      }

      console.log("working pickup added : " + JSON.stringify(newArray));

      setcheckval({ ...checkval, selfpickup: true, shipmentOptions: newArray });
    } else {
      if (checkval.courier == false && checkval.merchant == false) {
        setOpen(true);
      } else {
        let newArray = [...checkval.shipmentOptions];
        if (checkval.shipmentOptions.includes(3)) {
          newArray = newArray.filter((day) => day !== 3);
        }

        console.log("working pickup removed : " + JSON.stringify(newArray));

        setcheckval({
          ...checkval,
          selfpickup: false,
          courier: checkval.courier,
          merchant: checkval.merchant,
          dunzo: checkval.dunzo,
          shipmentOptions: newArray,
        });
      }
    }
  };

  const getShipmentOptionsaddaddress = async () => {
    if (iShop != null) {
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
    } else {
      // setshopnullcheck(true);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Configure your shop to Configure Your Pricing",
      });
      stepChange(0);
    }
  };

  const handleChangechk = (event) => {
    if (event.target.checked) {
      // console.log("working courier : " + JSON.stringify(checkval.shipmentOptions))

      let newArray = [...checkval.shipmentOptions, 1];

      if (checkval.shipmentOptions.includes(1)) {
        newArray = newArray.filter((day) => day !== 1);
      }

      console.log("working courier added : " + JSON.stringify(newArray));

      setcheckval({
        ...checkval,
        courier: true,
        selfpickup: checkval.selfpickup,
        merchant: checkval.merchant,
        dunzo: checkval.dunzo,
        deliverynotapplicable: false,
        shipmentOptions: newArray,
      });
    } else {
      let newArray = [...checkval.shipmentOptions];
      if (checkval.shipmentOptions.includes(1)) {
        newArray = newArray.filter((day) => day !== 1);
      }

      console.log("working courier removed : " + JSON.stringify(newArray));

      setcheckval({ ...checkval, courier: false, shipmentOptions: newArray });
    }
  };

  const handleChangechkdunzo = (event) => {
    if (event.target.checked) {
      // console.log("working courier : " + JSON.stringify(checkval.shipmentOptions))

      let newArray = [...checkval.shipmentOptions, 6];

      if (checkval.shipmentOptions.includes(6)) {
        newArray = newArray.filter((day) => day !== 6);
      }

      console.log("working courier added : " + JSON.stringify(newArray));

      setcheckval({
        ...checkval,
        courier: checkval.courier,
        selfpickup: checkval.selfpickup,
        merchant: checkval.merchant,
        dunzo: true,
        deliverynotapplicable: false,
        shipmentOptions: newArray,
      });
    } else {
      let newArray = [...checkval.shipmentOptions];
      if (checkval.shipmentOptions.includes(6)) {
        newArray = newArray.filter((day) => day !== 6);
      }

      console.log("working courier removed : " + JSON.stringify(newArray));

      setcheckval({ ...checkval, dunzo: false, shipmentOptions: newArray });
    }
  };

  /* Debounce callback function ends here */

  // const handleChangechk = (event) => {
  //   if (event.target.checked) {
  //     let newArray = [...checkval.shipmentOptions, 1];

  //     if (checkval.shipmentOptions.includes(1)) {
  //       newArray = newArray.filter((day) => day !== 1);
  //     }
  //     setcheckval({
  //       ...checkval,
  //       courier: true,
  //       deliverynotapplicable: false,
  //       shipmentOptions: newArray,
  //     });
  //   } else {
  //     let newArray = [...checkval.shipmentOptions, 1];
  //     if (checkval.shipmentOptions.includes(1)) {
  //       newArray = newArray.filter((day) => day !== 1);
  //     }

  //     setcheckval({ ...checkval, courier: false, shipmentOptions: newArray });
  //   }
  // };

  // const onConfirm = () => {
  //   setcheckval({ ...checkval, selfpickup: false });
  // };

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

  const useStylesaccord = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

  const classes = useStyles();
  const classesaccord = useStylesaccord();
  const classestab = useStylestab();
  const classesselect = useStylesselect();

  // const getShipmentOptions = async () => {

  //   if(iShop!=null)
  //   {
  //     await axios
  //     .get(`/mylapay/shop/shipment_options?iShop=${iShop}`)
  //     .then((res) => {
  //       if (res.data.status === 1) {
  //         let shipDetails = {
  //           shipmentOptions: JSON.parse(res.data.data[0].iShipment_Opt),
  //         };
  //         setShipmentArray(shipDetails);

  //         if (shipDetails === null) return;
  //         if (shipDetails != null) {
  //           if (shipDetails["shipmentOptions"] != null) {
  //             if (shipDetails["shipmentOptions"].length > 0) {
  //               let courier = false;
  //               let merchant = false;
  //               let selfpickup = false;

  //               shipDetails["shipmentOptions"].filter((item, index) => {
  //                 if (item === 1) {
  //                   courier = true;
  //                 }

  //                 if (item === 2) {
  //                   merchant = true;
  //                 }

  //                 if (item === 3) {
  //                   selfpickup = true;
  //                 }
  //               });

  //               setcheckval({
  //                 ...checkval,
  //                 courier: courier,
  //                 merchant: merchant,
  //                 selfpickup: selfpickup
  //               });
  //             } else {
  //               setcheckval({
  //                 ...checkval,
  //                 courier: false,
  //                 merchant: false,
  //                 selfpickup: false
  //               });
  //             }
  //           }
  //         }

  //         // setshipmentdata(res.data.data);

  //         // setSelectedTat(res.data.data[0].handover_tat);
  //         // setSelectedsecondTat(res.data.data[0].accept_tat);
  //         // settat_type(res.data.data[0].tat_type);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   }
  //   // else
  //   // {
  //   //   setshopnullcheck(true);
  //   // }

  // };

  const getShipmentOptions = async () => {
    if (iShop != null) {
      await axios
        .get(`/mylapay/shop/shipment_options?iShop=${iShop}`)
        .then((res) => {
          if (res.data.status === 1) {
            let shipDetails = {
              shipmentOptions: JSON.parse(res.data.data[0].iShipment_Opt),
            };
            setShipmentArray(shipDetails);
            setshipmentdata(res.data.data);

            setSelectedTat(res.data.data[0].handover_tat);
            setSelectedsecondTat(res.data.data[0].accept_tat);
            settat_type(res.data.data[0].tat_type);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // setshopnullcheck(true);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Configure your shop to Configure Your Pricing",
      });
      stepChange(0);
    }
  };

  const getshippingList = async () => {
    await axios
      .get("/mylapay/shop/shipping/range")
      .then((res) => {
        setchargesloop(res.data.data);
        // console.log("chargesloop: " + JSON.stringify(res.data.data));

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
      .get("/mylapay/shop/shipping/charges/" + iShop)
      .then((res) => {
        // console.log("shipping charges: " + JSON.stringify(res.data.data));

        if (res.data.data.length > 0) {
          const records = res.data.data;

          const newRecords = records.map((item) => {
            return {
              ...kilometerweightval,
              ikilometer: item.ikilometer,
              km_amount: item.km_amount,
              iweight: item.iweight,
              weight_amount: item.weight_amount,
            };
          });
          setkilometerweightval(newRecords);
        } else {
          axios
            .get("/mylapay/shop/shipping/range")
            .then((res) => {
              const records = res.data.data.kilometers;

              const newRecords = records.map((item) => {
                return {
                  ...kilometerweightval,
                  ikilometer: item.ikilometer,
                  km_amount: 0,
                  iweight: 0,
                  weight_amount: 0,
                };
              });
              setkilometerweightval(newRecords);

              console.log(
                "kilometerweightval 1: " + JSON.stringify(newRecords)
              );
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
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getCharges = async () => {
      if (iShop != null) {
        await axios
          .get(`/mylapay/shop/charges?iShop=${iShop}`)
          .then((res) => {
            if (res.data.status === 1) {
              const shipDetails = {
                mercDeliveryCharge: res.data.data,
              };
              // dispatch(setShipmentDetails(shipDetails));
              setInputArray(shipDetails);
              setConvenienceFee(res.data.data[0].convenience_fee_percent);
              //getDeliveryList();
            } else {
              setError(true);
              setErrorMsg(res.data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // setshopnullcheck(true);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please Configure your shop to Configure Your Pricing",
        });
        stepChange(0);
      }
    };

    getCharges();
    getShipmentOptions();
    getshippingList();
    getshippingcharges();
  }, []);
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
        setData(res.data.data);

        setDataloop(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDeliveryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputArray]);

  useEffect(() => {
    if (ShipmentArray === null) return;
    if (ShipmentArray != null) {
      if (ShipmentArray["shipmentOptions"] != null) {
        if (ShipmentArray["shipmentOptions"].length > 0) {
          console.log(
            "Checkval shipment : " +
              JSON.stringify(ShipmentArray["shipmentOptions"])
          );

          let courier = false;
          let merchant = false;
          let selfpickup = false;
          let dunzo = false;
          let delivery = false;
          let deliveryapplicable = false;

          ShipmentArray["shipmentOptions"].filter((item, index) => {
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

              // handledeliverynotapplicable(true);

              setState({ ...state, ["checkedB"]: false });
            }

            if (item === 5) {
              deliveryapplicable = true;

              // handledeliveryappicable(true);
              setState({ ...state, ["checkedB"]: true });
            }

            if (item === 6) {
              dunzo = true;
              setState({ ...state, ["checkedB"]: true });
            }
          });

          setcheckval({
            ...checkval,
            courier: courier,
            merchant: merchant,
            selfpickup: selfpickup,
            dunzo: dunzo,
            deliverynotapplicable: delivery,
            deliveryapplicable: deliveryapplicable,
            shipmentOptions: ShipmentArray["shipmentOptions"],
          });
        } else {
          setcheckval({
            ...checkval,
            courier: false,
            merchant: false,
            selfpickup: false,
            dunzo: false,
            shipmentOptions: [],
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ShipmentArray]);

  const handlePreviewClick = async (e) => {
    setLoading(true);

    let DeliveryCharge = [];

    data.filter((value) => {
      if (value.Delivery_Charge != undefined) {
        DeliveryCharge.push({
          iDeliveryCharge: value.iDelivery_Charge,
          Delivery_Charge: value.Delivery_Charge,
        });
      } else {
        DeliveryCharge.push({
          iDeliveryCharge: value.iDelivery_Charge,
          Delivery_Charge: "",
        });
      }
    });

    // Display the key/value pairs
    // for (var pair of formData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }
    let finalResult = [];
    if (merc_delivery.length > 0) {
      finalResult = DeliveryCharge;
    } else {
      finalResult = merc_delivery;
    }

    await axios
      .post("/mylapay/shop/charges", {
        mercDeliveryCharge: JSON.stringify(DeliveryCharge),
        convenienceFee: convenienceFee,
        iShop: iShop,
      })
      .then((res) => {
        if (res.data.status === 1) {
          setLoading(false);

          let url = `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}`;

          setpreviewurl(
            "<iframe src=" + url + " style='width:130%; height:450px'/>"
          );

          setDialogOpen(true);
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

    // console.log(
    //   "Checkval shipment : " + JSON.stringify(checkval.shipmentOptions)
    // );

    let final_txt = "";

    if (checkval.shipmentOptions.length > 0) {
      let courier_txt = false;
      let merchant_txt = false;
      let door_txt = false;
      let pickup_txt = false;
      let dunzo_txt = false;

      checkval.shipmentOptions.filter((item, index) => {
        if (item === 1) {
          courier_txt = true;
        }

        if (item === 2) {
          merchant_txt = true;
        }

        if (item === 3) {
          pickup_txt = true;
        }

        if (item === 6) {
          dunzo_txt = true;
        }
      });

      if (courier_txt == true) {
        final_txt = final_txt + "Courier, ";
      }

      if (merchant_txt == true) {
        final_txt = final_txt + "Door Delivery, ";
      }

      if (pickup_txt == true) {
        final_txt = final_txt + "Self pickup, ";
      }

      if (dunzo_txt == true) {
        final_txt = final_txt + "Dunzo";
      }

      console.log("Message selected : " + JSON.stringify(final_txt));
    }

    if (final_txt != "") {
      Swal.fire({
        title: "Are you sure?",
        text: final_txt + " these shipment options are selected",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#20295C",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (!convenienceFee && convenienceFee !== 0) {
            setError(true);
            setErrorMsg("Please enter convenience Fee");
            return;
          }
          let DeliveryCharge = [];

          data.filter((value) => {
            if (value.Delivery_Charge != undefined) {
              DeliveryCharge.push({
                iDeliveryCharge: value.iDelivery_Charge,
                Delivery_Charge: value.Delivery_Charge,
              });
            } else {
              DeliveryCharge.push({
                iDeliveryCharge: value.iDelivery_Charge,
                Delivery_Charge: "",
              });
            }
          });

          // Display the key/value pairs
          // for (var pair of formData.entries()) {
          //   console.log(pair[0]+ ', ' + pair[1]);
          // }
          let finalResult = [];
          if (merc_delivery.length > 0) {
            finalResult = DeliveryCharge;
          } else {
            finalResult = merc_delivery;
          }

          await axios
            .post("/mylapay/shop/charges", {
              mercDeliveryCharge: JSON.stringify(DeliveryCharge),
              convenienceFee: convenienceFee,
              iShop: iShop,
            })
            .then(async (res) => {
              if (res.data.status === 1) {
                setLoading(false);
                // dispatch(setShopDetails(null));
                // dispatch(setProductDetails(null));
                // dispatch(setPaymentDetails(null));
                // dispatch(setShipmentDetails(null));
                await axios
                  .post("/mylapay/shop/shipment_options", {
                    iShop: iShop,
                    shipmentOptions: JSON.stringify(checkval.shipmentOptions),
                    handover_tat: selectedTat,
                    accept_tat: selectedsecondTat,
                    tat_type: tat_type,
                    addressType: addressType,
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
                      setErrorMsg(
                        err.response.data.message || err.response.statusText
                      );
                    } else if (err.request) {
                      setError(true);
                      setErrorMsg(err.request.message);
                    } else {
                      setError(true);
                      setErrorMsg(err.message);
                    }
                  });

                // toast.success("Pricing Configured Sucessfully", {
                //   position: "top-center",
                // });
                history.push("/payment-pages");
              } else {
                setError(true);
                setErrorMsg(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
              if (err.response) {
                setError(true);
                setErrorMsg(
                  err.response.data.message || err.response.statusText
                );
              } else if (err.request) {
                setError(true);
                setErrorMsg(err.request.message);
              } else {
                setError(true);
                setErrorMsg(err.message);
              }
            });
          setLoading(false);
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Shipment options are not selected",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#20295C",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (!convenienceFee && convenienceFee !== 0) {
            setError(true);
            setErrorMsg("Please enter convenience Fee");
            return;
          }
          let DeliveryCharge = [];

          data.filter((value) => {
            if (value.Delivery_Charge != undefined) {
              DeliveryCharge.push({
                iDeliveryCharge: value.iDelivery_Charge,
                Delivery_Charge: value.Delivery_Charge,
              });
            } else {
              DeliveryCharge.push({
                iDeliveryCharge: value.iDelivery_Charge,
                Delivery_Charge: "",
              });
            }
          });

          // Display the key/value pairs
          // for (var pair of formData.entries()) {
          //   console.log(pair[0]+ ', ' + pair[1]);
          // }
          let finalResult = [];
          if (merc_delivery.length > 0) {
            finalResult = DeliveryCharge;
          } else {
            finalResult = merc_delivery;
          }

          await axios
            .post("/mylapay/shop/charges", {
              mercDeliveryCharge: JSON.stringify(DeliveryCharge),
              convenienceFee: convenienceFee,
              iShop: iShop,
            })
            .then(async (res) => {
              if (res.data.status === 1) {
                setLoading(false);
                // dispatch(setShopDetails(null));
                // dispatch(setProductDetails(null));
                // dispatch(setPaymentDetails(null));
                // dispatch(setShipmentDetails(null));
                await axios
                  .post("/mylapay/shop/shipment_options", {
                    iShop: iShop,
                    shipmentOptions: JSON.stringify(checkval.shipmentOptions),
                    handover_tat: selectedTat,
                    accept_tat: selectedsecondTat,
                    tat_type: tat_type,
                    addressType: addressType,
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
                      setErrorMsg(
                        err.response.data.message || err.response.statusText
                      );
                    } else if (err.request) {
                      setError(true);
                      setErrorMsg(err.request.message);
                    } else {
                      setError(true);
                      setErrorMsg(err.message);
                    }
                  });

                // toast.success("Pricing Configured Sucessfully", {
                //   position: "top-center",
                // });
                history.push("/payment-pages");
              } else {
                setError(true);
                setErrorMsg(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
              if (err.response) {
                setError(true);
                setErrorMsg(
                  err.response.data.message || err.response.statusText
                );
              } else if (err.request) {
                setError(true);
                setErrorMsg(err.request.message);
              } else {
                setError(true);
                setErrorMsg(err.message);
              }
            });
          setLoading(false);
        }
      });
    }
  };

  const handlesubmitcourier = async (e) => {
    setLoading(true);
    if (!convenienceFee && convenienceFee !== 0) {
      setError(true);
      setErrorMsg("Please enter convenience Fee");
      return;
    }
    let DeliveryCharge = [];

    data.filter((value) => {
      if (value.Delivery_Charge != undefined) {
        DeliveryCharge.push({
          iDeliveryCharge: value.iDelivery_Charge,
          Delivery_Charge: value.Delivery_Charge,
        });
      } else {
        DeliveryCharge.push({
          iDeliveryCharge: value.iDelivery_Charge,
          Delivery_Charge: "",
        });
      }
    });

    // Display the key/value pairs
    // for (var pair of formData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }
    let finalResult = [];
    if (merc_delivery.length > 0) {
      finalResult = DeliveryCharge;
    } else {
      finalResult = merc_delivery;
    }

    await axios
      .post("/mylapay/shop/charges", {
        mercDeliveryCharge: JSON.stringify(DeliveryCharge),
        convenienceFee: convenienceFee,
        iShop: iShop,
      })
      .then(async (res) => {
        if (res.data.status === 1) {
          setLoading(false);
          // dispatch(setShopDetails(null));
          // dispatch(setProductDetails(null));
          // dispatch(setPaymentDetails(null));
          // dispatch(setShipmentDetails(null));

          toast.success("Pricing Configured Sucessfully", {
            position: "top-center",
          });
          // history.push("/payment-pages");
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

  const handleSubmit = async (e) => {};
  const handleConvenienceFee = (event) => {
    //max 2 percentage
    if (event.target.value <= 2 && event.target.value >= 0) {
      debounce(event.target.value);
      setConvenienceFee(event.target.value);
    } else {
      setConvenienceFee("");
    }
  };

  const showPricingPopup = () => {
    setShowPricing(true);
  };

  const getAddress = async (address_type) => {
    await axios
      .get(
        `/mylapay/shop/shop_address?iShop=${iShop}&addressType=${
          address_type ? address_type : addressType
        }`
      )
      .then((res) => {
        if (res.data.status) {
          setAddressList(res.data.message);
          // dispatch(setAddressType(res.data.Address_Type));
          if (res.data.message.length === 0) setAlertFlag(true);
          res.data.message.filter((item) => {
            if (item.isActive == 1) {
              // setDefaultAddress(value)
              if (item.dunzo_registered == 0) {
                let newArray = [...checkval.shipmentOptions];
                if (checkval.shipmentOptions.includes(6)) {
                  newArray = newArray.filter((day) => day !== 6);
                }

                setcheckval({
                  ...checkval,
                  dunzo: false,
                  shipmentOptions: newArray,
                });
              }

              setselectedaddressData(item);
            }
          });
        } else {
          toast.error("Couldn't fetch address");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Please try again.");
      });
  };

  useEffect(() => {
    getAddress();
  }, []);

  const setMultipleAddress = async (item) => {
    let newArray = [...multipleaddress];
    if (multipleaddress.includes(item)) {
      newArray = newArray.filter((day) => day !== item);
    }

    // console.log("Multiple Address : " + JSON.stringify(newArray));
  };

  const setDefaultAddress = async (item) => {
    setAddressLoading(true);

    if (item.dunzo_registered == 0) {
      let newArray = [...checkval.shipmentOptions];
      if (checkval.shipmentOptions.includes(6)) {
        newArray = newArray.filter((day) => day !== 6);
      }

      // console.log("working dunzo removed : " + JSON.stringify(newArray));

      setcheckval({ ...checkval, dunzo: false, shipmentOptions: newArray });
    }
    getAddress();
    getShipmentOptionsaddaddress();
    dispatch(setSelectedAddress(item));
    setselectedaddressData(item);
    // await axios
    //   .put(`/mylapay/shop/default_address`, {
    //     addressId: item.iShop_Address,
    //     iShop: item.iShop,
    //     addressType: addressType,
    //   })
    //   .then((res) => {
    //     if (res.data.success) {
    //       getAddress();
    //       getShipmentOptionsaddaddress();
    //       dispatch(setSelectedAddress(item));
    //       setselectedaddressData(item);
    //     } else {
    //       toast.error("Something went wrong.");
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error("Something went wrong. Please try again.");
    //   });
    setAddressLoading(false);
  };
  const removeDeliveryAddress = async (item) => {
    if (item.isActive === 1) {
      Swal.fire({
        title: "Warning",
        text: "You cannot delete your current address!",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#20295C",
        showCancelButton: false,
      });
      return;
    }
    await axios
      .delete(`/mylapay/shop/shop_address`, {
        data: {
          iShop_Address: item.iShop_Address,
          iShop: iShop,
        },
      })
      .then((res) => {
        // console.log(res);
        if (res.data.status) {
          toast.success("Delivery Address removed Successfully!");
          getAddress();
          getShipmentOptionsaddaddress();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Please try again.");
      });
  };
  const editDeliveryAddress = (item) => {
    setEditAddressOpen(true);
    // console.log(item);
    setAddressData(item);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={classestextfield.root}>
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
          <Grid container spacing={1}>
            <Grid item xs={4} style={{ marginLeft: "20px" }}>
              <Box mb={2} mt={2}>
                Shipment Facility
              </Box>

              <Box mb={2} mt={2}>
                {/* <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                  <FormControlLabel value="yes" 
                    checked={delivery_option === 0}
                    onChange={handleChangedomain}
                    control={<Radio color="primary" />} 
                    label="Yes" />

                  <FormControlLabel value="no" 
                    checked={delivery_option === 1}
                    onChange={handleChangedomain}
                    control={<Radio color="primary" />}
                    label="No" />

                </RadioGroup>
              </FormControl> */}

                {/* <span style={{marginRight:"20px"}}>No</span> */}

                <FormControlLabel
                  control={
                    <Switch
                      checked={state.checkedB}
                      onChange={handleChangedomain}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  // label="Yes"
                />
                {/* <span>Yes</span> */}

                {state.checkedB == true ? (
                  <span>Enabled</span>
                ) : (
                  <span>Disabled</span>
                )}
                <IconWithTooltipmain />
              </Box>
            </Grid>

            <Grid
              item
              xs={7}
              align="right"
              style={{
                marginBottom: "20px",
                marginTop: "20px",
                marginRight: "20px",
              }}
            >
              <IconWithTooltip />

              <a
                href="javascript:void(0)"
                onClick={showPricingPopup}
                style={{
                  marginTop: "5px",
                  textDecoration: "none",
                  color: "#2caee4",
                  fontSize: "14px",
                  borderBottom: "1px solid #2caee4",
                  marginBottom: "8px",
                }}
              >
                Click here to check Mylapay charges applicable
              </a>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {/* <Grid item xs={2} >
            </Grid>

            <Grid item xs={8} style={{textAlign:"center"}} >

              <div className={styles.accToolTip}>
                  Mylapay allows you to charge customers for the shipment delivery and recover your cost on product handling, packages and settlement fees through convenience fee collection.
              </div>

            </Grid>

            <Grid item xs={2} >
            </Grid> */}

            {/* <Grid item xs={4}>
              </Grid> */}

            {/* <Grid item xs={4}>
              </Grid> */}

            {/* <Grid item xs={4}>
              </Grid> */}
            {/* <Grid item xs={4}>
              </Grid> */}

            {/* <Grid item xs={4}>
  
                <Box>
                 
                </Box>
              </Grid> */}

            <Grid item xs={4}></Grid>

            {state.checkedB == true ? (
              <>
                <Grid item xs={2}></Grid>

                <Grid item xs={3}></Grid>

                <Grid item xs={12}>
                  <div className={classestab.root}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={value}
                      onChange={handleChange}
                      aria-label="Vertical tabs example"
                      className={classestab.tabs}
                    >
                      {/* {checkval.courier==true?
                    <Tab label="Courier Shipment" {...a11yProps(0)} />
                  :
                  null}

                  {checkval.merchant==true?

                    <Tab label="Door Delivery" {...a11yProps(1)} />
                  :
                  null} */}

                      <Tab
                        label="Add Shop Location"
                        style={{ height: "100px" }}
                        {...a11yProps(0)}
                        icon={<AddLocation />}
                      />

                      {shopDetails.iTemplate != 1 &&
                      shopDetails.iTemplate != 3 ? (
                        <Tab
                          label="Courier Shipment"
                          style={{ height: "110px" }}
                          {...a11yProps(1)}
                          icon={<LocalShipping />}
                        />
                      ) : (
                        <Tab
                          label="Dunzo Shipment"
                          style={{ height: "110px" }}
                          {...a11yProps(1)}
                          icon={<LocalShipping />}
                        />
                      )}

                      <Tab
                        label="Door Delivery"
                        style={{ height: "110px" }}
                        {...a11yProps(2)}
                        icon={<DirectionsBike />}
                      />
                      <Tab
                        label="Self Pickup"
                        style={{ height: "110px" }}
                        {...a11yProps(3)}
                        icon={<DirectionsWalk />}
                      />
                      <Tab
                        label="TaT"
                        style={{ height: "110px" }}
                        {...a11yProps(4)}
                        icon={<HourglassFullSharp />}
                      />
                    </Tabs>

                    <TabPanel
                      value={value}
                      index={0}
                      style={{ width: "900px" }}
                    >
                      <Grid container spacing={2}>
                        {/* <Grid item xs={5}>
                          <Box mb={2} mt={2} style={{ marginTop: "110px" }}>

                            <FormControlLabel
                              control={
                                <Switch
                                  checked={checkval.courier}
                                  onChange={handleChangechk}
                                  name="checkedB"
                                  color="primary"
                                  value={1}
                                />
                              }
                            />
                          
                            {checkval.courier == true ? (
                              <span>Enabled</span>
                            ) : (
                              <span>Disabled</span>
                            )}

                              <IconWithTooltipcourier />
                          </Box>
                        </Grid>

                        {checkval.courier == true ? (
                          <Grid item xs={6} align="center">
                            <Typography
                              style={{ fontSize: "15px", fontWeight: "bold" }}
                            >
                              Courier Charges
                            </Typography>

                            {dataloop.map((item, index) => {
                              return (
                                <>
                                  <Box mb={2} mt={2}>
                                    <TextField
                                      variant="outlined"
                                      id="outlined-helperText"
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
                                  </Box>
                                </>
                              );
                            })}

                            <Box mb={2}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                style={{ marginRigth: "auto" }}
                                onClick={() => {
                                  handlesubmitcourier();
                                }}
                              >
                                Submit
                              </Button>
                            </Box>

                          </Grid>
                        ) : null} */}

                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              defaultValue="top"
                            >
                              <FormControlLabel
                                value="yes"
                                checked={addressType === 1}
                                onChange={handleChangelocation}
                                control={<Radio color="primary" />}
                                label="Single Location"
                              />

                              <FormControlLabel
                                value="no"
                                checked={addressType === 2}
                                onChange={handleChangelocation}
                                control={<Radio color="primary" />}
                                label="Multiple Location"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>

                        {addressType == 1 ? (
                          <Grid item xs={12}>
                            <div className={`checkout-step active`}>
                              <div className="checkout-content address-grid">
                                {addressList &&
                                  addressList.map((item, index) => (
                                    <div
                                      className={`address-item ${
                                        item.isActive ? "" : ""
                                      }`}
                                    >
                                      <div
                                        className="default_change_custom"
                                        onClick={() => setDefaultAddress(item)}
                                      >
                                        <Grid container>
                                          <Grid item xs={6}>
                                            <Typography variant="body2">
                                              Location - {index + 1}
                                            </Typography>
                                          </Grid>

                                          <Grid item xs={6}>
                                            <Typography
                                              variant="body2"
                                              style={{ textAlign: "center" }}
                                            >
                                              <FormControlLabel
                                                control={
                                                  <Switch
                                                    checked={item.isActive}
                                                    onChange={(e) => {
                                                      handleAddressActive(
                                                        e,
                                                        item
                                                      );
                                                    }}
                                                    name="checkedB"
                                                    color="primary"
                                                  />
                                                }
                                              />
                                              {item.isActive == true ? (
                                                <span>Active</span>
                                              ) : (
                                                <span>In-Active</span>
                                              )}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                        <Typography variant="body2">
                                          {item.Building_No},
                                          <br />
                                          {item.Street_Name},
                                          <br />
                                          {item.City} - {item.Pincode}
                                        </Typography>
                                        <div className="address-meta">
                                          <Typography variant="body2">
                                            <strong>Landmark - </strong>
                                            {item.Landmark}
                                          </Typography>
                                        </div>

                                        <Divider
                                          style={{
                                            marginTop: "5px",
                                            marginBottom: "5px",
                                          }}
                                        ></Divider>

                                        <Typography variant="body2">
                                          <strong>Pickup Agency : </strong>
                                        </Typography>

                                        {shopDetails.iTemplate != 1 &&
                                        shopDetails.iTemplate != 3 ? (
                                          <>
                                            <div>
                                              <Typography variant="body2">
                                                Delhivery :{" "}
                                                {item.delhivery_registered
                                                  ? "Available"
                                                  : "Not Available"}
                                              </Typography>
                                            </div>
                                            <div>
                                              <Typography variant="body2">
                                                Shiprocket :{" "}
                                                {item.pickup_location
                                                  ? "Available"
                                                  : "Not Available"}
                                              </Typography>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div>
                                              <Typography variant="body2">
                                                Dunzo :{" "}
                                                {item.dunzo_registered
                                                  ? "Available"
                                                  : "Not Available"}
                                              </Typography>
                                            </div>
                                          </>
                                        )}
                                      </div>

                                      <Typography
                                        variant="body2"
                                        style={{
                                          display: "flex",
                                          float: "right",
                                          marginTop: "15px",
                                        }}
                                      >
                                        <Button
                                          color="red"
                                          variant="outlined"
                                          style={{
                                            marginRight: "15px",
                                            border: "1px solid red",
                                            color: "red",
                                          }}
                                          onClick={() =>
                                            removeDeliveryAddress(item)
                                          }
                                        >
                                          Remove
                                        </Button>
                                        <Button
                                          color="secondary"
                                          variant="contained"
                                          style={{ color: "white" }}
                                          onClick={() =>
                                            editDeliveryAddress(item)
                                          }
                                        >
                                          Edit
                                        </Button>
                                      </Typography>
                                    </div>
                                  ))}
                                <div
                                  className="add-address"
                                  onClick={() => setAddressOpen(true)}
                                >
                                  <Add />
                                  <Typography variant="body2">
                                    Add New Address
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </Grid>
                        ) : (
                          <Grid item xs={12}>
                            <div className={`checkout-step active`}>
                              <div className="checkout-content address-grid">
                                {addressList &&
                                  addressList.map((item, index) => (
                                    <div className={`address-item`}>
                                      <div
                                        className="default_change_custom"
                                        // onClick={() => setMultipleAddress(item)}
                                      >
                                        <Grid container>
                                          <Grid item xs={6}>
                                            <Typography variant="body2">
                                              Location - {index + 1}
                                            </Typography>
                                          </Grid>

                                          <Grid item xs={6}>
                                            <Typography
                                              variant="body2"
                                              style={{ textAlign: "center" }}
                                            >
                                              <FormControlLabel
                                                control={
                                                  <Switch
                                                    checked={item.isActive}
                                                    onChange={(e) => {
                                                      handleAddressActive(
                                                        e,
                                                        item
                                                      );
                                                    }}
                                                    name="checkedB"
                                                    color="primary"
                                                  />
                                                }
                                              />
                                              {item.isActive == true ? (
                                                <span>Active</span>
                                              ) : (
                                                <span>In-Active</span>
                                              )}
                                            </Typography>
                                          </Grid>
                                        </Grid>

                                        <Divider
                                          style={{
                                            marginTop: "5px",
                                            marginBottom: "5px",
                                          }}
                                        ></Divider>

                                        <Typography variant="body2">
                                          {item.Building_No},
                                          <br />
                                          {item.Street_Name},
                                          <br />
                                          {item.City} - {item.Pincode}
                                        </Typography>
                                        <div className="address-meta">
                                          <Typography variant="body2">
                                            <strong>Landmark - </strong>
                                            {item.Landmark}
                                          </Typography>
                                        </div>

                                        <Divider
                                          style={{
                                            marginTop: "5px",
                                            marginBottom: "5px",
                                          }}
                                        ></Divider>

                                        <Typography variant="body2">
                                          <strong>Pickup Agency : </strong>
                                        </Typography>

                                        {shopDetails.iTemplate != 1 &&
                                        shopDetails.iTemplate != 3 ? (
                                          <>
                                            <div>
                                              <Typography variant="body2">
                                                Delhivery :{" "}
                                                {item.delhivery_registered
                                                  ? "Available"
                                                  : "Not Available"}
                                              </Typography>
                                            </div>
                                            <div>
                                              <Typography variant="body2">
                                                Shiprocket :{" "}
                                                {item.pickup_location
                                                  ? "Available"
                                                  : "Not Available"}
                                              </Typography>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div>
                                              <Typography variant="body2">
                                                Dunzo :{" "}
                                                {item.dunzo_registered
                                                  ? "Available"
                                                  : "Not Available"}
                                              </Typography>
                                            </div>
                                          </>
                                        )}
                                      </div>

                                      <Typography
                                        variant="body2"
                                        style={{
                                          display: "flex",
                                          float: "right",
                                          marginTop: "15px",
                                        }}
                                      >
                                        <Button
                                          color="red"
                                          variant="outlined"
                                          style={{
                                            marginRight: "15px",
                                            border: "1px solid red",
                                            color: "red",
                                          }}
                                          onClick={() =>
                                            removeDeliveryAddress(item)
                                          }
                                        >
                                          Remove
                                        </Button>
                                        <Button
                                          color="secondary"
                                          variant="contained"
                                          style={{ color: "white" }}
                                          onClick={() =>
                                            editDeliveryAddress(item)
                                          }
                                        >
                                          Edit
                                        </Button>
                                      </Typography>
                                    </div>
                                  ))}
                                <div
                                  className="add-address"
                                  onClick={() => setAddressOpen(true)}
                                >
                                  <Add />
                                  <Typography variant="body2">
                                    Add New Address
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </Grid>
                    </TabPanel>

                    {shopDetails.iTemplate != 1 &&
                    shopDetails.iTemplate != 3 ? (
                      <>
                        <TabPanel
                          value={value}
                          index={1}
                          style={{ width: "750px" }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={5}>
                              <Box mb={2} mt={2} style={{ marginTop: "110px" }}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={checkval.courier}
                                      onChange={handleChangechk}
                                      name="checkedB"
                                      color="primary"
                                      value={1}
                                    />
                                  }
                                />

                                {checkval.courier == true ? (
                                  <span>Enabled</span>
                                ) : (
                                  <span>Disabled</span>
                                )}

                                <IconWithTooltipcourier />
                              </Box>
                            </Grid>

                            {checkval.courier == true ? (
                              <Grid item xs={6} align="center">
                                <Typography
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Courier Charges
                                </Typography>

                                {dataloop.map((item, index) => {
                                  return (
                                    <>
                                      <Box mb={2} mt={2}>
                                        <TextField
                                          variant="outlined"
                                          id="outlined-helperText"
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
                                      </Box>
                                    </>
                                  );
                                })}

                                <Box mb={2}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    style={{ marginRigth: "auto" }}
                                    onClick={() => {
                                      handlesubmitcourier();
                                    }}
                                  >
                                    Submit
                                  </Button>
                                </Box>
                              </Grid>
                            ) : null}
                          </Grid>
                        </TabPanel>
                      </>
                    ) : (
                      <>
                        <TabPanel
                          value={value}
                          index={1}
                          style={{ width: "750px" }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={5}>
                              {/* <label className={classes.section2} mb={4}>
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
                            </label> */}

                              {/* <Box  mb={2} mt={2}>
                            Will Courier shipment is applicable?
                          </Box> */}

                              <Box mb={2} mt={2} style={{ marginTop: "110px" }}>
                                {/* <span style={{marginRight:"20px"}}>No</span> */}

                                {selectedaddressData.dunzo_registered == 1 ? (
                                  <>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={checkval.dunzo}
                                          onChange={handleChangechkdunzo}
                                          name="checkedB"
                                          color="primary"
                                          value={1}
                                        />
                                      }
                                      // label="Yes"
                                    />

                                    {checkval.dunzo == true ? (
                                      <span>Enabled</span>
                                    ) : (
                                      <span>Disabled</span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={false}
                                          onChange={handleChangechkdunzo}
                                          name="checkedB"
                                          color="primary"
                                          disabled
                                          value={1}
                                        />
                                      }
                                      // label="Yes"
                                    />
                                    <span>Disabled</span>
                                  </>
                                )}
                                {/* <span>Yes</span> */}

                                <IconWithTooltipcourier />
                              </Box>
                            </Grid>

                            <Grid item xs={6} style={{ marginTop: "110px" }}>
                              {selectedaddressData.dunzo_registered == 0 ? (
                                <Typography
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Dunzo shipment is not available for this
                                  address.
                                </Typography>
                              ) : null}
                            </Grid>
                          </Grid>
                        </TabPanel>
                      </>
                    )}

                    <TabPanel
                      value={value}
                      index={2}
                      style={{ width: "750px" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          {/* <Box  mb={2} mt={2}>
                      Will Door delivery is applicable?
                    </Box> */}

                          <Box mb={2} mt={2} style={{ marginTop: "225px" }}>
                            {/* <span style={{marginRight:"20px"}}>No</span> */}

                            <FormControlLabel
                              control={
                                <Switch
                                  checked={checkval.merchant}
                                  // onChange={handleChangechk}
                                  onChange={(e) => {
                                    handleDialogdelivery(e.target.checked);
                                  }}
                                  name="checkedB"
                                  color="primary"
                                  value={2}
                                />
                              }
                              // label="Yes"
                            />
                            {checkval.merchant == true ? (
                              <span>Enabled</span>
                            ) : (
                              <span>Disabled</span>
                            )}

                            <IconWithTooltipdoor />
                          </Box>

                          {/* <label className={classes.section2}>
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
                    </label> */}
                        </Grid>

                        {checkval.merchant == true ? (
                          <Grid item xs={6} align="center">
                            <Typography
                              style={{ fontSize: "15px", fontWeight: "bold" }}
                            >
                              Door Delivery Charges
                            </Typography>

                            {kilometerweightval.length > 0 ? (
                              <>
                                {chargesloop != "" ? (
                                  <>
                                    {chargesloop.kilometers.map(
                                      (item, index) => {
                                        return (
                                          <>
                                            {/* <Grid item xs={3}>
                                </Grid> */}
                                            <Grid item xs={12}>
                                              <Box mb={2} mt={2}>
                                                <TextField
                                                  variant="outlined"
                                                  fullWidth
                                                  InputLabelProps={{
                                                    shrink: true,
                                                  }}
                                                  // label={
                                                  //   item.Maximum_Charge !== 0
                                                  //     ? `${item.Charge_Range} (Max ${item.Maximum_Charge})`
                                                  //     : `${item.Charge_Range} (Free)`
                                                  // }
                                                  label={
                                                    item.km_range_label + " km"
                                                  }
                                                  value={
                                                    kilometerweightval[index]
                                                      .km_amount
                                                  }
                                                  onChange={handleChangekilometer(
                                                    // item.km_end_range,
                                                    index
                                                  )}
                                                />
                                              </Box>
                                            </Grid>
                                          </>
                                        );
                                      }
                                    )}

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
                                            deliverychargesubmit();
                                          }}
                                        >
                                          Submit
                                        </Button>
                                      </Box>
                                    </Grid>
                                  </>
                                ) : null}
                              </>
                            ) : null}
                          </Grid>
                        ) : null}
                      </Grid>
                    </TabPanel>

                    <TabPanel
                      value={value}
                      index={3}
                      style={{ width: "750px" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          {/* <label className={classes.section2}>
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
                        <IconWithTooltip />
                      </label> */}

                          {/* <Box  mb={2} mt={2}>
                      Will Self pickup is applicable?
                    </Box> */}

                          <Box mb={2} mt={2} style={{ marginTop: "325px" }}>
                            {/* <span style={{marginRight:"20px"}}>No</span> */}

                            <FormControlLabel
                              control={
                                <Switch
                                  checked={checkval.selfpickup}
                                  // onChange={handleDialogselfpickup}
                                  onChange={(e) => {
                                    handleDialogselfpickup(e.target.checked);
                                  }}
                                  name="checkedB"
                                  color="primary"
                                  value={3}
                                />
                              }
                              // label="Yes"
                            />
                            {checkval.selfpickup == true ? (
                              <span>Enabled</span>
                            ) : (
                              <span>Disabled</span>
                            )}

                            <IconWithTooltippickup />
                          </Box>
                        </Grid>

                        {shipmentdata.length > 0 ? (
                          <Grid item xs={6} align="center">
                            <div className={styles.accToolTip}>
                              <Typography>
                                <span
                                  style={{
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Customer will Reach Here
                                </span>
                              </Typography>

                              <Typography align="left">
                                {shipmentdata[0].Building_No + ", "}
                              </Typography>
                              <Typography align="left">
                                {shipmentdata[0].Street_Name + ", "}
                              </Typography>
                              <Typography align="left">
                                {shipmentdata[0].Landmark + ", "}
                              </Typography>
                              <Typography align="left">
                                {shipmentdata[0].City + ", "}
                              </Typography>
                              <Typography align="left">
                                {shipmentdata[0].Pincode + ", "}
                              </Typography>

                              <Typography align="left">
                                {shipmentdata[0].State + ". "}
                              </Typography>
                            </div>

                            {checkval.selfpickup == true ? (
                              <div className={styles.accToolTip}>
                                <Typography
                                  align="left"
                                  style={{ fontWeight: "bold" }}
                                >
                                  Note : No charges will be applicable for
                                  customer self-pickup
                                </Typography>
                              </div>
                            ) : null}
                          </Grid>
                        ) : null}
                        {/* <Typography>
                          <a
                            href="javascript:void(0)"
                            onClick={() => {
                              setViewAllAddress(true);
                            }}
                          >
                            Click here to view all addresss
                          </a>
                        </Typography> */}
                      </Grid>
                    </TabPanel>

                    <TabPanel
                      value={value}
                      index={4}
                      style={{ width: "750px" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
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
                                  onChange={handleChangetat}
                                  control={<Radio />}
                                  label="Days"
                                />
                              ) : (
                                <FormControlLabel
                                  value="1"
                                  disabled
                                  checked={tat_type === 1}
                                  onChange={handleChangetat}
                                  control={<Radio />}
                                  label="Days"
                                />
                              )}

                              <FormControlLabel
                                value="2"
                                checked={tat_type === 2}
                                onChange={handleChangetat}
                                control={<Radio />}
                                label="Hours"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid item xs={4}></Grid>

                      <Grid item xs={4}></Grid>

                      <Grid item xs={12} style={{ textAlign: "center" }}>
                        {tatFlag && (
                          <>
                            <Box>
                              {/* <FormControl
                              variant="outlined"
                              // style={{ minWidth: "150px" }}
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
                            </FormControl> */}

                              <FormControl className={classesselect.margin}>
                                <InputLabel id="demo-customized-select-label">
                                  Order Acceptance
                                  {tat_type == 1 ? (
                                    <IconWithTooltiptatdays />
                                  ) : tat_type == 2 ? (
                                    <IconWithTooltiptathours />
                                  ) : null}
                                </InputLabel>
                                <Select
                                  labelId="demo-customized-select-label"
                                  id="demo-customized-select"
                                  value={selectedTat}
                                  label="Expected TAT"
                                  onChange={handleChangeselect}
                                  input={<BootstrapInput />}
                                  style={{ minWidth: "150px" }}
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

                              <FormControl className={classesselect.margin}>
                                <InputLabel
                                  id="demo-customized-select-label"
                                  style={{ width: "170px" }}
                                >
                                  Shipment Handover
                                  {tat_type == 1 ? (
                                    <IconWithTooltiphandoverdays />
                                  ) : tat_type == 2 ? (
                                    <IconWithTooltiphandoverhours />
                                  ) : null}
                                </InputLabel>
                                <Select
                                  labelId="demo-customized-select-label"
                                  id="demo-customized-select"
                                  value={selectedsecondTat}
                                  label="Expected TAT"
                                  onChange={handleChangesecondtat}
                                  input={<BootstrapInput />}
                                  style={{ minWidth: "150px" }}
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

                              {/* {tat_type == 1 ? (
                              <IconWithTooltiptatdays />
                            ) : tat_type == 2 ? (
                              <IconWithTooltiptathours />
                            ) : null} */}

                              <Collapse in={error}>
                                <Box mt={2}>
                                  <Alert severity="error">{errorMsg}</Alert>
                                </Box>
                              </Collapse>
                            </Box>
                          </>
                        )}
                      </Grid>

                      {/* <Grid item xs={4} style={{ textAlign: "center" }}>
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
                    </Grid> */}
                    </TabPanel>
                  </div>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6}></Grid>

                <Grid item xs={4}></Grid>

                <Grid item xs={6} style={{ color: "red" }}>
                  No delivery option selected for your shop!
                </Grid>
              </>
            )}

            {/* <Grid item xs={1} align="center">
            </Grid>

            <Grid item xs={5} align="center">

              <div className={classesaccord.root}>

                {checkval.courier==true?

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classesaccord.heading}>Courier Shipment</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <Grid item xs={4} align="center">
                        <Typography gutterBottom variant="h6">
                          Delivery Charges
                        </Typography>

                        {dataloop.map((item, index) => {
                          return (
                            <>
                            <Box  mb={2} mt={2}>
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
                            </Box>
                            </>
                          );
                        })}

                          <div className={styles.accToolTip}>
                              You can add delivery charges to your customer payment based on the order value amount. This is to recover your delivery cost associated with your product shipment. 
                          </div>
                      </Grid>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                :
                null}

                {checkval.merchant==true?
                
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classesaccord.heading}>Door Delivery</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                :
                null}

                {checkval.selfpickup==true?

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                  >
                    <Typography className={classesaccord.heading}>Self Pickup</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                :
                null}
              </div>

            </Grid> */}

            {/* <Grid item xs={4} align="center">
              <Typography gutterBottom variant="h6">
                Delivery Charges
              </Typography>

              {dataloop.map((item, index) => {
                return (
                  <>
                  <Box  mb={2} mt={2}>
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
                  </Box>
                  </>
                );
              })}

                <div className={styles.accToolTip}>
                    You can add delivery charges to your customer payment based on the order value amount. This is to recover your delivery cost associated with your product shipment. 
                </div>
            </Grid> */}

            {/* <Grid item xs={1} align="center">
            </Grid>

            <Grid item xs={4} align="center">
              <Typography gutterBottom variant="h6">
              Add Convenience Fee
              </Typography>

                <Box mb={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="number"
                    min={0}
                    label="Convenience Fee(Max 2%)"
                    InputLabelProps={{ shrink: true }}
                    value={convenienceFee}
                    onChange={handleConvenienceFee}
                  />
                </Box>
                <div className={styles.accToolTip}>
                    You can add convenience fee up to 2% on order value which will be collected from your customer during the payment checkout. This option is provided to recover your cost associated with product handling, packages and payment charges. 
                </div>
            </Grid> */}
          </Grid>
        </Paper>
        <Collapse in={error}>
          <Box mt={2}>
            <Alert severity="error">{errorMsg}</Alert>
          </Box>
        </Collapse>
        {/* <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => {
              stepChange(2);
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
            Save
          </Button>
        </Box> */}
      </form>
      {/* <Dialog
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
      </Dialog> */}

      <Pricing showPricing={showPricing} setShowPricing={setShowPricing} />

      {addressOpen && (
        <AddAddress
          addressOpen={addressOpen}
          getShipmentOptionsaddaddress={getShipmentOptionsaddaddress}
          setAddressOpen={setAddressOpen}
          getAddress={getAddress}
          addressType={addressType}
          alertFlag={alertFlag}
          setAlertFlag={setAlertFlag}
        />
      )}
      {editAddressOpen ? (
        <EditAddress
          addressOpen={editAddressOpen}
          setAddressOpen={setEditAddressOpen}
          getAddress={getAddress}
          prefillAddressData={addressData}
          getShipmentOptionsaddaddress={getShipmentOptionsaddaddress}
        />
      ) : null}

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
        <DialogContent style={{ textAlign: "center" }}>
          Please Configure your shop to Configure Your Pricing
        </DialogContent>
      </Dialog>
      <Dialog
        style={{ width: "80%", margin: "auto" }}
        fullWidth
        maxWidth="100%"
        open={viewAllAddress}
        onClose={() => setViewAllAddress(false)}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>All Address</Box>
            <Box>
              <IconButton
                onClick={() => {
                  setViewAllAddress(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <div className={`checkout-step active`}>
            <div className="checkout-content address-grid">
              {addressList &&
                addressList.map((item) => (
                  <div
                    className={`address-item ${
                      item.isActive ? "selected" : ""
                    }`}
                  >
                    <div
                      className="default_change_custom"
                      onClick={() => setDefaultAddress(item)}
                    >
                      <Typography variant="body2">
                        {item.Building_No},
                        <br />
                        {item.Street_Name},
                        <br />
                        {item.City} - {item.Pincode}
                      </Typography>
                      <div className="address-meta">
                        <Typography variant="body2">
                          <strong>Landmark - </strong>
                          {item.Landmark}
                        </Typography>
                      </div>
                      <Divider
                        style={{ marginTop: "5px", marginBottom: "5px" }}
                      ></Divider>
                      <div>
                        <Typography variant="body2">
                          Delhivery :{" "}
                          {item.delhivery_registered
                            ? "Available"
                            : "Not Available"}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2">
                          Shiprocket :{" "}
                          {item.pickup_location ? "Available" : "Not Available"}
                        </Typography>
                      </div>
                    </div>

                    <Typography
                      variant="body2"
                      style={{
                        display: "flex",
                        float: "right",
                        marginTop: "15px",
                      }}
                    >
                      <Button
                        color="red"
                        variant="outlined"
                        style={{
                          marginRight: "15px",
                          border: "1px solid red",
                          color: "red",
                        }}
                        onClick={() => removeDeliveryAddress(item)}
                      >
                        Remove
                      </Button>
                      <Button
                        color="secondary"
                        variant="contained"
                        style={{ color: "white" }}
                        onClick={() => editDeliveryAddress(item)}
                      >
                        Edit
                      </Button>
                    </Typography>
                  </div>
                ))}
              <div className="add-address" onClick={() => setAddressOpen(true)}>
                <Add />
                <Typography variant="body2">Add New Address</Typography>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
