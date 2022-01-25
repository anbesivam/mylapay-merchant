import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as yup from "yup";

// import UserAction from "../../components/transanctions/UserAction";

export default function Pending() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const [reasonPopup, setReasonPopup] = useState(false);
  const [selectionIndexes, setSelectionIndexes] = useState([]);

  const [rowsSelectedval, setrowsSelectedval] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");

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
          if (value === 1 || value === 4) {
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
            onClick={() => setReasonPopup(true)}
          >
            Cancel Order
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
      text: "You want to cancel overall order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#20295C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .post("/mylapay/orders/cancel_order", {
            iOrder: sel_iorder,
            productStatus: 5,
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
              reasonformik.resetForm();
              getData();
              setrowsSelectedval([]);
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

  const handleRowClick = (rowData, rowMeta) => {
    //console.log(JSON.stringify(rowData[3]));

    history.push(`/orders/view?id=${rowData[3]}&orderStatus=2`);
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    downloadOptions: {
      filename: `Accepted_Orders_${moment().format("YYYY-MM-DD")}.csv`,
    },
    viewColumns: false,
    print: false,
    rowsSelected: rowsSelectedval,
    elevation: 0,
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
      .get("/mylapay/orders/get", {
        params: {
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
          paymentStatus: "1",
          orderTracker: 2,
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
  }, [userData, lastNdays, fromDate, toDate]);

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

      <Dialog
        open={reasonPopup}
        onClose={() => {
          reasonformik.resetForm();
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
                cancelOrder();
              }}
            >
              Submit
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
