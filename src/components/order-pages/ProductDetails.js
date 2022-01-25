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
  SaveAlt,
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
import Swal from "sweetalert2";
import styles from "./css/StepOne.module.css";

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

export default function ProductDetails({ orderData, stepChange }) {
  const [orderDataval, setorderData] = useState(orderData[0]);

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
  const [reasonPopup, setReasonPopup] = useState(false);
  const customSelect = (selectedRows, displayData, setSelectedRows) => (
    <>
      {orderorproduct == 1 ? (
        <Box style={{ paddingRight: "1em" }}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            startIcon={<CancelIcon />}
            onClick={() => setReasonPopup(true)}
          >
            Cancel Order
          </Button>
        </Box>
      ) : null}

      {orderorproduct == 2 ? (
        <Box style={{ paddingRight: "1em" }}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={() => setReasonPopup(true)}
          >
            Cancel Product
          </Button>
        </Box>
      ) : null}
    </>
  );
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
    // {
    //   name: "orderStatus",
    //   label: "Order Status",
    //   options: {
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return <MyBadge badgeText={value} />;
    //     },
    //   },
    // },
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
    onFilterChange: (changedColumn, changedColumnIndex, displayData) => {
      changedColumnIndex.forEach((data, key) => {
        if (Array.isArray(data) && data.length) {
          setSelectionIndexes([]);
          setrowsSelectedval([]);
        }
      });
    },
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
  };

  const handleChangechk = (event) => {
    setpickupvalue(event.target.value);
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

  // const fetchdata = async () => {

  //   await axios
  //     .get(`mylapay/orders/get/${parseInt(orderDataval.iOrder)}`)
  //     .then((res) => {
  //       if (res.data.status === 1) {
  //         if (res.data.message.length === 0) return;
  //         // let temp = res.data.message.find(
  //         //   (item) => item.iOrder === parseInt(id)
  //         // );
  //         // setOrderData(res.data.message);

  //         setorderData({ ...orderDataval, productDetails: res.data.message[0].productDetails });
  //         setrowsSelectedval([]);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const cancelOrder = async (iOrder) => {
    if (rowsSelectedval.length === orderDataval.productDetails.length) {
      let sel_iorder = [];

      rowsSelectedval.filter((item, index) => {
        sel_iorder.push({
          iProduct: orderDataval.productDetails[item].iProduct,
          gender: orderDataval.productDetails[item].Gender_Filter_Data,
          color: orderDataval.productDetails[item].Color_Filter_Data,
          size: orderDataval.productDetails[item].Size_Filter_Data,
        });
      });

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
          // await axios
          //   .post("/mylapay/shop/cancel_order", {
          //     iOrder: orderDataval.iOrder,
          //   })
          //   .then((response) => {
          //     if (response.data.success === 1) {
          //       let jsonDataForOrderTrack = {
          //         iOrder: orderDataval.iOrder,
          //         orderTrackStatus: 5, // 1 - Pending, 2 - In-Transit, 3 - closed, 4 - cancelled
          //       };

          //     } else {
          //       setError(true);
          //       setErrorMsg(response.data.message);
          //     }
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //     if (error.response) {
          //       setError(true);
          //       setErrorMsg(error.response.statusText);
          //     } else if (error.request) {
          //       setError(true);
          //       setErrorMsg(error.request.message);
          //     } else {
          //       setError(true);
          //       setErrorMsg(error.message);
          //     }
          //   });

          await axios
            // .post(`/mylapay/orders/track/update`, jsonDataForOrderTrack)

            .post("/mylapay/orders/update", {
              orderId: orderDataval.iOrder,
              cancelProducts: sel_iorder,
              productStatus: 5,
              cancelReason: reasonformik.values.cancelReason,
            })

            .then((response) => {
              Swal.fire({
                title: "Success!",
                text: "Order cancelled!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#20295C",
              });

              // getData();
              getData();
              setrowsSelectedval([]);

              history.push(`/orders`);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    } else {
      let sel_iorder = [];

      if (rowsSelectedval.length > 0) {
        rowsSelectedval.filter((item, index) => {
          //sel_iorder.push(orderDataval.productDetails[item].iProduct);
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

                  // fetchdata()
                  getData();
                  setrowsSelectedval([]);
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
    }

    // setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
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

  const getData = async () => {
    await axios
      .get(`mylapay/orders/get/${parseInt(orderDataval.iOrder)}?orderStatus=2`)
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

  useEffect(() => {
    const getDeliveryList = async () => {
      await axios
        .get("/mylapay/shop/delivery_charge_range")
        .then((res) => {
          calTotalamount();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getDeliveryList();
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
      <div>
        {orderDataval && (
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.stepCtaWrap}>
              <Button
                variant="contained"
                color="secondary"
                disableElevation
                style={{ color: "#fff" }}
                onClick={() => {
                  stepChange(1);
                }}
              >
                Next
              </Button>
            </div>

            <Paper elevation={0}>
              {/* <Grid >
            <Grid >

            <Box style={{ overflow: "auto", width: "100%" }}>
                <table
                  style={{
                    width: "100%",
                    background: "#fff",
                    borderRadius: "0.5em",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr>
                      <th align="left">Products</th>
                      <th align="right">Price</th>
                      <th>Quantity</th>
                      <th align="right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDataval &&
                      orderDataval.productDetails &&
                      orderDataval.productDetails.map((product) => (
                        <tr key={product.iItems}>
                          <td>
                            <Box className="cart-product-img-name">
                              <img
                                src={`${REACT_APP_SHOPAPI_URL}/uploads${product.product_image}`}
                                alt={product.item}
                                height="100px"
                                width="100px"
                                style={{
                                  objectFit: "cover",
                                  marginRight: "1em",
                                }}
                              />
                              <Typography variant="body1">
                                {product.item}
                                test
                              </Typography>
                            </Box>
                          </td>
                          <td align="right">
                            <Box style={{ padding: "0.5em 1em" }}>
                              ₹{product.price}
                            </Box>
                          </td>
                          <td align="center">{product.quantity}</td>
                          <td align="right">
                            <Box style={{ padding: "0.5em 1em" }}>
                              ₹{product.itemTotal_amount}
                            </Box>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Box>


            </Grid>
          </Grid> */}

              <Container style={{ paddingTop: "1em", paddingBottom: "2em" }}>
                {/* <ReactToPdf
            targetRef={ref}
            filename={`Order_${orderDataval.iOrder}.pdf`}
            scale={0.635}
          >
            {({ toPdf }) => (
              <Box
                style={{ display: "flex", justifyContent: "flex-end" }}
                mb={2}
              >
                <Button
                  onClick={toPdf}
                  variant="contained"
                  color="primary"
                  startIcon={<PictureAsPdf />}
                >
                  Export to PDF
                </Button>
              </Box>
            )}
          </ReactToPdf> */}

                <Grid
                  ref={ref}
                  style={{ background: "var(--mp-light-bg)" }}
                  container
                  spacing={2}
                >
                  {/* <Grid item xs={12}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#fff",
                        borderRadius: "0.5em",
                        overflow: "hidden",
                      }}
                    >
                      {/* <Box style={{ display: "flex", alignItems: "center" }}>
                        <img
                          style={{ marginRight: "1em" }}
                          src={`${REACT_APP_SHOPAPI_URL}/uploads${orderDataval.shop_logo}`}
                          alt="Logo"
                          height="60px"
                          width="auto"
                        />
                        <Typography variant="h5">
                          {orderDataval.shop_name}
                        </Typography>
                      </Box> 

                      <Box style={{ paddingRight: "1em" }}></Box>

                      <Box style={{ paddingRight: "1em" }}></Box>

                      <Box style={{ paddingRight: "1em" }}>
                        <Typography variant="body2">Order Total: </Typography>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          ₹{totalcal_amt}
                        </Typography>
                      </Box>

                      <Box style={{ paddingRight: "1em" }}>
                        <Typography variant="body2">Order ID:</Typography>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          {orderDataval.orderId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    {/* <Box style={{ overflow: "auto", width: "100%" }}> */}
                    <MUIDataTable
                      className="transanctions-table"
                      response="scrollFullHeight"
                      data={orderDataval.productDetails}
                      title={
                        <Box
                          style={{
                            display: "flex",
                            //justifyContent: "space-between",
                            alignItems: "center",
                            background: "#fff",
                            borderRadius: "0.5em",
                            overflow: "hidden",
                          }}
                        >
                          <Box style={{ paddingRight: "2em" }}>
                            <Typography variant="body2">
                              Order Total:{" "}
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: "bold" }}
                            >
                              ₹{totalcal_amt}
                            </Typography>
                          </Box>

                          <Box style={{ paddingRight: "1em" }}>
                            <Typography variant="body2">Order ID:</Typography>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: "bold" }}
                            >
                              {orderDataval.orderId}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      columns={columns}
                      options={options}
                      components={{ icons: { DownloadIcon: SaveAlt } }}
                    />
                    {/* </Box> */}
                  </Grid>
                  {/* <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "#fff",
                      borderRadius: "0.5em",
                    }}
                  >
                    <Typography variant="h6">Order Total: </Typography>
                    <Typography variant="h6" style={{ fontWeight: "normal" }}>
                      ₹{totalcal_amt}
                    </Typography>
                  </Box>
                </Grid>
                
              </Grid>
            </Grid> */}
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

      <Dialog
        style={{ width: "500px", margin: "auto" }}
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle id="id">
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Calculate Approximate Cost</Box>
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
          <CheckApproxPrice
            handleDialog={handleDialog}
            handleInput={handleInput}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Product Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You sure to delete the Product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
