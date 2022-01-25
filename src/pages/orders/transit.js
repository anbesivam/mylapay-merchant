import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  TableCell,
  Button,
  Tooltip,
  Chip,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import UserAction from "../../components/transanctions/UserAction";
import { useHistory } from "react-router";
import { ArrowDownwardOutlined, Label } from "@material-ui/icons";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import ReactDOM from "react-dom";
import PackingSlip from "../../components/order-pages/PackingSlip";

export default function Transit() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const userDetails = useSelector((state) => state.auth.userDetails);

  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());

  const [buttonclick, setbuttonclick] = useState(0);

  const [rowsSelectedval, setrowsSelectedval] = useState([]);
  const [selecteddelivery, setselecteddelivery] = useState("");
  const [currentRowsSelected, setcurrentrowsSelectedval] = useState([]);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");

  const { REACT_APP_SHIPROCKET_URL, REACT_APP_DELHIVERY_URL } = process.env;

  const [awbcode, setawbcode] = useState("");
  const [dunzocode, setdunzocode] = useState("");
  const [dunzoresponse, setdunzoresponse] = useState("");

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dunzodialogOpen, setDunzoDialogOpen] = React.useState(false);
  const [dialogOpentrack, setDialogtrackOpen] = React.useState(false);
  const [reasonPopup, setReasonPopup] = useState(false);
  const [packingSlipDialog, setPackingSlipDialog] = useState(false);
  const [packingSlipData, setPackingSlipData] = useState();
  const [orderData, setOrderData] = useState();
  const [orderTotal, setOrderTotal] = useState(0);
  const [cancelType, setCancelType] = useState();

  const history = useHistory();

  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(
      "https://www.dunzo.com/tracking/69c9c8cca3689a72a8935fa45f3baa65c16c",
      {
        headers: { "content-security-policy": "frame-ancestors 'self'" },
      }
    )
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((err) => err);
  }, []);

  const columns = [
    {
      name: "orderId",
      label: "Order ID",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <Tooltip title="Click here to view Order">
                <a
                  onClick={() => {
                    handleOrderView(tableMeta.rowData[3]);
                  }}
                >
                  <MyBadge type="button" badgeText={value} />
                </a>
              </Tooltip>
            </>
          );
        },
      },
    },
    {
      name: "Order_Time",
      label: "Order Time",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm A");
        },
      },
    },
    {
      name: "orderTotal",
      label: "Amount",
      options: {
        sort: true,
      },
    },
    {
      name: "iOrder",
      label: "Cust Ref ID",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "customerName",
      label: "Customer Name",
      options: {
        sort: true,
      },
    },
    {
      name: "iDelivery_Type",
      label: "Delivery Type",
      options: {
        sort: false,
        display: false,
      },
    },
    {
      name: "awb_code_status",
      label: "Awb Status",
      options: {
        sort: false,
        display: false,
      },
    },
    {
      name: "awb_code",
      label: "Track Order",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log(tableMeta.rowData[5]);
          if (tableMeta.rowData[11] !== null) {
            return (
              <Tooltip title="Click here to Track Order">
                <Chip
                  label="Delhivery"
                  clickable
                  onClick={() => {
                    setbuttonclick(1);
                    trackDelhiveryOrder(tableMeta.rowData[11]);
                  }}
                  style={{
                    backgroundColor: "#3ec312",
                    // backgroundImage: "linear-gradient(136deg, rgb(41 209 54) 0%, rgb(52 155 51) 50%, rgb(62 195 18) 100%)",
                    color: "#fff",
                    borderRadius: "0",
                  }}
                />
              </Tooltip>
            );
          } else if (value != null && tableMeta.rowData[6]) {
            return (
              <>
                <Tooltip title="Click here to Track Order">
                  <a
                    onClick={() => {
                      setbuttonclick(1);
                      trackorder(value, tableMeta.rowData[3]);
                    }}
                  >
                    {/* <MyBadge  
                    type="button"
                    
                    badgeText={value} /> */}

                    <span style={{ color: "#3ec312" }}>Shiprocket</span>
                  </a>
                </Tooltip>

                {/* <Tooltip title="Click here to Track Order">
                  <Chip
                    label="Shiprocket"
                    clickable
                    onClick={() => {
                      setbuttonclick(1);
                      trackorder(value, tableMeta.rowData[3]);
                    }}
                    style={{
                      // backgroundColor: "#3ec312",
                      // backgroundImage: "linear-gradient(136deg, rgb(41 209 54) 0%, rgb(52 155 51) 50%, rgb(62 195 18) 100%)",
                      color: "#3ec312",
                      borderRadius: "0",
                    }}
                  />
                </Tooltip> */}

                {/* <Button
                  // color="primary"
                  variant="text"
                  style={{
                    // backgroundColor: "#2caee4",
                    marginRight: "5px",
                    color: "#4caf50",
                    textDecorationLine: 'underline'
                  }}
                  onClick={() => {
                    setbuttonclick(1);
                    trackorder(value, tableMeta.rowData[3]);
                  }}
                >
                  {value}
                </Button> */}
              </>
            );
          } else if (tableMeta.rowData[5] === 2) {
            return (
              // <Tooltip title="Click here to Tracck Order">

              //   <a
              //     onClick={() => {
              //       setbuttonclick(1);
              //       trackview(tableMeta.rowData[3]);
              //     }}
              //   >
              //     <MyBadge
              //     type="button"

              //     badgeText="Self-pick from store" />

              //   </a>

              //   </Tooltip>

              <Tooltip title="Click here to Track Order">
                <a
                  onClick={() => {
                    setbuttonclick(1);
                    trackview(tableMeta.rowData[3]);
                  }}
                >
                  {/* <MyBadge  
                  type="button"
                  
                  badgeText={value} /> */}

                  <span style={{ color: "#3a84d0" }}>Self-pick from store</span>
                </a>
              </Tooltip>

              // <Tooltip title="Click here to Track Order">
              //   <Chip
              //     label="Self-pick from store"
              //     clickable
              //     onClick={() => {
              //       setbuttonclick(1);
              //       trackview(tableMeta.rowData[3]);
              //     }}
              //     style={{
              //       backgroundColor: "#3a84d0",
              //       // backgroundImage: "linear-gradient(136deg, rgb(75 197 197) 0%, rgb(58 132 208) 50%, rgb(8 56 84) 100%)",
              //       color: "#fff",
              //       borderRadius: "0",
              //     }}
              //   />
              // </Tooltip>

              // <Button
              //   // color="secondary"
              //   size="small"
              //   variant="outlined"
              //   style={{

              //     backgroundColor: "#e1f5fe",
              //     color: "#0288d1" }}
              //   onClick={() => {
              //     setbuttonclick(1);
              //     trackview(tableMeta.rowData[3]);
              //     // trackdunzo(tableMeta.rowData[3]);
              //   }}
              // >
              //   Self-pick from store
              // </Button>
            );
          } else if (tableMeta.rowData[5] === 3) {
            if (tableMeta.rowData[8] != null) {
              return (
                // <Tooltip title="Click here to Tracck Order">

                //   <a
                //     onClick={() => {
                //       setbuttonclick(1);
                //       trackdunzo(tableMeta.rowData[3]);
                //     }}
                //   >
                //     <MyBadge
                //     type="button"

                //     badgeText="Dunzo" />

                //   </a>

                // </Tooltip>

                <Tooltip title="Click here to Track Order">
                  <a
                    onClick={() => {
                      setbuttonclick(1);
                      trackdunzo(tableMeta.rowData[8]);
                    }}
                  >
                    {/* <MyBadge  
                    type="button"
                    
                    badgeText={value} /> */}

                    <span style={{ color: "#bec117" }}>Dunzo</span>
                  </a>
                </Tooltip>

                // <Tooltip title="Click here to Track Order">
                //   <Chip
                //     label="Dunzo"
                //     clickable
                //     onClick={() => {
                //       setbuttonclick(1);
                //       trackdunzo(tableMeta.rowData[8]);
                //     }}
                //     style={{
                //       backgroundColor: "#bec117",
                //       // backgroundImage: "linear-gradient(136deg, rgb(210 223 17) 0%, rgb(190 193 23) 50%, rgb(134 149 11) 100%)",
                //       color: "#fff",
                //       borderRadius: "0",
                //     }}
                //   />
                // </Tooltip>

                // <Button
                //   color="secondary"
                //   style={{ backgroundColor: "#44d172", color: "white" }}
                //   onClick={() => {
                //     setbuttonclick(1);
                //     trackdunzo(tableMeta.rowData[3]);
                //   }}
                // >
                //   Dunzo
                // </Button>
              );
            } else {
              return (
                <Tooltip title="Click here to Track Order">
                  <a>
                    <span style={{ color: "#bec117" }}>
                      {"Dunzo - " + `${tableMeta.rowData[9]}`}
                    </span>
                  </a>
                </Tooltip>

                // <Tooltip title="Click here to Track Order">
                //   <Chip
                //     label={"Dunzo - " + `${tableMeta.rowData[9]}`}
                //     clickable
                //     style={{
                //       backgroundColor: "#bec117",
                //       color: "#fff",
                //       borderRadius: "0",
                //     }}
                //   />
                // </Tooltip>
              );
            }
          } else {
            return (
              // <Tooltip title="Click here to Tracck Order">

              //     <a
              //       onClick={() => {
              //         setbuttonclick(1);
              //         trackview(tableMeta.rowData[3]);
              //       }}
              //     >
              //       <MyBadge
              //       type="button"

              //       badgeText="Door Delivery" />

              //     </a>

              //   </Tooltip>

              <Tooltip title="Click here to Track Order">
                <a
                  onClick={() => {
                    setbuttonclick(1);
                    trackview(tableMeta.rowData[3]);
                  }}
                >
                  {/* <MyBadge  
                  type="button"
                  
                  badgeText={value} /> */}

                  <span style={{ color: "#FFA500" }}>Door Delivery</span>
                </a>
              </Tooltip>

              // <Tooltip title="Click here to Track Order">
              //   <Chip
              //     label="Door Delivery"
              //     clickable
              //     onClick={() => {
              //       setbuttonclick(1);
              //       trackview(tableMeta.rowData[3]);
              //     }}
              //     style={{
              //       backgroundColor: "#FFA500",
              //       // backgroundImage: "linear-gradient(136deg, rgb(210 223 17) 0%, rgb(190 193 23) 50%, rgb(134 149 11) 100%)",
              //       color: "#fff",
              //       borderRadius: "0",
              //     }}
              //   />
              // </Tooltip>

              // <Button
              //   color="secondary"
              //   style={{ backgroundColor: "#20295c", color: "white" }}
              //   onClick={() => {
              //     setbuttonclick(1);
              //     trackview(tableMeta.rowData[3]);
              //   }}
              // >
              //   Door Delivery
              // </Button>
            );
          }
          // return <MyBadge badgeText="Track" />
        },
      },
    },
    {
      name: "tracking_url",
      label: "Dunzo",
      options: {
        sort: false,
        display: false,
      },
    },
    {
      name: "State",
      label: "State",
      options: {
        sort: false,
        display: false,
      },
    },
    {
      name: "awb_code",
      label: "Downloads",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value != null && tableMeta.rowData[6]) {
            return (
              <>
                <Box>
                  {/* <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    style={{
                      marginRight: "5px",
                    }}
                    //endIcon={<ArrowForward />}
                    onClick={() => {
                      generateManifest(value);
                    }}
                  >
                    Manifest
                  </Button> */}

                  {/* <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    style={{
                      marginRight: "5px",
                    }}
                    //endIcon={<ArrowForward />}
                    onClick={() => {
                      generateManifest(value);
                    }}
                  >
                    Manifest
                  </Button> */}
                  <Tooltip title="Click here to Download Manifest">
                    <IconButton
                      style={{
                        backgroundColor: "antiquewhite",
                        padding: "5px",
                      }}
                      onClick={() => {
                        generateManifest(value);
                      }}
                    >
                      <ArrowDownwardOutlined />
                    </IconButton>
                  </Tooltip>

                  {/* <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    //endIcon={<ArrowForward />}
                    onClick={() => {
                      generateLabel(value);
                    }}
                  >
                    Label
                  </Button> */}

                  <Tooltip title="Click here to Download Label">
                    <IconButton
                      style={{
                        backgroundColor: "lightgray",
                        padding: "5px",
                        marginLeft: "5px",
                      }}
                      onClick={() => {
                        generateLabel(value);
                      }}
                    >
                      <Label />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            );
          } else if (
            (value == null || tableMeta.rowData[6] == 0) &&
            tableMeta.rowData[11] != null
          ) {
            return (
              <>
                <Box>
                  <Tooltip title="Click here to Download Manifest">
                    <IconButton
                      style={{
                        backgroundColor: "antiquewhite",
                        padding: "5px",
                      }}
                      onClick={() => {
                        setOrderTotal(tableMeta.rowData[2]);

                        generatePackingSlip(
                          tableMeta.rowData[11],
                          tableMeta.rowData[3]
                        );
                      }}
                    >
                      <ArrowDownwardOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            );
          }
          // return <MyBadge badgeText="Track" />
        },
      },
    },
    {
      name: "Waybill",
      label: "Waybill",
      options: {
        sort: false,
        display: false,
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

  const customSelect = () => (
    <>
      {rowsSelectedval.length > 0 ? (
        <Box style={{ paddingRight: "1em" }}>
          {selecteddelivery == "shiprocket" ? (
            <Button
              variant="contained"
              size="medium"
              // color="primary"
              style={{ backgroundColor: "#f44336" }}
              // onClick={() => cancelShipment(1)}
              onClick={() => {
                setCancelType(1);
                setReasonPopup(true);
                //cancelOrder();
              }}
            >
              Cancel Shipment
            </Button>
          ) : null}

          {selecteddelivery == "dunzo" ? (
            <Button
              variant="contained"
              size="medium"
              // color="primary"
              style={{ backgroundColor: "#f44336" }}
              // onClick={() => cancelDunzoShipment(1)}
              onClick={() => {
                setCancelType(1);
                setReasonPopup(true);
                //cancelOrder();
              }}
            >
              Cancel Shipment
            </Button>
          ) : null}
          {selecteddelivery == "delhivery" ? (
            <Button
              variant="contained"
              size="medium"
              // color="primary"
              style={{ backgroundColor: "#f44336" }}
              // onClick={() => cancelDelhiveryShipment(1)}
              onClick={() => {
                setCancelType(1);
                setReasonPopup(true);
                //cancelOrder();
              }}
            >
              Cancel Shipment
            </Button>
          ) : null}

          {/* <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => cancelOrder()}
            style={{ marginLeft: "1em" }}
          >
            Cancel Order
          </Button> */}

          {/* {selecteddelivery=="selfpickup" ?  */}

          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => {
              setCancelType(2);
              setReasonPopup(true);
            }}
            // onClick={() => cancelOrder()}
            style={{ marginLeft: "1em" }}
          >
            Cancel Order
          </Button>
          {/* :
            null } */}
        </Box>
      ) : null}
    </>
  );

  const cancelselfpickup = async () => {
    let order_id;
    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        if (data[item].iOrder) {
          order_id = data[item].iOrder;
        }
      });

      // console.log(order_id);
    }

    setError(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel Self-pickup order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "primary",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post("/mylapay/orders/transit-cancel", {
            // orderId: door_delivery_id[0],
            self_pickup: order_id,
            cancelType: cancelType,
            cancelReason: reasonformik.values.cancelReason,
          })
          .then((response) => {
            if (response.data.success === 1) {
              Swal.fire({
                title: "Success!",
                text: "Order cancelled!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
              });

              getData();
              setrowsSelectedval([]);
              setselecteddelivery("");
            } else {
              setError(true);
              setErrorMsg(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response) {
              setError(true);
              setErrorMsg(error.response.statusText);
            } else if (error.request) {
              setError(true);
              setErrorMsg(error.request.message);
            } else {
              setError(true);
              setErrorMsg(error.message);
            }
          });
      }
    });
  };

  const canceldoordelivery = async () => {
    let order_id;
    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        if (data[item].iOrder) {
          order_id = data[item].iOrder;
        }
      });

      // console.log(order_id);
    }

    setError(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel Door Delivery order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "primary",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      axios
        .post("/mylapay/orders/transit-cancel", {
          // orderId: door_delivery_id[0],
          door_delivery: order_id,
          cancelType: cancelType,
          cancelReason: reasonformik.values.cancelReason,
        })
        .then((response) => {
          if (response.data.success === 1) {
            Swal.fire({
              title: "Success!",
              text: "Order cancelled!",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#20295C",
            });

            getData();
            setrowsSelectedval([]);
            setselecteddelivery("");
          } else {
            setError(true);
            setErrorMsg(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            setError(true);
            setErrorMsg(error.response.statusText);
          } else if (error.request) {
            setError(true);
            setErrorMsg(error.request.message);
          } else {
            setError(true);
            setErrorMsg(error.message);
          }
        });
    });
  };

  const cancelOrder = async () => {
    if (selecteddelivery == "selfpickup") {
      cancelselfpickup();
      return;
    } else if (selecteddelivery == "doordelivery") {
      canceldoordelivery();
      return;
    } else if (selecteddelivery == "shiprocket") {
      cancelShipment();
    } else if (selecteddelivery == "dunzo") {
      cancelDunzoShipment();
    } else if (selecteddelivery == "delhivery") {
      cancelDelhiveryShipment();
    }
    // let awb_code = [];
    // let door_delivery_id = [];
    // let order_id;
    // if (rowsSelectedval.length > 0) {
    //   rowsSelectedval.filter((item, index) => {
    //     if (data[item].awb_code) {
    //       awb_code.push(data[item].awb_code);
    //       order_id = data[item].iOrder;
    //     } else {
    //       door_delivery_id.push(data[item].iOrder);
    //       order_id = data[item].iOrder;
    //     }
    //   });

    //   console.log(awb_code);
    // }
    // console.log(door_delivery_id);
    // console.log(rowsSelectedval);

    // // setLoading(true);
    // setError(false);
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You want to cancel order?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "primary",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes",
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     let reason = "";

    //     Swal.fire({
    //       title: "Reason for Cancellation",
    //       text: "",
    //       input: "text",
    //       showCancelButton: true,
    //     }).then((result) => {
    //       if (result.value) {
    //         console.log("Result: " + result.value);
    //         reason = result.value;

    //         axios
    //           .post("/mylapay/orders/transit-cancel", {
    //             orderId: door_delivery_id[0],
    //             order_id_for_shiprocket: order_id,
    //             awb_code: awb_code,
    //             //cancelProducts: sel_iorder,
    //             productStatus: 5,
    //             cancelReason: "Test cancel",
    //           })
    //           .then((response) => {
    //             if (response.data.success === 1) {
    //               Swal.fire({
    //                 title: "Success!",
    //                 text: "Order cancelled!",
    //                 icon: "success",
    //                 confirmButtonText: "OK",
    //                 confirmButtonColor: "#20295C",
    //               });

    //               getData();
    //               setrowsSelectedval([]);
    //             } else {
    //               setError(true);
    //               setErrorMsg(response.data.message);
    //             }
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //             if (error.response) {
    //               setError(true);
    //               setErrorMsg(error.response.statusText);
    //             } else if (error.request) {
    //               setError(true);
    //               setErrorMsg(error.request.message);
    //             } else {
    //               setError(true);
    //               setErrorMsg(error.message);
    //             }
    //           });
    //       }
    //     });
    //   }
    // });

    // setLoading(false);
  };

  const cancelDunzoShipment = async () => {
    let order_id;
    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        if (data[item].iOrder) {
          order_id = data[item].iOrder;
        }
      });
    }

    // setLoading(true);
    setError(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel Shipment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "primary",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post("/mylapay/orders/transit-cancel", {
            dunzo_order: order_id,
            cancellation_reason: reasonformik.values.cancelReason,
            cancelType: cancelType,
          })
          .then((response) => {
            if (response.data.success) {
              Swal.fire({
                title: "Success!",
                text: "Shipment cancelled!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
              });

              getData();
              setrowsSelectedval([]);
              setselecteddelivery("");
            } else {
              setError(true);
              setErrorMsg(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response) {
              setError(true);
              setErrorMsg(error.response.statusText);
            } else if (error.request) {
              setError(true);
              setErrorMsg(error.request.message);
            } else {
              setError(true);
              setErrorMsg(error.message);
            }
          });
      }
    });
  };
  const cancelDelhiveryShipment = async () => {
    let order_id;
    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        if (data[item].iOrder) {
          order_id = data[item].iOrder;
        }
      });
    }

    // setLoading(true);
    setError(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel Shipment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "primary",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post(`${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/cancel/order`, {
            delhivery: order_id,
            cancellation_reason: reasonformik.values.cancelReason,
            cancelType: cancelType,
            iMerchant: userDetails.iUser,
          })
          .then((response) => {
            if (response.data.success) {
              Swal.fire({
                title: "Success!",
                text: "Shipment cancelled!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
              });

              getData();
              setrowsSelectedval([]);
              setselecteddelivery("");
            } else {
              setError(true);
              setErrorMsg(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response) {
              setError(true);
              setErrorMsg(error.response.statusText);
            } else if (error.request) {
              setError(true);
              setErrorMsg(error.request.message);
            } else {
              setError(true);
              setErrorMsg(error.message);
            }
          });
      }
    });
  };

  const cancelShipment = async () => {
    let awb_code = [];
    let door_delivery_id = [];
    let order_id;
    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        if (data[item].awb_code) {
          awb_code.push(data[item].awb_code);
          order_id = data[item].iOrder;
        } else {
          door_delivery_id.push(data[item].iOrder);
          order_id = data[item].iOrder;
        }
      });

      // console.log(awb_code);
    }
    // console.log(door_delivery_id);
    // console.log(rowsSelectedval);

    // setLoading(true);
    setError(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel Shipment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#20295C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post("/mylapay/orders/transit-cancel", {
            awb_code: awb_code,
            cancelType: cancelType,
            cancelReason: reasonformik.values.cancelReason,
          })
          .then((response) => {
            if (response.data.success) {
              Swal.fire({
                title: "Success!",
                text: "Shipment cancelled!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  getData();
                }
              });

              setrowsSelectedval([]);
              setselecteddelivery("");
            } else {
              setError(true);
              setErrorMsg(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response) {
              setError(true);
              setErrorMsg(error.response.statusText);
            } else if (error.request) {
              setError(true);
              setErrorMsg(error.request.message);
            } else {
              setError(true);
              setErrorMsg(error.message);
            }
          });
      }
    });

    // setLoading(false);
  };

  const trackdunzo = async (value) => {
    if (value != null) {
      // await setbuttonclick(1);
      // console.log("Dunzo Code : " + value);

      // let jsonDataForOrderTrack = {
      //   iOrder: value,
      // };
      // axios
      //   .post(
      //     `https://dunzoapi.mylapay.com/mylapay/dunzo/track/status`,
      //     jsonDataForOrderTrack
      //   )
      //   .then((ordertrackresponse) => {
      //     console.log(
      //       "Order Track Update response : " +
      //         JSON.stringify(ordertrackresponse)
      //     );

      //     setDialogtrackOpen(true);
      //     setdunzoresponse(ordertrackresponse.data.data[0]);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      // https://dunzoapi.mylapay.com/mylapay/dunzo/track/status

      // let url = "https://app.shiprocket.co//tracking/" + value;

      // fetch(value, {
      //   headers: {"content-security-policy": "frame-ancestors 'self'",
      // "Access-Control-Allow-Origin":"*"}
      // })
      //   .then(response => response.text())
      //   .then(data => {
      //     setdunzocode("<iframe src=" + data + " style='width:134%; height:450px'/>")
      //     setDunzoDialogOpen(true);
      //   })
      //   .catch(err => err)

      window.open(`${value}`, "_blank");

      // setdunzocode("<iframe src=" + content + " ></iframe>");

      // setawbcode("<iframe src='https://app.shiprocket.co//tracking/{{value}}' style='width:134%; height:450px' />")
    }
  };

  const trackview = async (value) => {
    history.push(`/orders/trackorder?id=${value}&orderStatus=3`);
  };

  const trackorder = async (value, iorder) => {
    if (value != null) {
      await setbuttonclick(1);
      // console.log("AWB Code : " + value);

      let jsonDataForOrderTrack = {
        iOrder: iorder,
        awb_code: value,
      };
      axios
        .post(
          `https://shiprocketapi.mylapay.com/mylapay/shiprocket/track/awb`,
          jsonDataForOrderTrack
        )
        .then((ordertrackresponse) => {
          // console.log(
          //   "Order Track Update response : " +
          //     JSON.stringify(ordertrackresponse)
          // );
        })
        .catch((error) => {
          console.log(error);
        });

      // let url = "https://app.shiprocket.co//tracking/" + value;

      let url = "https://shiprocket.co/tracking/" + value;

      setawbcode("<iframe src=" + url + " style='width:134%; height:450px'/>");

      setDialogOpen(true);

      // setawbcode("<iframe src='https://app.shiprocket.co//tracking/{{value}}' style='width:134%; height:450px' />")
    }
  };
  const trackDelhiveryOrder = async (waybill) => {
    if (waybill != null) {
      await setbuttonclick(1);
      // console.log("waybill : " + waybill);
      window.open(
        `https://www.delhivery.com/track/package/${waybill}`,
        "_blank"
      );
      // let url = "https://www.delhivery.com/track/package/" + waybill;

      // setawbcode("<iframe src=" + url + " style='width:134%; height:450px'/>");

      // setDialogOpen(true);
    }
  };

  const doordelivery = async (value, tablemeta) => {
    if (value != null) {
      // console.log("Door delivery : " + buttonclick);
      // console.log("Door delivery : " + value);
      // history.push(`/orders/transitview?id=${value}`);
      // let url = "https://app.shiprocket.co//tracking/" + value
      // setawbcode("<iframe src=" + url + " style='width:134%; height:450px'/>")
      // setDialogOpen(true)
      // setawbcode("<iframe src='https://app.shiprocket.co//tracking/{{value}}' style='width:134%; height:450px' />")
    } else {
      await setbuttonclick(1);
      //console.log("Door delivery : " + JSON.stringify(tablemeta["rowData"][3]));

      history.push(`/orders/transitview?id=${tablemeta["rowData"][3]}`);
    }
  };

  const handleDialogClose = (value) => {
    handleDialog(false);
  };
  const handleDialogtrackClose = (value) => {
    handleDialogtrack(false);
  };
  const handleDialogtrack = (value) => {
    setDialogtrackOpen(value);
  };

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  const handleDunzoDialog = (value) => {
    setDunzoDialogOpen(value);
  };

  const handleDunzoDialogclose = () => {
    setDunzoDialogOpen(false);
  };

  const handleDaysChange = (e) => {
    e.preventDefault();
    setLastNdays(e.target.value);
    setFromDate(moment().subtract(e.target.value, "days"));
    setToDate(moment());
  };

  const TableFilter = () => {
    return (
      <Box py={2} display="flex">
        <Box maxWidth="160px">
          <DatePicker
            label="From"
            variant="inline"
            inputVariant="outlined"
            format="DD MMM YYYY"
            autoOk={true}
            value={fromDate}
            onChange={setFromDate}
            size="small"
            disableFuture
            maxDate={toDate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Today />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box maxWidth="160px" ml={2}>
          <DatePicker
            label="To"
            variant="inline"
            inputVariant="outlined"
            format="DD MMM YYYY"
            autoOk={true}
            value={toDate}
            onChange={setToDate}
            size="small"
            disableFuture
            minDate={fromDate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Today />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box ml={2}>
          <TextField
            variant="outlined"
            size="small"
            value={lastNdays}
            select
            fullWidth
            style={{ whiteSpace: "nowrap" }}
            onChange={(e) => handleDaysChange(e)}
            SelectProps={{
              MenuProps: {
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              },
            }}
          >
            <MenuItem value="7">Last 7 Days</MenuItem>
            <MenuItem value="30">Last 30 Days</MenuItem>
            <MenuItem value="90">Last 90 Days</MenuItem>
          </TextField>
        </Box>
      </Box>
    );
  };

  const handleOrderView = async (value) => {
    await history.push(`/orders/transitvieworder?id=${value}&orderStatus=3`);
  };

  const handleRowClick = async (rowData, rowMeta) => {
    // console.log(JSON.stringify(data[rowMeta['']]));
    // console.log(JSON.stringify(data[rowMeta["rowIndex"]]["awb_code"]));

    if (data[rowMeta["rowIndex"]]["awb_code"] != null) {
      await history.push(
        `/orders/trackorder?awbcode=${
          data[rowMeta["rowIndex"]]["awb_code"]
        }&id=${rowData[3]}&orderStatus=3`
      );
    } else {
      await history.push(
        `/orders/transitvieworder?id=${rowData[3]}&orderStatus=3`
      );
    }

    // if (data[rowMeta['rowIndex']]['awb_code'] == null) {
    //   console.log(JSON.stringify(rowData));

    //   await history.push(
    //     `/orders/transitvieworder?id=${rowData[3]}&orderStatus=3`
    //   );
    // }
    // else
    // {
    //   console.log(JSON.stringify(buttonclick));

    //   // if(buttonclick==0)
    //   // {
    //   //   await history.push(
    //   //     `/orders/transitvieworder?id=${rowData[3]}&orderStatus=3`
    //   //   );
    //   // }
    // }
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    downloadOptions: {
      filename: `Transit_Orders_${moment().format("YYYY-MM-DD")}.csv`,
    },
    viewColumns: false,
    print: false,
    rowsSelected: rowsSelectedval,
    elevation: 0,
    customToolbarSelect: customSelect,
    // onRowClick: handleRowClick,
    selectableRows: "single",
    // onRowSelected: handleRowClick,
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
    },
    onRowSelectionChange: (
      currentRowsSelectedchk,
      allRowsSelected,
      rowsSelected
    ) => {
      // console.log(
      //   "currentRowsSelected",
      //   JSON.stringify(currentRowsSelectedchk)
      // );
      // console.log("allRowsSelected", JSON.stringify(allRowsSelected));
      // console.log("rowsSelected", JSON.stringify(rowsSelectedval));
      // console.log(
      //   "rowsSelected",
      //   JSON.stringify(data[currentRowsSelectedchk[0]["index"]].iDelivery_Type)
      // );

      if (data[currentRowsSelectedchk[0]["index"]].iDelivery_Type == 2) {
        setselecteddelivery("selfpickup");
      }

      if (data[currentRowsSelectedchk[0]["index"]].iDelivery_Type == 1) {
        setselecteddelivery("doordelivery");
      }

      if (data[currentRowsSelectedchk[0]["index"]].awb_code != null) {
        setselecteddelivery("shiprocket");
      }

      if (data[currentRowsSelectedchk[0]["index"]].iDelivery_Type == 3) {
        setselecteddelivery("dunzo");
      }
      if (
        data[currentRowsSelectedchk[0]["index"]].iDelivery_Type == 1 &&
        data[currentRowsSelectedchk[0]["index"]].Waybill
      ) {
        setselecteddelivery("delhivery");
      }

      let temp = [];
      let indexes = [];

      setrowsSelectedval(rowsSelected);
      setcurrentrowsSelectedval(currentRowsSelectedchk);
    },
  };

  const getData = async () => {
    await axios
      .get("/mylapay/orders/get", {
        params: {
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
          paymentStatus: "1",
          orderTracker: 3,
        },
      })
      .then((response) => {
        setData(response.data.data);
        // setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (userData === null) return;

    // console.log("Button cick :" + buttonclick);

    getData();
  }, [userData, lastNdays, fromDate, toDate, buttonclick]);

  const generateLabel = async (value) => {
    await axios
      .post(`${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/label`, {
        awb_code: value,
      })
      .then((response) => {
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

  const generateManifest = async (value) => {
    await axios
      .post(
        `${REACT_APP_SHIPROCKET_URL}/mylapay/shiprocket/generate/manifest`,
        {
          awb_code: value,
        }
      )
      .then((response) => {
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

  const generatePackingSlip = async (waybill, iOrder) => {
    await axios
      .get(
        `${REACT_APP_DELHIVERY_URL}/mylapay/delhivery/create/packing_slip?waybill=${waybill}`
      )
      .then(async (response) => {
        if (response.data.success) {
          if (response.data.data.packages.length > 0) {
            setPackingSlipData(response.data.data.packages[0]);
            await axios
              .get(`mylapay/orders/get/${parseInt(iOrder)}?orderStatus=3`)
              .then((response) => {
                if (response.data.status) {
                  setOrderData(response.data.message[0].productDetails);
                  setPackingSlipDialog(true);
                }
              })
              .catch((error) => console.log(error));
          }
        }
      })
      .catch((error) => console.log(error));
  };
  const validationSchema = yup.object({
    cancelReason: yup.string().required("Please enter reason for cancellation"),
  });
  const reasonformik = useFormik({
    initialValues: {
      cancelReason: "",
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      <Box
        style={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "0px",
          borderRadius: "4px",
        }}
        m={2}
      >
        <MUIDataTable
          className="transanctions-table"
          response="scrollFullHeight"
          title={<TableFilter />}
          data={data}
          columns={columns}
          options={options}
          components={{ icons: { DownloadIcon: SaveAlt } }}
        />
      </Box>

      <Dialog
        style={{ width: "100%", margin: "auto" }}
        fullWidth
        maxWidth="md"
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Track Order</Box>
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
            dangerouslySetInnerHTML={{ __html: awbcode }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        style={{ width: "100%", margin: "auto" }}
        fullWidth
        maxWidth="sm"
        open={dunzodialogOpen}
        onClose={handleDunzoDialogclose}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Dunzo Track Order</Box>
            <Box>
              <IconButton
                onClick={() => {
                  handleDunzoDialog(false);
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
            dangerouslySetInnerHTML={{ __html: dunzocode }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        style={{ width: "50%", margin: "auto" }}
        fullWidth
        maxWidth="sm"
        open={dialogOpentrack}
        onClose={handleDialogtrackClose}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Track Order</Box>
            <Box>
              <IconButton
                onClick={() => {
                  handleDialogtrack(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* <div
            style={{ width: "75%", height: "450px" }}
            dangerouslySetInnerHTML={{ __html: awbcode }}
          /> */}

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Order Status:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {dunzoresponse.State}
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Delivery Person Name:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {dunzoresponse.delivery_person_name}
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Delivery Person Phone Number:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {dunzoresponse.delivery_person_phone_number}
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Price:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {dunzoresponse.price}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog
        open={reasonPopup}
        onClose={() => {
          setReasonPopup(false);
        }}
      >
        <DialogTitle>Reason for cancellation</DialogTitle>
        <DialogContent>
          <Grid>
            <Box style={{ width: "500px", height: "120px" }}>
              <TextField
                label=""
                variant="outlined"
                name="cancelReason"
                fullWidth
                type="text"
                inputProps={{ style: { height: "60px" } }}
                multiline={true}
                value={reasonformik.values.cancelReason}
                onBlur={reasonformik.handleChange}
                onChange={(e) => {
                  reasonformik.handleChange(e);
                }}
                error={
                  reasonformik.touched.cancelReason &&
                  Boolean(reasonformik.errors.cancelReason)
                }
                helperText={
                  reasonformik.touched.cancelReason &&
                  reasonformik.errors.cancelReason
                }
              />
            </Box>
          </Grid>
          <Grid mt={2} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                setReasonPopup(false);
                cancelOrder(2);
              }}
            >
              Submit
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

      {packingSlipDialog && (
        <PackingSlip
          packingSlipDialog={packingSlipDialog}
          setPackingSlipDialog={setPackingSlipDialog}
          packingSlipData={packingSlipData}
          orderTotal={orderTotal}
          orderData={orderData}
        />
      )}
    </>
  );
}
