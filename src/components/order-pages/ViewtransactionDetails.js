import {
  Box,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  IconButton,
  FormControl,
  Container,
  Typography,
  Tooltip,
  Paper,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Avatar,
} from "@material-ui/core";
import {
  Add,
  ArrowBack,
  ArrowForward,
  Close,
  LocalShipping,
  DirectionsWalk,
  PictureAsPdf,
  MenuBook,
  SaveAlt,
  FlightTakeoff,
  CheckCircle,
  LibraryBooks,
  Cancel,
  AddAlert,
  DepartureBoard,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import CheckApproxPrice from "./CheckApproxPrice";
import ReactToPdf from "react-to-pdf";
import MUIDataTable from "mui-datatables";

import TransactionsBreakup from "../../pages/transanctions/breakup";

import queryString from "query-string";
import { useLocation } from "react-router";

import styles from "./css/Edit.module.css";

import Swal from "sweetalert2";

import moment from "moment";

// import debounce from 'lodash.debounce';
import _ from "lodash";

import {
  setProductDetails,
  setShipDetails,
  setDeliveryDetails,
  setPaymentDetails,
} from "../../redux/shipmentPageSlice";

const { REACT_APP_API_URL } = process.env;
const { REACT_APP_SHOPAPI_URL } = process.env;
const { REACT_APP_SHOP_URL } = process.env;
const { REACT_APP_SHIPROCKET_URL } = process.env;

export default function ViewtransactionDetails() {
  const { search } = useLocation();
  const { id, orderStatus, orderId } = queryString.parse(search);

  const [orderDataval, setorderData] = useState();

  console.log("orderData : " + JSON.stringify(orderDataval));

  const [totalcal_amt, settotalcal_amt] = useState(0);

  const ref = React.createRef();

  const productDetails = useSelector(
    (state) => state.shipmentPage.productDetails
  );

  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  /* Datatable columns starts here */

  const [selectionIndexes, setSelectionIndexes] = useState([]);

  const [rowsSelectedval, setrowsSelectedval] = useState([]);

  const [orderorproduct, setorderorproduct] = useState(0);

  const UserManual_click = () => {
    history.push({
      pathname: "/order-user-manual",
    });
  };

  const columns = [
    {
      name: "product_image",
      label: "Products",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta) => {
          if (value != null) {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                src={`${REACT_APP_SHOPAPI_URL}/uploads${value}`}
                onClick={() => {
                  viewproduct(tableMeta);
                }}
              ></Avatar>
            );
          } else {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                src="/images/no-image-icon-23494.png"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
              ></Avatar>
            );
          }
        },
      },
    },
    {
      name: "item",
      label: "Product Name",
      options: {
        sort: true,
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
        // },

        customBodyRender: (value, tableMeta, updateValue) => (
          <a
            className="mp-link"
            href="javascript:void(0)"
            rel="noreferrer"
            onClick={() => {
              viewproduct(tableMeta);
            }}
          >
            {value}
          </a>
        ),
      },
    },
    {
      name: "specs",
      label: "Gender-Size-Colors",
      options: {
        sort: true,
        display:
          orderDataval &&
          (orderDataval.Template_Url === "apparel" ? true : false),
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        sort: true,
      },
    },
    {
      name: "iProduct",
      label: "ProductID",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "iProductcategory",
      label: "CategoryID",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "quantity",
      label: "Quantity",
      options: {
        sort: true,
      },
    },
    {
      name: "itemTotal_amount",
      label: "Total",
      options: {
        sort: true,
      },
    },
    {
      name: "Reason_For_Cancel",
      label: "Cancel Reason",
      options: {
        sort: true,
        display: orderStatus && (orderStatus != 4 ? true : false),
      },
    },
    {
      name: "Comment",
      label: "Customer Comments",
      options: {
        sort: true,
        display: orderStatus && (orderStatus == 4 ? true : false),
      },
    },
  ];

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: false,
    viewColumns: false,
    print: false,
    searchable: false,
    rowsSelected: rowsSelectedval,
    elevation: 0,
    selectableRows: false,
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
    },
  };

  /* Datatable columns ends here */

  /* Select Dropdown starts here */

  const [selectedValue, setselectedValue] = React.useState("");

  const [pickupvalue, setpickupvalue] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleChange = (event) => {
    setselectedValue(event.target.value);

    console.log(event.target.value);
  };

  const handleChangechk = (event) => {
    setpickupvalue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const redirection = (n) => {
    localStorage.setItem("redirectid", n);
    history.push(`/orders`);
  };

  const viewproduct = (value) => {
    // dispatch(setPaymentDetails(inputArray));
    // stepChange(3);

    console.log(
      "Order products list : " + JSON.stringify(orderDataval["url_name"])
    );

    window.open(
      `${REACT_APP_SHOP_URL}/${orderDataval["url_name"]}/${orderDataval["Template_Url"]}/${value["rowData"][5]}/${value["rowData"][4]}`,
      "_blank"
    );

    // history.push(`${REACT_APP_SHOP_URL}/${value['rowData'][3]}/${value['rowData'][4]}`);
  };

  const gotoorders = () => {
    // dispatch(setPaymentDetails(inputArray));
    // stepChange(3);

    history.push(`/orders`);
  };

  const verifyotp = () => {
    console.log("verify otp");

    Swal.fire({
      title: "Verify OTP",
      text: "",
      input: "number",
      customClass: {
        popup: "format-pre",
      },
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        let jsonDataForOrderTrack = {
          order_id: orderDataval.iOrder,
          otp: parseInt(result.value),
        };
        axios

          .post(
            `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/door-delivery/otp-verification`,
            jsonDataForOrderTrack
          )

          // .post(`/mylapay/orders/track/update`,jsonDataForOrderTrack)
          .then((ordertrackresponse) => {
            console.log("Order Track Update response");
            console.log(ordertrackresponse);
            console.log(ordertrackresponse.data);

            if (
              ordertrackresponse.data.message ===
              "Please Enter correct OTP to verify"
            ) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please Enter correct OTP to verify!",
              });
            } else {
              Swal.fire({
                title: "Success!",
                text: "Order Accepted!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
              });

              let jsonDataForOrderTrack = {
                iOrder: orderDataval.iOrder,
                orderTrackStatus: 4, // 1 - Pending, 2 - In-Transit, 3 - closed
              };
              axios
                .post(`/mylapay/orders/track/update`, jsonDataForOrderTrack)
                .then((ordertrackresponse) => {
                  console.log("Order Track Update response");
                  console.log(ordertrackresponse);
                  console.log(ordertrackresponse.data);

                  history.push(`/orders`);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const handleDialogClose = (value) => {
    handleDialog(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  /* Select Dropdown ends here */

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  const handleInput = (newItem) => {};

  const deleteproduct = (index) => {
    let data = orderDataval.productDetails;
    console.log(JSON.stringify(data));
    data.splice(index, 1);
    // setorderData(data)
    setorderData({ ...orderDataval, productDetails: data });
    calTotalamount();
  };

  const calTotalamount = () => {
    let countval = 0;

    console.log("Order data : " + JSON.stringify(orderDataval));

    if (orderDataval.productDetails) {
      orderDataval.productDetails.filter((item, index) => {
        countval = countval + item.itemTotal_amount;
        settotalcal_amt(countval);
      });
    } else {
      settotalcal_amt(0);
    }
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

  const getData = async () => {
    await axios
      // .post(`mylapay/transaction/get/transactions/order-detail`, jsonDataForOrderTrack)
      .get(`mylapay/transaction/get/transactions/order-detail?iOrder=${id}`)

      // https://shopapi.mylapay.com/mylapay/transaction/get/transactions/order-detail
      .then((res) => {
        if (res.data.status === 1) {
          if (res.data.message.length === 0) return;
          // let temp = res.data.message.find(
          //   (item) => item.iOrder === parseInt(id)
          // );
          setorderData(res.data.message[0]);
          // calTotalamount();
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: shipmentDetails || {

    // },
    onSubmit: (values) => {
      // dispatch(setProductDetails(values));
      // stepChange(1);
    },
  });

  return (
    <>
      <Box my={3} className={styles.stepWrapredirect}>
        <div className={styles.redirectactions} onClick={() => redirection(0)}>
          <div className={styles.redirectactionsicon}>
            <AddAlert />
          </div>
          New orders
        </div>

        <div className={styles.redirectactions} onClick={() => redirection(1)}>
          <div className={styles.redirectactionsicon}>
            <DepartureBoard />
          </div>
          Accepted Orders
        </div>
        <div className={styles.redirectactions} onClick={() => redirection(2)}>
          <div className={styles.redirectactionsicon}>
            <FlightTakeoff />
          </div>
          Transit
        </div>
        <div className={styles.redirectactions} onClick={() => redirection(3)}>
          <div className={styles.redirectactionsicon}>
            <CheckCircle />
          </div>
          Closed
        </div>
        <div className={styles.redirectactions} onClick={() => redirection(4)}>
          <div className={styles.redirectactionsicon}>
            <Cancel />
          </div>
          Cancelled
        </div>

        <div className={styles.redirectactions} onClick={() => redirection(5)}>
          <div className={styles.redirectactionsicon}>
            <LibraryBooks />
          </div>
          All orders
        </div>

        <div className={styles.redirectactions_usermanual}>
          <Tooltip title="User Manual">
            <IconButton
              onClick={() => {
                UserManual_click();
              }}
              style={{ color: "white" }}
            >
              <MenuBook />
            </IconButton>
          </Tooltip>
        </div>
      </Box>
      <TransactionsBreakup orderId={orderId} />
    </>
  );
}
