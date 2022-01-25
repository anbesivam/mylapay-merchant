import React, { useEffect, useState, useRef } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  InputAdornment,
  MenuItem,
  Grid,
  Popper,
  Grow,
  Toolbar,
  IconButton,
  Paper,
  ClickAwayListener,
  MenuList,
  TextField,
  Button,
} from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt, AccountCircleOutlined } from "@material-ui/icons";
import moment from "moment";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

// import DateRangePicker from '@material-ui/lab';

// import {
//   DateRangePicker,
//   DatePicker,
//   LocalizationProvider
// } from "@material-ui/pickers";
// import DateFnsUtils from "@material-ui/pickers/adapter/date-fns"; // choose your lib

import Swal from "sweetalert2";

// import UserAction from "../../components/transanctions/UserAction";

export default function Neworders() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const [selectionIndexes, setSelectionIndexes] = useState([]);

  const [rowsSelectedval, setrowsSelectedval] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");

  const [selectedDate, handleDateChange] = React.useState([null, null]);

  const history = useHistory();

  const columns = [
    {
      name: "orderId",
      label: "Order ID",
      options: {
        sort: true,
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
      name: "orderStatus",
      label: "Payment",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === 1 || value === "1") {
            return <MyBadge badgeText="Success" />;
          } else if (value === 0 || value === "0") {
            return <MyBadge badgeText="Failure" />;
          }
        },
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
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === 1) {
            value = "Delivery";
          } else if (value === 2) {
            value = "Store Self-pickup";
          } else if (value === 3) {
            value = "Dunzo";
          } else {
            value = "";
          }
          return <MyBadge badgeText={value} />;
        },
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

  const customSelect = () => (
    <>
      {rowsSelectedval.length > 0 ? (
        <Box style={{ paddingRight: "1em" }}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => cancelOrder()}
          >
            Accept Order
          </Button>
        </Box>
      ) : null}
    </>
  );

  const handleDaysChange = (e) => {
    e.preventDefault();
    setLastNdays(e.target.value);
    setFromDate(moment().subtract(e.target.value, "days"));
    setToDate(moment());
  };

  const cancelOrder = async (iOrder) => {
    let sel_iorder = [];

    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        sel_iorder.push(data[item].iOrder);
      });
    }

    // setLoading(true);
    setError(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Accept order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "primary",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let jsonDataForOrderTrack = {
          iOrder: sel_iorder,
          orderTrackStatus: 2, // 1 - Pending, 2 - In-Transit, 3 - closed
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
            });

            getData();
            setrowsSelectedval([]);
          })
          .catch((error) => {
            console.log(error);
          });

        // await axios
        // .post("/mylapay/shop/cancel_order", {
        //   iOrder : sel_iorder
        // })
        // .then((response) => {
        //   if (response.data.success === 1) {

        //     let jsonDataForOrderTrack = {
        //       iOrder: data[rowsSelectedval].iOrder,
        //       orderTrackStatus: 4 // 1 - Pending, 2 - In-Transit, 3 - closed
        //     }
        //     axios
        //     .post(`/mylapay/orders/track/update`,jsonDataForOrderTrack)
        //     .then((response) => {
        //       console.log("Order Track Update response");

        //       Swal.fire({
        //         title: "Success!",
        //         text: "Order cancelled!",
        //         icon: "success",
        //         confirmButtonText: "OK",
        //         confirmButtonColor: "#20295C"
        //       })

        //       getData();
        //       setrowsSelectedval([]);

        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });

        //   } else {
        //     setError(true);
        //     setErrorMsg(response.data.message);
        //   }
        // })
        // .catch((error) => {
        //   console.log(error);
        //   if (error.response) {
        //     setError(true);
        //     setErrorMsg(error.response.statusText);
        //   } else if (error.request) {
        //     setError(true);
        //     setErrorMsg(error.request.message);
        //   } else {
        //     setError(true);
        //     setErrorMsg(error.message);
        //   }
        // });
      }
    });

    // setLoading(false);
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

        <Box minWidth="120px" ml={2}>
          <TextField
            label="Payment Status"
            variant="outlined"
            size="small"
            value={paymentStatus}
            select
            fullWidth
            style={{ whiteSpace: "nowrap" }}
            onChange={(e) => setPaymentStatus(e.target.value)}
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
            <MenuItem value={"all"}>All</MenuItem>
            <MenuItem value={"1"}>Success</MenuItem>
            <MenuItem value={"0"}>Failure</MenuItem>
          </TextField>
        </Box>

        {/* <Toolbar>
        <Box ml="auto" display="flex" alignItems="center">

          <div>
            <IconButton
              ref={anchorRef}
              onClick={handleToggle}
              edge="end"
              color="inherit"
            >             
              Filters
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              placement="bottom-end"
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: "right top",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open}>

                        <MenuItem onClick={handleClose}>
                          Today's Transactions
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                          Last 7 Days Transactions
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                          Last 30 Days Transactions
                        </MenuItem>

                        <MenuItem onClick={handleClose}>

                          <Grid container>
                            <Grid xs={6}>
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
                            </Grid>
                            <Grid xs={6}>
                              <DatePicker
                                label="From"
                                variant="inline"
                                inputVariant="outlined"
                                format="DD MMM YYYY"
                                autoOk={true}
                                value={fromDate}
                                // onChange={setOpen(false)}
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
                            </Grid>
                          </Grid>

                          

                        </MenuItem>

                      </MenuList>
                      

                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
          
        </Box>
        </Toolbar> */}
      </Box>
    );
  };

  const handleRowClick = (rowData, rowMeta) => {
    let orderStatus = rowData[4];

    history.push(`/orders/acceptview?id=${rowData[3]}&orderStatus=1`);
    // if(orderStatus === 1 || orderStatus === "1"){
    //   history.push(`/orders/acceptview?id=${rowData[3]}&orderStatus=1`);
    // }
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    downloadOptions: {
      filename: `New_Orders_${moment().format("YYYY-MM-DD")}.csv`,
    },
    viewColumns: false,
    print: false,
    rowsSelected: rowsSelectedval,
    elevation: 0,
    selectableRows: false,
    customToolbarSelect: customSelect,
    onRowClick: handleRowClick,
    onFilterChange: (changedColumn, changedColumnIndex, displayData) => {
      changedColumnIndex.forEach((data, key) => {
        if (Array.isArray(data) && data.length) {
          setSelectionIndexes([]);
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

      setrowsSelectedval(rowsSelected);

      // check if there is existing filter
      // Iterate rowsSelected:
      // rowsSelected.forEach((row) => {
      //   // Add or remove row index to/from indexes arr:
      //   indexes = addToOrRemoveFromArray(row, indexes, "indexes");
      //   // Circle data:
      //   let circle_data = circles[row];
      //   // Add or remove circle_data to/from temp arr:
      //   temp = addToOrRemoveFromArray(circle_data, temp, "temp");
      // });
      // Set indexes to local hook:
      // setSelectionIndexes(indexes);
      // Send the circle data to redux:
      // handleSelection(temp);
    },
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
    },
  };

  const getData = async () => {
    await axios
      .get(`/mylapay/orders/get`, {
        params: {
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
          paymentStatus: paymentStatus,
          orderTracker: 1,
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
    getData();
  }, [userData, lastNdays, fromDate, toDate, paymentStatus]);

  // useEffect(() => {
  //   if (userData === null) return;

  //   const getData = async () => {
  //     await axios
  //       .get("/mylapay/transaction/get/transactions/upi", {
  //         params: {
  //           fromDate: moment(fromDate).format("YYYY-MM-DD"),
  //           toDate: moment(toDate).format("YYYY-MM-DD"),
  //           txnType: txnType,
  //         },
  //       })
  //       .then((response) => {
  //         setData(response.data.data);
  //         // console.log(response.data.data);
  //       })
  //       .catch((error) => console.log(error));
  //   };

  //   getData();
  // }, [userData, txnType, lastNdays, fromDate, toDate]);

  return (
    <Box
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "0px",
        borderRadius: "4px",
      }}
      m={2}
    >
      {/* {rowsSelectedval.length>0?

        <Box py={2} display="flex" flexDirection="column">
        <Box maxWidth="160px" >

          <Box minWidth="120px" ml={2} >
              <Button
                variant="contained"
                size="medium"
                color="primary"
                onClick={() => cancelOrder()}
              >
                Cancel Order
              </Button>
          </Box>
        </Box>

        </Box>
      
      :null} */}

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
  );
}
