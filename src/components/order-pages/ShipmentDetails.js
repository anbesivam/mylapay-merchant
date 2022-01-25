import {
  Box,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
  Tooltip,
} from "@material-ui/core";
import {
  LocalShipping,
  Label,
  ArrowDownwardOutlined,
  OutdoorGrill,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import Switch from "@material-ui/core/Switch";
// import CloseIcon from "@material-ui/icons/Close";
// //import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from "formik";
// import CheckApproxPrice from "./CheckApproxPrice";
import CheckApproxPriceInline from "./CheckApproxPriceInline";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import short from "short-uuid";
import SelectSearch from "react-select-search";
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';

// import debounce from 'lodash.debounce';
import _ from "lodash";
import Swal from "sweetalert2";

import {
  setShipDetails,
  setDeliveryDetails,
  setPaymentDetails,
} from "../../redux/shipmentPageSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  top: {
    color: "#1a90ff",
    animationDuration: "550ms",
    position: "absolute",
    left: 0,
  },
  circle: {
    strokeLinecap: "round",
  },
}));

export default function ShipmentDetails({ orderData, stepChange }) {
  // const shipmentDetails = useSelector((state) => state.shipmentPage.shipDetails);

  const inputArray = useSelector((state) => state.shipmentPage.shipDetails);

  const [orderDataval, setorderData] = useState(orderData[0]);

  // console.log("Order data : " + JSON.stringify(orderData[0]));

  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [progress_on, setprogress_on] = useState(false);
  const [overlay_on, setoverlay_on] = useState(false);
  const [progress_on_fullpage, setprogress_on_fullpage] = useState(false);
  const [shopAddress, setShopAddress] = useState(null);

  const history = useHistory();
  const {
    REACT_APP_SHIPROCKET_URL,
    REACT_APP_DUNZO_URL,
    REACT_APP_DELHIVERY_URL,
  } = process.env;

  const classesFacebook = useStylesFacebook();

  /* Select Dropdown starts here */

  const [selectedValue, setselectedValue] = React.useState(0);

  const [pickupvalue, setpickupvalue] = React.useState("");

  const [awbcode, setawbcode] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const [length, setLength] = React.useState(0);
  const [breadth, setBreadth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [weight, setWeight] = React.useState(0);
  const [shipingCustomerInfo, setShipingCustomerInfo] = React.useState([]);
  const [selectedCourier, setSelectedCourier] = React.useState([]);
  const [courierListOn, setCourierListOn] = React.useState(false);

  const [manifestURL, setManifestURL] = useState(false);
  const [labelButton, setLabelButton] = useState(false);

  const [addressdetails, setaddressdetails] = useState([]);

  const [deliveryType, setDeliveryType] = useState(null);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState([]);
  const [orderReadyForPickup, setOrderReadyForPickup] = useState(false);
  const [alreadyInitiatedShipDialog, setAlreadyInitiatedShipDialog] =
    useState(false);
  const [shipmentInitiate, setShipmentInitiate] = useState(false);
  const [shipmentResponseMessage, setShipmentResponseMessage] = useState(false);
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let pickup_postcode = userDetails.pincode;
  let delivery_postcode = shipingCustomerInfo.Pincode;
  let orderTotalAmount = orderDataval.totalAmount;

  // console.log(orderDataval);

  /* Courier option dropdown */
  const [courieropen, setcourierOpen] = React.useState(false);
  const [selectedCourierValue, setselectedCourierValue] = React.useState("");

  const handleCourierClose = () => {
    setcourierOpen(false);
  };

  const handleCourierOpen = () => {
    setcourierOpen(true);
  };

  const handleCourierChange = (event) => {
    setselectedCourierValue(event);
    setData([]);
  };

  /* Courier option dropdown */

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogOpenShipment, setDialogOpenShipment] = React.useState(false);
  const [dialogOpenalreadyShipment, setdialogOpenalreadyShipment] =
    React.useState(false);

  const [dialogOpendelivery, setdialogOpendelivery] = React.useState(false);

  const [viewcustomer, setviewcustomer] = React.useState(false);

  const handleChange = (event) => {
    setselectedValue(event);
    setCourierListOn(false);
    // console.log(event);
  };

  const handleChangechk = (event) => {
    // console.log("event click :" + event.target.checked);

    if (event.target.checked === true) {
      setpickupvalue("1");
      // console.log("check click");
    } else {
      setpickupvalue("0");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDialogClose = (value) => {
    handleDialog(false);
  };

  const handleDialogCloseShipment = (value) => {
    handleDialogShipment(false);
    redirection(1);
  };

  const handleDialogCloseReadyForPickup = (value) => {
    setOrderReadyForPickup(false);
  };

  const redirection = (n) => {
    localStorage.setItem("redirectid", n);
    history.push(`/orders`);
  };

  const handleDialogalreadyInitiatedShipDialog = (value) => {
    setAlreadyInitiatedShipDialog(false);
    redirection(1);
  };

  const handleDialogClosealreadyShipment = (value) => {
    setdialogOpenalreadyShipment(false);
    redirection(1);
  };

  const handleDialogalreadyShipmentok = (value) => {
    setdialogOpenalreadyShipment(false);

    // history.push(`/orders`);
    redirection(1);
  };

  const handleDialogdeliveryclose = (value) => {
    setdialogOpendelivery(false);
    redirection(1);
  };

  const handleviewcustomerclose = (value) => {
    setviewcustomer(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  /* Select Dropdown ends here */

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  const handleDialogShipment = (value) => {
    setDialogOpenShipment(value);
  };

  const getData = async () => {
    await axios
      .post("/mylapay/customer/address", {
        iOrder: orderDataval["iOrder"],
        // phone: orderDataval["phone"],
      })
      .then((response) => {
        if (response.data) {
          // console.log(
          //   "Customer details : " + JSON.stringify(response.data.data[0])
          // );
          setaddressdetails(response.data.data[0]);
        }
      })
      .catch((error) => console.log(error));
  };

  const getOrderDeliveryData = async () => {
    await axios
      .get(
        `/mylapay/auth_customer/get/order-address?order_id=${orderDataval.iOrder}`
      )
      .then((response) => {
        if (response.data) {
          setOrderDeliveryDetails(response.data.data[0]);
          // console.log(response.data.data[0]);
        }
      })
      .catch((error) => console.log(error));
  };

  // const getShopAddressByiUser = async () => {
  //   await axios
  //     .get(`/mylapay/shop/address/by-iUser?iUser=${userDetails.iUser}`)
  //     .then((response) => {
  //       if (response.data) {
  //         setShopAddress(response.data.data[0]);
  //         // console.log(response.data.data[0]);
  //       }
  //     })
  //     .catch((error) => console.log(error));
  // };

  const getShopAddressByiOrder = async () => {
    await axios
      .get(`/mylapay/shop/address/by-iOrder?iOrder=${orderDataval.iOrder}`)
      .then((response) => {
        if (response.data) {
          setShopAddress(response.data.data[0]);
          // console.log(response.data.data[0]);
        }
      })
      .catch((error) => console.log(error));
  };

  // const IOSSwitch = withStyles((theme) => ({
  //     root: {
  //       width: 72,
  //       height: 26,
  //       padding: 0,
  //       margin: theme.spacing(0),
  //     },
  //     switchBase: {
  //       padding: 1,
  //       '&$checked': {
  //         transform: 'translateX(16px)',
  //         color: theme.palette.common.white,
  //         '& + $track': {
  //           backgroundColor: '#52d869',
  //           opacity: 1,
  //           border: 'none',

  //         },

  //       },
  //       '&$focusVisible $thumb': {
  //         color: '#52d869',
  //         border: '6px solid #fff',
  //       },
  //     },
  //     thumb: {
  //       width: 24,
  //       height: 24,
  //     },
  //     track: {
  //       borderRadius: 26 / 2,
  //       border: `1px solid ${theme.palette.grey[400]}`,
  //       backgroundColor: '#f44336',
  //       opacity: 1,
  //       transition: theme.transitions.create(['background-color', 'border']),
  //     },
  //     checked: {
  //       marginLeft:'30px'
  //     },
  //     focusVisible: {},
  //   }))(({ classes, ...props }) => {
  //     return (
  //       <Switch
  //         focusVisibleClassName={classes.focusVisible}
  //         disableRipple
  //         classes={{
  //           root: classes.root,
  //           switchBase: classes.switchBase,
  //           thumb: classes.thumb,
  //           track: classes.track,
  //           checked: classes.checked,
  //         }}
  //         {...props}
  //       />
  //     );
  //   });

  const movetodelivery = () => {
    // setDialogOpenShipment(value);

    if (selectedValue == 1) {
      setDialogOpenShipment(false);

      orderDataval.awbcode = awbcode;

      dispatch(setShipDetails(orderDataval));
      // console.log("Dispatch details ship : " + JSON.stringify(inputArray));
      stepChange(2);
    } else {
      // history.push(`/orders`);
      orderDataval.awbcode = "";

      dispatch(setShipDetails(orderDataval));
      // console.log("Dispatch details ship : " + JSON.stringify(inputArray))
      stepChange(2);
    }
  };

  const nextStep = () => {
    if (awbcode != "") {
      // dispatch(setShipDetails(awbcode));

      // let payload;
      // if (inputArray) {
      //   payload = [...inputArray, awbcode];
      // } else {
      //   payload = [awbcode];
      // }
      dispatch(setShipDetails(awbcode));

      // console.log("Dispatch details ship : " + JSON.stringify(inputArray));

      stepChange(2);
    } else {
      setdialogOpendelivery(true);
    }
  };

  const getCustomerDeliveryInfo = async () => {
    await axios
      .post("/mylapay/orders/customer-delivery/info", {
        iOrder: orderDataval.iOrder,
      })
      .then((response) => {
        if (response.data.status === 1) {
          // console.log(response.data);
          //let temp = response.data.data.map((item) => item.product_name);
          setShipingCustomerInfo(response.data.data[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCustomerDeliveryInfo();
    getData();
    getOrderDeliveryData();
    //getShopAddressByiUser();
    getShopAddressByiOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDoorDeliveryShipment = () => {
    // console.log("Door Delivery Shipment");
    setoverlay_on(true);
    setprogress_on_fullpage(true);

    let jsonDataForDoorDelivery = {
      order_id: orderDataval.iOrder,
      Request_ID: short.generate(),
      name: formik.values.delivery_person_name,
      phone_number: formik.values.delivery_person_phone,
    };
    axios
      .post(
        `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/door-delivery/confirm-shipment`,
        jsonDataForDoorDelivery
      )
      .then((response) => {
        // console.log("Door Delivery confirm shipment response");
        // console.log(response);
        // console.log(response.data);
        if (response.data.data === "already initiated") {
          setdialogOpenalreadyShipment(false);
          setoverlay_on(false);
          setprogress_on_fullpage(false);
        } else {
          setoverlay_on(false);
          setprogress_on_fullpage(false);
          // handleDialogShipment(true);

          Swal.fire({
            title: "Success!",
            text: "Your Shipment request initiated successfully.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#20295C",
            showCancelButton: false,
          }).then((result) => {
            if (result.isConfirmed) {
              redirection(1);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmdunzopickup = async () => {
    let confirmedShipment = localStorage.getItem("shipmentConfirmationOrder");
    // console.log(confirmedShipment);
    if (confirmedShipment === orderDataval.iOrder.toString()) {
      // Already shipment done
      setAlreadyInitiatedShipDialog(true);
    } else {
      // console.log("dunzo condition works");
      confirmShipmentDunzo();
    }
  };

  const confirmselfpickup = async () => {
    let confirmedShipment = localStorage.getItem("shipmentConfirmationOrder");
    // console.log(confirmedShipment);
    if (confirmedShipment === orderDataval.iOrder.toString()) {
      // Already shipment done
      setAlreadyInitiatedShipDialog(true);
    } else {
      confirmShipmentSelfPickup();
    }
  };
  const confirmdoordelivery = async () => {
    let jsonDataForDoorDelivery = {
      order_id: orderDataval.iOrder,
      Request_ID: short.generate(),
      name: formik.values.delivery_person_name,
      phone_number: formik.values.delivery_person_phone,
    };
    axios
      .post(
        `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/door-delivery/confirm-shipment`,
        jsonDataForDoorDelivery
      )
      .then((response) => {
        if (response.data.data === "already initiated") {
          // setdialogOpenalreadyShipment(true);

          Swal.fire({
            title: "Success!",
            text: "Your Shipment request already initiated.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#20295C",
            showCancelButton: false,
          }).then((result) => {
            if (result.isConfirmed) {
              redirection(1);
            }
          });

          setoverlay_on(false);
          setprogress_on_fullpage(false);
        } else {
          axios
            .post("/mylapay/orders/update", {
              orderId: orderDataval.iOrder,
              // cancelProducts: sel_iorder,
              productStatus: 3,
            })

            .then((response) => {
              // console.log("Order Track Update response");

              // setDialogOpenShipment(true);
              // setShipmentInitiate(true);

              Swal.fire({
                title: "Success!",
                text: "Your Shipment request initiated successfully.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
                showCancelButton: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  redirection(1);
                }
              });

              // setShipmentResponseMessage(
              //   "Your Shipment request initiated successfully."
              // );

              // history.push(`/orders`);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const generateLabel = async () => {
    await axios
      .post(`${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/label`, {
        awb_code: awbcode,
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

  const generateManifest = async () => {
    await axios
      .post(
        `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/manifest`,
        {
          awb_code: awbcode,
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

  const shiprocketshipment = async () => {
    if (selectedValue == 1) {
      // console.log("confirmShipmentPreCheck");
      // console.log(selectedCourier);
      if (selectedCourierValue === 2) {
        // confirmDelhiveryShipment();
        checkServiceability();
      } else {
        if (selectedCourier.rate > 0) {
          confirmShipment();
        } else {
          // Show popup msg to select courier company before confirm shipment
          handleDialog(true);
        }
      }
    }
  };

  const confirmShipmentPreCheck = async () => {
    // console.log(selectedValue);
    // console.log(deliveryType);
    // console.log(pickupvalue);

    if ((deliveryType === 2 || deliveryType === 3) && pickupvalue !== "1") {
      // Please select order ready for pickup
      let confirmedShipment = localStorage.getItem("shipmentConfirmationOrder");
      // console.log(confirmedShipment);
      if (confirmedShipment === orderDataval.iOrder.toString()) {
        // Already shipment done
        setAlreadyInitiatedShipDialog(true);
      } else {
        setOrderReadyForPickup(true);
      }
    }

    if (selectedValue == 1) {
      // console.log("confirmShipmentPreCheck");
      // console.log(selectedCourier);
      if (selectedCourier.rate > 0) {
        confirmShipment();
      } else {
        // Show popup msg to select courier company before confirm shipment
        handleDialog(true);
      }
    } else if (selectedValue !== 0) {
      let jsonDataForDoorDelivery = {
        order_id: orderDataval.iOrder,
        Request_ID: short.generate(),
        name: formik.values.delivery_person_name,
        phone_number: formik.values.delivery_person_phone,
      };
      axios
        .post(
          `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/door-delivery/confirm-shipment`,
          jsonDataForDoorDelivery
        )
        .then((response) => {
          // console.log("Door Delivery confirm shipment response");
          // console.log(response);
          // console.log(response.data);

          if (response.data.data === "already initiated") {
            // setdialogOpenalreadyShipment(true);

            Swal.fire({
              title: "Success!",
              text: "Your Shipment request already initiated.",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#20295C",
              showCancelButton: false,
            }).then((result) => {
              if (result.isConfirmed) {
                redirection(1);
              }
            });

            setoverlay_on(false);
            setprogress_on_fullpage(false);
          } else {
            axios
              .post("/mylapay/orders/update", {
                orderId: orderDataval.iOrder,
                // cancelProducts: sel_iorder,
                productStatus: 3,
              })

              .then((response) => {
                console.log("Order Track Update response");

                setDialogOpenShipment(true);

                // history.push(`/orders`);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (deliveryType === 3) {
      console.log("dunzo condition");
      if (pickupvalue === "1" || pickupvalue === 1) {
        let confirmedShipment = localStorage.getItem(
          "shipmentConfirmationOrder"
        );
        console.log(confirmedShipment);
        if (confirmedShipment === orderDataval.iOrder.toString()) {
          // Already shipment done
          setAlreadyInitiatedShipDialog(true);
        } else {
          confirmShipmentDunzo();
        }
      }
    } else if (deliveryType === 2) {
      console.log("Self Pickup from store condition");

      if (pickupvalue === "1" || pickupvalue === 1) {
        let confirmedShipment = localStorage.getItem(
          "shipmentConfirmationOrder"
        );
        console.log(confirmedShipment);
        if (confirmedShipment === orderDataval.iOrder.toString()) {
          // Already shipment done
          setAlreadyInitiatedShipDialog(true);
        } else {
          confirmShipmentSelfPickup();
        }
      }
    }
  };

  const confirmShipmentSelfPickup = async () => {
    console.log("Confirm shipment self pickup");
    setoverlay_on(true);
    setprogress_on_fullpage(true);

    let jsonDataForSelfPickup = {
      order_id: orderDataval.iOrder,
      Request_ID: short.generate(),
    };
    axios
      .post(
        `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/self-pickup-from-store/confirm-shipment`,
        jsonDataForSelfPickup
      )
      .then((response) => {
        console.log("Self pickup from store confirm shipment response");
        console.log(response);
        console.log(response.data);
        setoverlay_on(false);
        setprogress_on_fullpage(false);
        //handleDialogShipment(true);

        let confirmedShipment = localStorage.setItem(
          "shipmentConfirmationOrder",
          orderDataval.iOrder
        );

        axios
          .post("/mylapay/orders/update", {
            orderId: orderDataval.iOrder,
            // cancelProducts: sel_iorder,
            productStatus: 3,
          })

          .then((response) => {
            console.log("Order Track Update response");
            // handleDialogShipment(true);

            Swal.fire({
              title: "Success!",
              text: "Your Shipment request initiated successfully.",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#20295C",
              showCancelButton: false,
            }).then((result) => {
              if (result.isConfirmed) {
                redirection(1);
              }
            });

            // history.push(`/orders`);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmShipmentDunzo = async () => {
    //console.log("confirmShipment Dunzo calling");
    //console.log(userDetails);
    //console.log("customer details");
    //console.log(addressdetails);
    console.log(
      orderDataval.iOrder.toString() + "0" + orderDataval.iOrder.toString()
    );
    let tempCustomer = addressdetails;
    let customerDetails = orderDeliveryDetails;

    let dunzoTaskInput = {
      request_id: short.generate(),
      reference_id: orderDataval.iOrder.toString(), // Order id
      drop_reference_id:
        orderDataval.iOrder.toString() + "0" + orderDataval.iOrder.toString(),
      pickup_details: [
        {
          reference_id: orderDataval.iOrder.toString(),
          address: {
            // apartment_address: userDetails.Door_Number,
            // street_address_1: userDetails.Street_Name,
            // street_address_2: userDetails.Street_Name,
            // landmark: userDetails.Landmark,
            // city: userDetails.City,
            // state: userDetails.StateName,
            // pincode: userDetails.pincode.toString(),
            // country: "India",
            // lat: parseFloat(userDetails.lat),
            // lng: parseFloat(userDetails.lng),
            apartment_address: shopAddress.Building_No,
            street_address_1: shopAddress.Street_Name,
            street_address_2: shopAddress.Street_Name,
            landmark: shopAddress.Landmark,
            city: shopAddress.City,
            state: shopAddress.State,
            pincode: shopAddress.Pincode.toString(),
            country: "India",
            lat: parseFloat(shopAddress.latitude),
            lng: parseFloat(shopAddress.longitude),
            contact_details: {
              name: userDetails.Username,
              phone_number: userDetails.contact_no.toString(),
            },
          },
        },
      ],
      optimised_route: true,
      drop_details: [
        {
          reference_id:
            orderDataval.iOrder.toString() +
            "0" +
            orderDataval.iOrder.toString(),
          address: {
            apartment_address: customerDetails.Building_No,
            street_address_1: customerDetails.Street_Name,
            street_address_2: customerDetails.Street_Name,
            landmark: customerDetails.Landmark,
            city: customerDetails.City,
            state: customerDetails.State,
            pincode: customerDetails.Pincode.toString(),
            lat: parseFloat(customerDetails.lat),
            lng: parseFloat(customerDetails.lng),
            country: "India",
            contact_details: {
              name: tempCustomer.customerName,
              phone_number: tempCustomer.phone.toString(),
            },
          },
          otp_required: false,
          special_instructions: "Handle with great care",
        },
      ],
    };

    //console.log(dunzoTaskInput);

    await axios
      .post(`${REACT_APP_DUNZO_URL}/mylapay/dunzo/v2Tasks`, dunzoTaskInput)
      .then((response) => {
        if (response.data) {
          console.log(response.data.data.task_id);

          axios
            // .post(`/mylapay/orders/track/update`, jsonDataForOrderTrack)

            .post("/mylapay/orders/update", {
              orderId: orderDataval.iOrder,
              // cancelProducts: sel_iorder,
              productStatus: 3,
            })

            .then((response) => {
              console.log("Order Track Update response");
              // handleDialogShipment(true);

              Swal.fire({
                title: "Success!",
                text: "Your Shipment request initiated successfully.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
                showCancelButton: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  redirection(1);
                }
              });

              // history.push(`/orders`);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => console.log(error));
  };
  const checkServiceability = async () => {
    await axios
      .get(
        `${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/pincode/serviceability?Pincode=${addressdetails.Pincode}`
      )
      .then((response) => {
        if (response.data.success) {
          confirmDelhiveryShipment();
        } else {
          Swal.fire({
            title: "We're Sorry!",
            text: "Customer Location is not servicable! Try with another shipment option.",
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
  const confirmDelhiveryShipment = async () => {
    console.log("confirmDelhiveryShipment calling");
    setoverlay_on(true);
    setprogress_on(true);
    let order_id = orderDataval.iOrder;
    let jsonData = {
      iOrder: order_id,
      imid: userDetails.imid,
    };

    await axios
      .post(
        `${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/create/order`,
        jsonData
      )
      .then((response) => {
        setoverlay_on(false);
        setprogress_on(false);
        if (response.data.data.success) {
          // confirmPickupRequest();

          if (response.data.data.success) {
            axios
              .post("/mylapay/orders/update", {
                orderId: orderDataval.iOrder,
                productStatus: 3,
              })
              .then((response) => {
                // handleDialogShipment(true);
                // setShipmentInitiate(true);
                // setShipmentResponseMessage(
                //   "Your Shipment request initiated successfully."
                // );

                Swal.fire({
                  title: "Success!",
                  text: "Your Shipment request initiated successfully.",
                  icon: "success",
                  confirmButtonText: "OK",
                  confirmButtonColor: "#20295C",
                  showCancelButton: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    redirection(1);
                  }
                });

                // history.push(`/orders`);
              })
              .catch((error) => {
                console.log(error);
              });
            setoverlay_on(false);
            setprogress_on(false);
          } else {
            console.log(response.data.data.packages[0].remarks);
          }
        } else {
          console.log(response.data.data.packages[0].remarks);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmPickupRequest = async () => {
    console.log("confirmPickupRequest calling");

    let jsonData = {
      imid: userDetails.imid,
    };

    await axios
      .post(
        `${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/pickup/request`,
        jsonData
      )
      .then((response) => {
        if (response.data.data.success) {
          axios
            .post("/mylapay/orders/update", {
              orderId: orderDataval.iOrder,
              productStatus: 3,
            })
            .then((response) => {
              // handleDialogShipment(true);
              // setShipmentInitiate(true);
              // setShipmentResponseMessage(
              //   "Your Shipment request initiated successfully."
              // );

              Swal.fire({
                title: "Success!",
                text: "Your Shipment request initiated successfully.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
                showCancelButton: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  redirection(1);
                }
              });

              // history.push(`/orders`);
            })
            .catch((error) => {
              console.log(error);
            });
          setoverlay_on(false);
          setprogress_on(false);
        } else {
          console.log(response.data.data.packages[0].remarks);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const confirmShipment = async () => {
    console.log("confirm shipment calling");
    setoverlay_on(true);
    setprogress_on(true);
    // Create custom order
    let order_id = orderDataval.iOrder;
    let order_date = orderDataval.orderDate;
    let billing_customer_name = userDetails.Username;
    //let billing_address = `${userDetails.Door_Number},${userDetails.Street_Name},${userDetails.Landmark}`;
    let billing_address = `${shopAddress.Building_No},${shopAddress.Street_Name},${shopAddress.Landmark}`;

    let billing_city = shopAddress.City;
    let billing_pincode = shopAddress.Pincode;
    let billing_state = shopAddress.State;
    let billing_country = "India";
    //let billing_email = userDetails.contact_email;
    let billing_email = userDetails.Login_Email;
    let billing_phone = userDetails.contact_no;

    let shipping_is_billing = false; // By Default

    let customerDetails = orderDeliveryDetails;
    let tempCustomer = addressdetails;

    let shipping_customer_name = tempCustomer.customerName;
    let shipping_address = `${customerDetails.Building_No},${customerDetails.Street_Name},${customerDetails.Landmark}`;
    let shipping_city = customerDetails.City;
    let shipping_pincode = customerDetails.Pincode.toString();
    let shipping_state = customerDetails.State;
    let shipping_country = "India";
    let shipping_email = shipingCustomerInfo.email;
    let shipping_phone = tempCustomer.phone;

    let productDetails = orderDataval.productDetails;
    let order_items = [];

    for (let i = 0; i < productDetails.length; i++) {
      let name = productDetails[i].item;
      //let sku = productDetails[i].iProduct;
      let sku = i + 1; // testing
      let units = productDetails[i].quantity;
      let selling_price = productDetails[i].price;
      order_items.push({
        name: name,
        sku: sku,
        units: units,
        selling_price: selling_price,
      });
    }

    // console.log(order_items);
    // console.log(order_id);

    let payment_method = "Prepaid"; // By Default
    let sub_total = orderDataval.totalAmount; //
    //let length = length;
    //let breadth = breadth;
    //let height = height;
    //let weight = weight; // in kgs. must be more than 0.
    let courier_company_id = selectedCourier.courier_company_id;
    let courier_company_name = selectedCourier.courier_name;
    let etd = selectedCourier.etd;
    let rate = selectedCourier.rate;

    let jsonData = {
      order_id: order_id,
      order_date: order_date,
      courier_company_id: courier_company_id,
      courier_company_name: courier_company_name,
      etd: etd,
      rate: rate,
      //pickup_location: userDetails.imid.toString(),
      pickup_location: shopAddress.pickup_location,
      billing_customer_name: billing_customer_name,
      billing_last_name: "Mylapay", // Hardcoded for testing
      billing_address: billing_address,
      //"billing_address_2": "9th, cross street,Anakaputhur",
      billing_city: billing_city,
      billing_pincode: billing_pincode,
      billing_state: billing_state,
      billing_country: billing_country,
      billing_email: billing_email,
      billing_phone: billing_phone,
      shipping_is_billing: shipping_is_billing,
      shipping_customer_name: shipping_customer_name,
      shipping_address: shipping_address,
      //"shipping_address_2": "7th cross street,Anakaputhur",
      shipping_city: shipping_city,
      shipping_pincode: shipping_pincode,
      shipping_state: shipping_state,
      shipping_country: shipping_country,
      shipping_email: shipping_email,
      shipping_phone: shipping_phone,
      order_items: order_items,
      payment_method: payment_method,
      sub_total: sub_total,
      length: length,
      breadth: breadth,
      height: height,
      weight: weight,
      courier_company_id: courier_company_id,
      etd: etd,
      rate: rate,
    };

    // console.log(jsonData);

    await axios
      .post(
        `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/create/custom_order`,
        jsonData
      )
      .then((response) => {
        // console.log("custom order response");
        // console.log(response.data);

        if (response.data.data && response.data.data.shipment_id) {
          // Call generate AWB. using shipment_id from response and courier_company_id selected
          let jsonDataForAWB = {
            shipment_id: response.data.data.shipment_id,
            courier_id: courier_company_id,
            courier_company_name: courier_company_name,
            order_id: orderDataval.iOrder,
            shippment_order_id: response.data.data.shippment_order_id,
          };
          let shipment_id = response.data.data.shipment_id;
          axios
            .post(
              `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/awb`,
              jsonDataForAWB
            )
            .then((awbresponse) => {
              // console.log("custom order response");
              // console.log(awbresponse.data);

              if (awbresponse.data.data && awbresponse.data.data.awb_code) {
                // Call API request for shipment pickup
                // awb_code - "14326321483064" for shipment id 137910308 and courier id 24

                setawbcode(awbresponse.data.data.awb_code);

                let jsonDataForPickup = {
                  shipment_id: [shipment_id],
                };
                axios
                  .post(
                    `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/pickup`,
                    jsonDataForPickup
                  )
                  .then((pickupresponse) => {
                    // console.log("Generate pickup pickupresponse");
                    // console.log(pickupresponse.data);

                    // if (
                    //   pickupresponse.data.data &&
                    //   pickupresponse.data.data.pickup_status
                    // ) {

                    if (pickupresponse.data.success) {
                      // Pickup generate done. Next need to track using AWB code
                      // Move Order from Pending to In-Transit bucket. Update Order Track
                      // let jsonDataForOrderTrack = {
                      //   iOrder: orderDataval.iOrder,
                      //   orderTrackStatus: 3 // 1 - Pending, 2 - In-Transit, 3 - closed
                      // }
                      // axios
                      // .post(`/mylapay/orders/track/update`,jsonDataForOrderTrack)
                      // .then((ordertrackresponse) => {
                      //   console.log("Order Track Update response");
                      //   console.log(ordertrackresponse);
                      //   console.log(ordertrackresponse.data);
                      //   handleDialogShipment(true);

                      // })
                      // .catch((error) => {
                      //   console.log(error);
                      // });

                      axios
                        // .post(`/mylapay/orders/track/update`, jsonDataForOrderTrack)

                        .post("/mylapay/orders/update", {
                          orderId: orderDataval.iOrder,
                          // cancelProducts: sel_iorder,
                          productStatus: 3,
                        })

                        .then((response) => {
                          //console.log("Order Track Update response");
                          // handleDialogShipment(true);
                          // setShipmentInitiate(true);
                          // setShipmentResponseMessage(
                          //   "Your Shipment request initiated successfully."
                          // );

                          Swal.fire({
                            title: "Success!",
                            text: "Your Shipment request initiated successfully.",
                            icon: "success",
                            confirmButtonText: "OK",
                            confirmButtonColor: "#20295C",
                            showCancelButton: false,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              redirection(1);
                            }
                          });

                          // history.push(`/orders`);
                        })
                        .catch((error) => {
                          console.log(error);
                        });

                      setoverlay_on(false);
                      setprogress_on(false);
                    } else {
                      setShipmentInitiate(false);
                      if (
                        pickupresponse.data.data.response
                          .message_to_check_for_nsz
                      ) {
                        setShipmentResponseMessage(
                          pickupresponse.data.data.response
                            .message_to_check_for_nsz
                        );
                      } else {
                        setShipmentResponseMessage("Something went wrong!");
                      }
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);

              if (response.data.data.awb_code) {
                // setdialogOpenalreadyShipment(true);
                setawbcode(response.data.data.awb_code);

                Swal.fire({
                  title: response.data.data.awb_code,
                  text: "Your Shipment request already initiated.",
                  icon: "success",
                  confirmButtonText: "OK",
                  confirmButtonColor: "#20295C",
                  showCancelButton: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    redirection(1);
                  }
                });

                setoverlay_on(false);
                setprogress_on(false);
              } else {
              }
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInput = async (values) => {
    setCourierListOn(true);
    setoverlay_on(true);
    setprogress_on(true);

    setLength(parseInt(values.length));
    setBreadth(parseInt(values.breadth));
    setHeight(parseInt(values.height));
    setWeight(parseFloat(values.weight) / 1000);
    //setoverlay_on(true);
    //setprogress_on(true);

    //setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 25));
    let customerDetails = orderDeliveryDetails;
    let delivery_postcode = customerDetails.Pincode;
    //if delhivery selected
    if (selectedCourierValue == 2) {
      await axios
        .get(
          `${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/invoice?originPincode=${shopAddress.Pincode}&destinationPincode=${delivery_postcode}&shipmentStatus=Delivered&weight=${values.weight}&paymentType=COD`
        )
        .then((response) => {
          setoverlay_on(false);
          setprogress_on(false);
          if (response.data.success) {
            response.data.data[0].courier_name = "Delhivery";
            console.log(response.data.data[0]);
            setData(response.data.data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      let jsonData = {
        //pickup_postcode: parseInt(pickup_postcode),
        pickup_postcode: shopAddress.Pincode,
        delivery_postcode: parseInt(delivery_postcode),
        cod: 0,
        weight: values.weight,
        length: parseInt(values.length),
        breadth: parseInt(values.breadth),
        height: parseInt(values.height),
        declared_value: orderTotalAmount,
        mode: "surface",
      };
      console.log("pickup_postcode:", shopAddress.Pincode);
      console.log("delivery_postcode:", parseInt(delivery_postcode));
      axios
        .post(
          `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/profitability/calculator`,
          jsonData
        )
        .then((response) => {
          //setProgress((prevProgress) => (80));
          setoverlay_on(false);
          setprogress_on(false);
          console.log(response);
          console.log(response.data.data.message);
          if (response.data.data.message) {
            //setprogress_on(false);
            //setServiceErrorMsg(response.data.data.message);
            handleOpen();
          } else {
            let courier_companies_list =
              response.data.data.data.available_courier_companies;
            courier_companies_list.sort((a, b) =>
              a.rate > b.rate ? 1 : b.rate > a.rate ? -1 : 0
            );
            // console.log(courier_companies_list);
            setData(courier_companies_list);
            // courier_company_id
            // courier_name
            // rate
            // etd
            // console.log(
            //   response.data.data.data.available_courier_companies[0].rate
            // );
            let shipmentCharges =
              response.data.data.data.available_courier_companies[0].rate;

            if (response.data.success === 1) {
              // console.log(
              //   response.data.data.data.available_courier_companies[0].rate
              // );
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
  };

  const shiprocketColumns = [
    {
      name: "courier_company_id",
      label: "Courier Company ID",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "courier_name",
      label: "Courier Name",
      options: {
        sort: true,
      },
    },
    {
      name: "rate",
      label: "Shipment Charges",
      options: {
        sort: true,
      },
    },
    {
      name: "etd",
      label: "Estimated Delivery Date",
      options: {
        sort: true,
      },
    },
    // {
    //   name: "User Action",
    //   label: "User Action",
    //   options: {
    //     sort: false,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return <UserAction value={value} />;
    //     },
    //   },
    // },
  ];
  const delhiveryColumns = [
    {
      name: "courier_name",
      label: "Courier Name",
      options: {
        sort: true,
      },
    },
    {
      name: "total_amount",
      label: "Shipment Charges",
      options: {
        sort: true,
      },
    },
    {
      name: "charged_weight",
      label: "Weight",
      options: {
        sort: true,
      },
    },
  ];

  const onRowSelectionChange = (
    currentRowsSelected,
    allRowsSelected,
    rowsSelected
  ) => {
    // console.log(currentRowsSelected);
    // console.log(rowsSelected);
    if (rowsSelected.length > 0) {
      let index = currentRowsSelected[0].index;
      let courierList = [...data];
      let temp = courierList[index];
      // console.log("selectedCourier");
      // console.log(temp);
      setSelectedCourier(temp);
    } else {
      // Reset courier
      setSelectedCourier([]);
    }
  };
  const onRowClick = (rowData, rowState) => {
    console.log(rowData);
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: "single",
    //disableToolbarSelect: true, // Depricated
    selectToolbarPlacement: "none", // Updated
    onRowSelectionChange: onRowSelectionChange,
    //onRowClick: onRowClick,
    customToolbar: () => {
      return (
        // <Button
        //   type="button"
        //   variant="contained"
        //   color="primary"
        //   endIcon={<ArrowForward />}
        //   style={{ order: -1}}
        //   onClick={() => {
        //     confirmShipmentPreCheck();
        //   }}
        // >
        //   Confirm Shipment
        // </Button>
        null
      );
    },
    //customToolbarSelect: customSelect,
    //onRowClick: handleRowClick,
    tableBodyMaxHeight: "calc(100vh - 220px)",
    // textLabels: {
    //   toolbar: {
    //     downloadCsv: "Export to excel",
    //   },
    // },
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
    button: {
      display: "block",
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 180,
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    const getDeliveryList = async () => {
      await axios
        .get("/mylapay/shop/delivery_charge_range")
        .then((res) => {
          // console.log("Delivery Charge : " + JSON.stringify(res));
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getDeliveryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getDeliveryType = async () => {
      await axios
        .get(
          `/mylapay/auth_customer/get/delivery-type?order_id=${orderDataval.iOrder}`
        )
        .then((res) => {
          //console.log(res);

          setDeliveryType(res.data.data[0].iDelivery_Type);
          // setDeliveryType(4);

          //console.log(res.data.data[0].iDelivery_Type);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getDeliveryType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      delivery_person_name: "",
      delivery_person_phone: "",
    },
    // initialValues: shipmentDetails || {
    //   delivery_person_name: "",
    //   delivery_person_phone: ""
    // },
    onSubmit: (values) => {
      // dispatch(setShipDetails(values));
      // stepChange(2);
    },
  });

  let handleDeliveryNameChange = (e) => {
    // console.log(e.target.value);
    formik.setFieldValue("delivery_person_name", e.target.value);
  };
  let handleDeliveryPhoneChange = (e) => {
    // console.log(e.target.value);
    if (e.target.value.length <= 10 && e.target.value >= 0) {
      formik.setFieldValue("delivery_person_phone", e.target.value);
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={0} style={{ display: "flex" }}>
          <Grid container spacing={2} style={{ paddingLeft: "40px" }}>
            <Grid item xs={8}>
              {deliveryType === 2 ? (
                <Grid container spacing={2}>
                  <Grid item xs={1} md={1}>
                    <IconButton>
                      <OutdoorGrill style={{ fontSize: "50px" }} />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} md={1}></Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      type="text"
                      size="small"
                      style={{ marginTop: "15px" }}
                      value="Self pickup from store"
                      label="Delivery Type"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      // endIcon={<ArrowForward />}
                      // onClick={() => {
                      //   nextStep();
                      // }}
                      style={{ marginTop: "15px" }}
                      onClick={() => {
                        confirmselfpickup();
                      }}
                    >
                      Confirm Shipment
                    </Button>
                  </Grid>
                </Grid>
              ) : null}

              {deliveryType === 3 ? (
                <Grid container spacing={2}>
                  <Grid item xs={1} md={1}>
                    <IconButton>
                      <OutdoorGrill style={{ fontSize: "50px" }} />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} md={1}></Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      type="text"
                      size="small"
                      style={{ marginTop: "15px" }}
                      value="Dunzo"
                      label="Delivery Type"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      // endIcon={<ArrowForward />}
                      // onClick={() => {
                      //   nextStep();
                      // }}
                      style={{ marginTop: "15px" }}
                      onClick={() => {
                        confirmdunzopickup();
                      }}
                    >
                      Confirm Shipment
                    </Button>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>

            {deliveryType === 1 ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={1} md={1}>
                    <IconButton>
                      <OutdoorGrill style={{ fontSize: "50px" }} />
                    </IconButton>
                  </Grid>
                  {/* <Grid item xs={1} md={1}>
                  </Grid> */}
                  <Grid item xs={4} md={4} style={{ display: "flex" }}>
                    <Box mb={4}>
                      <SelectSearch
                        value={selectedValue}
                        onChange={handleChange}
                        style={{ maxWidth: "100px", marginTop: "15px" }}
                        options={[
                          { value: 0, name: "Select" },
                          { value: 1, name: "Courier Shipment" },
                          { value: 2, name: "Door Delivery" },
                        ]}
                        placeholder="Choose courier Option"
                      />
                    </Box>
                  </Grid>

                  {selectedValue == "1" ? (
                    <>
                      <Grid item xs={7} md={7}></Grid>
                      <Grid item xs={1} md={1}>
                        <IconButton>
                          <LocalShipping style={{ fontSize: "50px" }} />
                        </IconButton>
                      </Grid>
                      <Grid item xs={4} md={4}>
                        <Box mb={4}>
                          <SelectSearch
                            value={selectedCourierValue}
                            onChange={handleCourierChange}
                            options={
                              shopAddress && shopAddress.delhivery_registered
                                ? [
                                    { value: 0, name: "None" },
                                    { value: 1, name: "Shiprocket" },
                                    { value: 2, name: "Delhivery" },
                                  ]
                                : [
                                    { value: 0, name: "None" },
                                    { value: 1, name: "Shiprocket" },
                                  ]
                            }
                            placeholder="Choose Courier"
                          />
                        </Box>
                      </Grid>
                    </>
                  ) : null}

                  <Grid
                    item
                    xs={6}
                    style={{ marginTop: "-100px", display: "flex" }}
                  >
                    <Box mb={4} ml={4} style={{ marginTop: "15px" }}>
                      {(selectedCourierValue === 1 ||
                        selectedCourierValue === 2) &&
                      selectedValue === 1 ? (
                        <>
                          <CheckApproxPriceInline handleInput={handleInput} />
                        </>
                      ) : null}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={4} md={4}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      // endIcon={<ArrowForward />}
                      // onClick={() => {
                      //   nextStep();
                      // }}
                      style={{ marginTop: "15px" }}
                      onClick={() => {
                        confirmdunzopickup();
                      }}
                    >
                      Confirm Shipment
                    </Button>
                  </Grid> */}

                  {selectedValue == "2" ? (
                    <>
                      <Grid item xs={1} md={1}></Grid>
                      <Grid item xs={1} md={1}>
                        <IconButton>
                          <LocalShipping style={{ fontSize: "50px" }} />
                        </IconButton>
                      </Grid>
                      {/* <Grid item xs={1} md={1}>
                      </Grid> */}

                      <Grid item xs={4} md={4}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          type="text"
                          size="small"
                          style={{ marginTop: "15px" }}
                          value={formik.values.delivery_person_name}
                          label="Delivery Person Name"
                          onChange={handleDeliveryNameChange}
                          error={
                            formik.touched.delivery_person_name &&
                            Boolean(formik.errors.delivery_person_name)
                          }
                          helperText={
                            formik.touched.delivery_person_name &&
                            formik.errors.delivery_person_name
                          }
                        />
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          type="number"
                          size="small"
                          style={{ marginTop: "15px" }}
                          value={formik.values.delivery_person_phone}
                          label="Delivery Person Mobile"
                          onChange={handleDeliveryPhoneChange}
                          error={
                            formik.touched.delivery_person_phone &&
                            Boolean(formik.errors.delivery_person_phone)
                          }
                          helperText={
                            formik.touched.delivery_person_phone &&
                            formik.errors.delivery_person_phone
                          }
                        />
                      </Grid>

                      <Grid item xs={3} md={3}></Grid>
                      <Grid item xs={1} md={1}></Grid>

                      <Grid item xs={4} md={4}>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          // endIcon={<ArrowForward />}
                          // onClick={() => {
                          //   nextStep();
                          // }}
                          style={{ marginTop: "15px" }}
                          onClick={() => {
                            confirmdoordelivery();
                          }}
                          disabled={
                            selectedValue === 2 &&
                            (formik.values.delivery_person_name === "" ||
                              formik.values.delivery_person_phone.length < 10)
                              ? true
                              : false
                          }
                        >
                          Confirm Shipment
                        </Button>
                      </Grid>
                    </>
                  ) : null}

                  {/* {selectedValue == "1" ? (
                    <>

                      <Grid item xs={6}>
                        <Box mb={4} ml={4} style={{ marginTop: "15px" }}>
                          {selectedCourierValue === 1 && selectedValue === 1 ? (
                            <>
                              <CheckApproxPriceInline handleInput={handleInput} />
                            </>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={1} md={1}>
                        <IconButton>
                          <OutdoorGrill style={{fontSize:"50px"}}/>
                        </IconButton>
                      </Grid>
                      <Grid item xs={1} md={1}>
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <SelectSearch
                          value={selectedCourierValue}
                          onChange={handleCourierChange}
                          options={[
                            { value: 0, name: "None" },
                            { value: 1, name: "Shiprocket" },
                          ]}
                          placeholder="Choose Courier"
                        />
                      </Grid>
                    </>

                  ) : null} */}

                  {/* <Grid item xs={8} md={6}>
                  </Grid> */}
                </Grid>
              </>
            ) : null}

            <div
              className={`overlay ${overlay_on ? "overlay_on" : "overlay_off"}`}
            ></div>
            {/* {selectedCourierValue === 1 && selectedValue === 1 ? (
              <>
                <CheckApproxPriceInline handleInput={handleInput} />
              </>
            ) : null} */}

            <div
              className={`profitability_progress ${
                progress_on_fullpage ? "progress_on" : "progress_off"
              }`}
            >
              <CircularProgress
                variant="indeterminate"
                disableShrink
                className={classesFacebook.top}
                classes={{
                  circle: classesFacebook.circle,
                }}
                size={40}
                thickness={4}
              />
            </div>

            <Grid item xs={7} md={7} style={{ padding: "0px" }}>
              {(selectedCourierValue === 1 || selectedCourierValue === 2) &&
              selectedValue === 1 &&
              courierListOn === true ? (
                <>
                  <Box
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      borderBottom: "0px",
                      borderRadius: "4px",
                      position: "relative",
                    }}
                  >
                    <div
                      className={`profitability_progress_courier_list ${
                        progress_on ? "progress_on" : "progress_off"
                      }`}
                    >
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        className={classesFacebook.top}
                        classes={{
                          circle: classesFacebook.circle,
                        }}
                        size={40}
                        thickness={4}
                      />
                    </div>
                    <MUIDataTable
                      className="transanctions-table"
                      response="scrollFullHeight"
                      title={"Couriers Companies"}
                      data={data}
                      columns={
                        selectedCourierValue == 2
                          ? delhiveryColumns
                          : shiprocketColumns
                      }
                      options={options}
                    />
                  </Box>
                </>
              ) : null}
            </Grid>

            <Grid item xs={3} md={3}>
              {(selectedCourierValue === 1 || selectedCourierValue === 2) &&
              selectedValue === 1 &&
              courierListOn === true ? (
                <>
                  <Box m={2} mb={2}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      //endIcon={<ArrowForward />}

                      disabled={selectedValue === 1 ? false : true}
                      onClick={() => {
                        shiprocketshipment();
                      }}
                    >
                      Confirm Shipment
                    </Button>
                  </Box>

                  <Box m={2} mb={2}>
                    {/* <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      //endIcon={<ArrowForward />}
                      onClick={() => {
                        generateManifest();
                      }}
                    >
                      Generate Manifest
                    </Button> */}

                    <Tooltip title="Click here to Download Manifest">
                      <IconButton
                        style={{
                          backgroundColor: "antiquewhite",
                          padding: "5px",
                        }}
                        onClick={() => {
                          generateManifest();
                        }}
                      >
                        <ArrowDownwardOutlined />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Click here to Download Label">
                      <IconButton
                        style={{
                          backgroundColor: "lightgray",
                          padding: "5px",
                          marginLeft: "5px",
                        }}
                        onClick={() => {
                          generateLabel();
                        }}
                      >
                        <Label />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* <Box m={2} mb={2}>
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
                    </Box> */}
                </>
              ) : null}
            </Grid>

            {/* </Grid> */}
          </Grid>
          <Grid>
            <Typography>
              <img
                style={{
                  cursor: "pointer",
                  marginRight: "30px",
                  marginBottom: "-15px",
                  marginTop: "5px",
                }}
                onClick={() => {
                  setviewcustomer(true);
                }}
                src="/images/customer.png"
                title="View Customer Details"
                height="50px"
                width="auto"
              />
            </Typography>
            <Typography
              component={Link}
              onClick={() => {
                setviewcustomer(true);
              }}
              style={{
                fontSize: "10px",
                marginLeft: "-25px",
                cursor: "pointer",
              }}
            >
              View Customer Details
            </Typography>
          </Grid>
        </Paper>

        {/* <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => {
              stepChange(0);
            }}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            disabled={
              selectedValue === 2 &&
              (formik.values.delivery_person_name === "" ||
                formik.values.delivery_person_phone.length < 10)
                ? true
                : false
            }
            onClick={() => {
              confirmShipmentPreCheck();
            }}
          >
            Confirm Shipment
          </Button>
        </Box> */}

        {/* <Box mt={2} display="flex" justifyContent="flex-end">

          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => {
              stepChange(0);
            }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
          >
            Next
          </Button>
        </Box> */}
      </form>

      <Dialog
        style={{ width: "500px", margin: "auto" }}
        open={orderReadyForPickup}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogCloseReadyForPickup}
      >
        <DialogTitle id="id">Shipment Confirmation</DialogTitle>

        <DialogContent>Please select order ready for pickup</DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogCloseReadyForPickup}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ width: "500px", margin: "auto" }}
        open={alreadyInitiatedShipDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogalreadyInitiatedShipDialog}
      >
        <DialogTitle id="id">Initiated Already</DialogTitle>

        <DialogContent>
          Shipment is already initiated for this order
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogalreadyInitiatedShipDialog}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ width: "500px", margin: "auto" }}
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
      >
        <DialogTitle id="id">Shipment Alert</DialogTitle>

        <DialogContent>
          Please select courier company before confirm shipment
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ width: "500px", margin: "auto" }}
        open={dialogOpenShipment}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogCloseShipment}
      >
        <DialogTitle id="id">Shipment Confirmation</DialogTitle>

        <DialogContent>
          {shipmentInitiate ? shipmentResponseMessage : shipmentResponseMessage}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpenShipment(false);
              redirection(1);

              // movetodelivery();
            }}
            // to="/orders"
            // onClick={setDialogOpenShipment(false)}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
          <Button onClick={handleDialogCloseShipment} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ width: "500px", margin: "auto" }}
        open={dialogOpenalreadyShipment}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClosealreadyShipment}
      >
        <DialogTitle id="id">Shipment Alert</DialogTitle>

        <DialogContent>Your Shipment request already initiated.</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDialogalreadyShipmentok();
            }}
            // to="/orders"
            // onClick={setDialogOpenShipment(false)}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
          <Button
            onClick={handleDialogClosealreadyShipment}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ width: "500px", margin: "auto" }}
        open={dialogOpendelivery}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogdeliveryclose}
      >
        <DialogTitle id="id">Shipment Alert</DialogTitle>

        <DialogContent>Kindly confirm your shipment</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setdialogOpendelivery(false);
            }}
            // to="/orders"
            // onClick={setDialogOpenShipment(false)}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ width: "60%", margin: "auto" }}
        open={viewcustomer}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleviewcustomerclose}
      >
        <DialogTitle id="id">Customer Details</DialogTitle>

        <DialogContent>
          <Grid container spacing={1} style={{ padding: 20 }}>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>Customer Name: </span>
                    {addressdetails["customerName"]}
                  </label>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>Customer Email: </span>
                    {addressdetails["email"]}
                  </label>
                </Box>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>Customer Phone: </span>
                    {addressdetails["phone"]}
                  </label>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>Building_No:</span>{" "}
                    {addressdetails["Building_No"]}
                  </label>
                </Box>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>Street Name: </span>
                    {addressdetails["Street_Name"]}
                  </label>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>Landmark: </span>
                    {addressdetails["Landmark"]}
                  </label>
                </Box>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>City: </span>
                    {addressdetails["City"]}
                  </label>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}>
                  <label htmlFor="email">
                    <span style={{ fontWeight: "bold" }}>Pincode: </span>
                    {addressdetails["Pincode"]}
                  </label>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setviewcustomer(false);
            }}
            // to="/orders"
            // onClick={setDialogOpenShipment(false)}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
