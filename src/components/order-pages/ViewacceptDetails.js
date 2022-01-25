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
  Paper,
  Radio,
  Select,
  MenuItem,
  Tooltip,
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
  LibraryBooks,
  CheckCircle,
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
import * as yup from "yup";
import queryString from "query-string";
import { useLocation } from "react-router";

import Swal from "sweetalert2";
import styles from "./css/Edit.module.css";
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

export default function ViewacceptDetails() {
  const { search } = useLocation();
  const { id, orderStatus } = queryString.parse(search);

  const [orderDataval, setorderData] = useState();
  const [reasonPopup, setReasonPopup] = useState(false);

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

  const customSelect = (selectedRows, displayData, setSelectedRows) => (
    <>
      {/* <Box style={{ paddingRight: "1em" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            gotoorders();
          }}
          startIcon={<ArrowBack />}
        >
          Go to Orders
        </Button>
      </Box> */}

      {orderorproduct != 0 ? (
        <>
          <Box style={{ paddingRight: "1em" }}>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              startIcon={<CancelIcon />}
              onClick={() => setReasonPopup(true)}
              style={{ backgroundColor: "#f44336" }}
            >
              Cancel Order
            </Button>
          </Box>

          {/* </Box> */}
        </>
      ) : null}

      {/*   
  {orderorproduct==2?
    <Box style={{ paddingRight: "1em" }}>
      <Button
        variant="contained"
        size="medium"
        color="primary"
        startIcon={<DeleteIcon />}
        onClick={() => cancelOrder()}
      >
        Cancel Product
      </Button>
    </Box>
  :null} */}
    </>
  );
  const columns = [
    {
      name: "product_image",
      label: "Products",
      cursor: "pointer",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value != null) {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
                src={`${REACT_APP_SHOPAPI_URL}/uploads${value}`}
              ></Avatar>
            );
          } else {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
                src="/images/no-image-icon-23494.png"
              ></Avatar>
            );
          }
        },
      },
    },
    {
      name: "item",
      label: "Product Name",
      cursor: "pointer",
      options: {
        sort: true,

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

        // customBodyRender: (value, tableMeta, updateValue) => {
        //   return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
        // },
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
    customToolbarSelect: customSelect,
    // selectableRows: false,
    tableBodyMaxHeight: "calc(100vh - 220px)",
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      let temp = [];
      let indexes = [];

      if (rowsSelected.length > 0) {
        if (rowsSelected.length === orderDataval.productDetails.length) {
          setorderorproduct(1);
        } else {
          setorderorproduct(2);
        }
      } else {
        setorderorproduct(0);
      }
      setrowsSelectedval(rowsSelected);
    },
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

  const gotoorders = () => {
    // dispatch(setPaymentDetails(inputArray));
    // stepChange(3);

    history.push(`/orders`);
  };

  const viewproduct = (value) => {
    // dispatch(setPaymentDetails(inputArray));
    // stepChange(3);

    window.open(
      `${REACT_APP_SHOP_URL}/${orderDataval["url_name"]}/${orderDataval["Template_Url"]}/${value["rowData"][5]}/${value["rowData"][4]}`,
      "_blank"
    );

    // history.push(`${REACT_APP_SHOP_URL}/${value['rowData'][3]}/${value['rowData'][4]}`);
  };

  const cancelOrder = async () => {
    /* if (rowsSelectedval.length === orderDataval.productDetails.length) {
      // setLoading(true);
      setError(false);
      Swal.fire({
        title: "Are you sure?",
        text: "You want to cancel order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "primary",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .post("/mylapay/shop/cancel_order", {
              iOrder: orderDataval.iOrder,
            })
            .then((response) => {
              if (response.data.success === 1) {
                let jsonDataForOrderTrack = {
                  iOrder: orderDataval.iOrder,
                  orderTrackStatus: 5, // 1 - Pending, 2 - In-Transit, 3 - closed, 4 - cancelled
                };
                axios
                  .post(`/mylapay/orders/update`, jsonDataForOrderTrack)
                  .then((response) => {
                    console.log("Order Track Update response");

                    Swal.fire({
                      title: "Success!",
                      text: "Order cancelled!",
                      icon: "success",
                      confirmButtonText: "OK",
                      confirmButtonColor: "#20295C",
                    });

                    // getData();
                    setrowsSelectedval([]);

                    history.push(`/orders`);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
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
    } else { */
    let sel_iorder = [];

    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        sel_iorder.push({
          iProduct: orderDataval.productDetails[item].iProduct,
          gender: orderDataval.productDetails[item].Gender_Filter_Data,
          color: orderDataval.productDetails[item].Color_Filter_Data,
          size: orderDataval.productDetails[item].Size_Filter_Data,
        });
      });

      setError(false);
      Swal.fire({
        title: "Are you sure?",
        text: "You want to cancel Product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "primary",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .post("/mylapay/orders/update", {
              orderId: orderDataval.iOrder,
              cancelProducts: sel_iorder,
              productStatus: 5,
              cancelReason: reasonformik.values.cancelReason,
            })
            .then((response) => {
              if (response.data.success === 1) {
                Swal.fire({
                  title: "Success!",
                  text: "Product Deleted!",
                  icon: "success",
                  confirmButtonText: "OK",
                  confirmButtonColor: "#20295C",
                });

                getData();
                setrowsSelectedval([]);
                // fetchdata()
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
    }
  };

  const acceptorders = () => {
    let sel_iorder = [];

    // rowsSelectedval.filter((item, index) => {
    //   sel_iorder.push(orderDataval.productDetails[item].iProduct);
    // });

    axios
      .post("/mylapay/orders/update/order-accept", {
        orderId: orderDataval.iOrder,
        productStatus: 2,
      })
      .then((response) => {
        if (response.data.success === 1) {
          let jsonDataForOrderTrack = {
            iOrder: orderDataval.iOrder,
            orderTrackStatus: 2, // 1 - new-order, 2 - accept-order, 3 - transit
          };
          axios
            .post(`/mylapay/orders/track/update`, jsonDataForOrderTrack)
            .then((ordertrackresponse) => {
              Swal.fire({
                title: "Success!",
                text: "Order Accepted!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
              }).then((value) => {
                if (value.isConfirmed) {
                  getData();
                  setrowsSelectedval([]);
                  history.push(`/orders`);
                }
              });
            })
            .catch((error) => {
              console.log(error);
            });

          // fetchdata()
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

    data.splice(index, 1);
    // setorderData(data)
    setorderData({ ...orderDataval, productDetails: data });
    calTotalamount();
  };

  const calTotalamount = () => {
    let countval = 0;

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
      .get(`mylapay/orders/get/${parseInt(id)}?orderStatus=${orderStatus}`)
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

      <div>
        {orderDataval && (
          <form onSubmit={formik.handleSubmit}>
            <Paper elevation={0}>
              <Container style={{ paddingTop: "1em", paddingBottom: "2em" }}>
                <Grid
                  ref={ref}
                  style={{ background: "var(--mp-light-bg)" }}
                  container
                  spacing={2}
                >
                  <Grid item xs={12} md={12}>
                    <Box style={{ overflow: "auto", width: "100%" }}>
                      <MUIDataTable
                        className="accept-transanctions-table"
                        response="scrollFullHeight"
                        data={orderDataval.productDetails}
                        columns={columns}
                        options={options}
                        title={
                          <>
                            <Box>
                              <Grid container spacing={2}>
                                <Box style={{ paddingRight: "2em" }}>
                                  <Typography variant="body2">
                                    Order Total:{" "}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    ₹{orderDataval.totalAmount}
                                  </Typography>
                                </Box>

                                <Box style={{ paddingRight: "2em" }}>
                                  <Typography variant="body2">
                                    Order ID:
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {orderDataval.orderId}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Box>
                          </>
                        }
                        components={{ icons: { DownloadIcon: SaveAlt } }}
                      />
                    </Box>
                  </Grid>
                  <Grid
                    xs={12}
                    md={12}
                    style={{ display: "flex", padding: "8px" }}
                  >
                    <Grid item xs={11}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          gotoorders();
                        }}
                        startIcon={<ArrowBack />}
                      >
                        Go to Orders
                      </Button>
                    </Grid>
                    <Grid item md={2}>
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={() => acceptorders()}
                        style={{ backgroundColor: "#4caf50" }}
                      >
                        Accept Orders
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Container>
            </Paper>
          </form>
        )}
      </div>

      <div>
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
                    Boolean(formik.errors.cancelReason)
                  }
                  helperText={
                    reasonformik.touched.cancelReason &&
                    reasonformik.errors.cancelReason
                  }
                />
              </Box>
            </Grid>
            <Grid
              mt={2}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {
                  setReasonPopup(false);
                  cancelOrder();
                }}
              >
                Submit
              </Button>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
