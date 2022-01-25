import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  IconButton
} from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";
import MyBadge from "../../components/common/MyBadge";
import MyBadgePageType from "../../components/common/MyBadgePageType";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt,Close } from "@material-ui/icons";
import moment from "moment";
import UserAction from "../../components/transanctions/UserAction";
import { useFormik } from "formik";
import * as yup from "yup";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
//import Box from '@material-ui/core/Box';
import {
  Timeline,
  AddShoppingCart,
  AccountCircle,
  AttachMoney,
} from "@material-ui/icons";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

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

export default function Transanctions() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  // const [txnType, setTxnType] = useState("all");
  const [status, setStatus] = useState("all");
  const [settlementStatus, setSettlementStatus] = useState("all");
  const [txnType, setTxnType] = useState("all");
  const [fileName, setFileName] = useState("All");
  const [splitPayment, setSplitPayment] = useState("3");
  const [PG, setPG] = useState("all");

  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());

  const [TotalTxnCount, setTotalTxnCount] = useState(0);
  const [SuccessTxnCount, setSuccessTxnCount] = useState(0);
  const [FailedTxnCount, setFailedTxnCount] = useState(0);
  const [RejectedDataCount, setRejectedDataCount] = useState(0);

  const [TxnCount, setTxnCount] = useState(0);
  const [current_selected_doc, setcurrent_selected_doc] = useState("Total");
  const [rowsSelectedval, setrowsSelectedval] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenAfterRefundInitiated, setDialogOpenAfterRefundInitiated] = useState(false);
  const [refundInitiateMsg, setRefundInitiateMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [transactionAmountResp, setTransactionAmountResp] = useState(null);

  const [overlay_on, setoverlay_on] = useState(false);
  const [progress_on, setprogress_on] = useState(false);

  const history = useHistory();
  const { REACT_APP_MERCHANT_URL } = process.env;
  const handleMerchantDocs = async (type) => {
    console.log(type);

    if (type === "all") {
      setcurrent_selected_doc("Total");
      await axios
        .get("/mylapay/transaction/get/transactions/payu", {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            txnType: txnType,
          },
        })
        .then((response) => {
          setData(response.data.data);
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    } else if (type === 0) {
      let status = type;
      setcurrent_selected_doc("Pending");
      await axios
        .get(`/mylapay/transaction/get/transactions/upi?status=${status}`, {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            txnType: txnType,
          },
        })
        .then((response) => {
          setData(response.data.data);
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    } else if (type === 1) {
      let status = type;
      setcurrent_selected_doc("Success");
      await axios
        .get(`/mylapay/transaction/get/transactions/payu?status=${status}`, {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            txnType: txnType,
          },
        })
        .then((response) => {
          setData(response.data.data);
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    } else if (type === 2) {
      let status = type;
      setcurrent_selected_doc("Failed");
      await axios
        .get(`/mylapay/transaction/get/transactions/payu?status=${status}`, {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            txnType: txnType,
          },
        })
        .then((response) => {
          setData(response.data.data);
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    }
  };

  const classes = useStyles();
  const classesFacebook = useStylesFacebook();

  // const columns = [
  //   {
  //     name: "Order Date",
  //     label: "Order Date",
  //     options: {
  //       sort: true,
  //       customBodyRender: (value, tableMeta, updateValue) => {
  //         return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
  //       },
  //     },
  //   },
  //   {
  //     name: "Order ID",
  //     label: "Order ID",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   // {
  //   //   name: "Payment ID",
  //   //   label: "Payment ID",
  //   //   options: {
  //   //     sort: true,
  //   //   },
  //   // },
  //   {
  //     name: "Amount",
  //     label: "Amount",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "Payer VPA",
  //     label: "Payer VPA",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "Payee VPA",
  //     label: "Payee VPA",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   // {
  //   //   name: "Contact No",
  //   //   label: "Contact No",
  //   //   options: {
  //   //     sort: false,
  //   //   },
  //   // },
  //   {
  //     name: "Txn Status",
  //     label: "Txn Status",
  //     options: {
  //       sort: true,
  //       customBodyRender: (value, tableMeta, updateValue) => {
  //         return <MyBadge badgeText={value} />;
  //       },
  //     },
  //   },
  //   {
  //     name: "Cust Ref ID",
  //     label: "Cust Ref ID",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "NPCI_UPI_Trnx_ID",
  //     label: "NPCI_UPI_Trnx_ID",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "Reference ID",
  //     label: "Reference ID",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "Status Description",
  //     label: "Status Description",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "TransactionNote",
  //     label: "TransactionNote",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "YBLTxnID",
  //     label: "YBLTxnID",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   {
  //     name: "iPaystatus",
  //     label: "iPaystatus",
  //     options: {
  //       sort: true,
  //     },
  //   },
  //   // {
  //   //   name: "User Action",
  //   //   label: "User Action",
  //   //   options: {
  //   //     sort: false,
  //   //     customBodyRender: (value, tableMeta, updateValue) => {
  //   //       return <UserAction value={value} />;
  //   //     },
  //   //   },
  //   // },
  // ];

  let payuColumns = [
    {
      name: "ORDERNO",
      label: "iOrder",
      options: {
        sort: true,
        display: "none",
        download: false,
      },
    },
    {
      name: "ORDERNO",
      label: "Order No",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <MyBadge badgeText={`MPY${value}`} />;
        },
      },
    },
    {
      name: "Txntype",
      label: "TxnType",
      options: {
        sort: true,
      },
    },
    {
      name: "Success",
      label: "Status",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === "Yes") {
            // return <MyBadgePageType badgeText="Success" />;
            return <span style={{color:"green"}}>Success</span>;
          } else {
            // return <MyBadgePageType badgeText="Failure" />;
            return <span style={{color:"red"}}>Failure</span>;
          }
        },
      },
    },
    {
      name: "TxnTime",
      label: "TxnTime",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
        },
      },
    },
    // {
    //   name: "Pgname",
    //   label: "PG Name",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "Shipment_Type",
    //   label: "Shipment Type",
    //   options: {
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       if(value === 1) return "Delivery"
    //       else if(value === 2) return "Self Pickup"
    //       else if(value === 3) return "Dunzo"
    //       else return "Self Pickup"
    //     },
    //   },
    // },
    {
      name: "txnamount",
      label: "Txn Amount (₹)",
      options: {
        sort: true,
      },
    },
    {
      name: "SplitAdded",
      label: "Split Added",
      options: {
        sort: true,
        display: "none",
      },
    },
    {
      name: "Merchant_Settlement_Status",
      label: "Settlement Status",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === "YES" && tableMeta.rowData[6] === "YES") {
            // return <MyBadge badgeText="Settled" />;
            return <span style={{color:"rgb(62, 195, 18)"}}>Settled</span>;
          } else if (value === "No" && tableMeta.rowData[6] === "YES") {
            // return <MyBadge badgeText="Settlement in progress" />;
            return <span style={{color:"rgb(235 155 35)"}}>Settlement in progress</span>;
          } else if (tableMeta.rowData[3] === "No") {
            return "-";
          } else if (
            tableMeta.rowData[3] === "Yes" &&
            tableMeta.rowData[6] === "NO"
          ) {
            // return <MyBadge badgeText="order to be closed" />;
            return <span style={{color:"rgb(30, 191, 183)"}}>Order to be closed</span>;
          } else if (value === "YES" && tableMeta.rowData[2] === "Refund") {
            // return <MyBadge badgeText="Refunded" />;
            return <span style={{color:"rgb(62, 195, 18)"}}>Refunded</span>;
          } else if (value === "No" && tableMeta.rowData[2] === "Refund") {
            // return <MyBadge badgeText="Refund in progress" />;
            return <span style={{color:"rgb(235, 155, 35)"}}>Refund in progress</span>;
          }
        },
      },
    },
    {
      name: "Page_Type",
      label: "Page Type",
      options: {
        sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if(value === "Online Store"){
              // return <MyBadgePageType badgeText="Online Store" />;          
              return <span style={{color:"#0288d1"}}>Online Store</span>;   
            } else if(value === "Payment Webpage"){
              // return <MyBadgePageType badgeText="Payment Webpage" />;
              return <span style={{color:"rgb(62, 195, 18)"}}>Payment Webpage</span>;       
            } else if(value === "Quick Pay"){
              // return <MyBadgePageType badgeText="Quick Pay" />;
              return <span style={{color:"rgb(62, 195, 18)"}}>Quick Pay</span>;
            }
            
          }
  
      },
    },
    {
      name: "Breakup",
      label: "Breakup",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <>
                <Button
                  onClick={() => {
                    breakupRowClick(tableMeta.rowData);
                  }}
                  style={{
                    backgroundColor: "#2caee4",
                    fontSize: "12px"
                  }}
                  variant="contained"
                  size="medium"
                  color="primary"
                >
                  Breakup
                </Button>
              </>
            );
          
        },
      }
    },
    {
      name: "Merchant_Settlement_Amount",
      label: "Merchant_Settlement_Amount",
      options: {
        sort: true,
        display: "none",
      },
    },
    {
      name: "Refund_Processed_Amount",
      label: "Refund",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value < tableMeta.rowData[10] && tableMeta.rowData[7] === "YES" && tableMeta.rowData[6] === "YES") {
            return (
              <>
                <Button
                  onClick={() => {
                    refundInitiate(tableMeta.rowData[0],tableMeta.rowData[10],value);
                  }}
                  style={{
                    backgroundColor: "orange",
                    fontSize: "12px"
                  }}
                  variant="contained"
                  size="medium"
                  color="primary"
                >
                  Refund
                </Button>
              </>
            );
          } else {
            return (
              <>
                -
              </>
            );
          } 
        },
      }
    }
    // {
    //   name: "Transaction_Amount_Resp",
    //   label: "Transaction Amount (₹)",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "AmountToBeSettled",
    //   label: "AmountToBeSettled (₹)",
    //   options: {
    //     sort: true
    //   },
    // },
    // {
    //   name: "Total_deductions",
    //   label: "Total Deductions(₹)",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "Mylapay_fee_aggregator_charge",
    //   label: "Mylapay Fee AggregatorCharges(₹)",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "splitPayment",
    //   label: "splitPayment",
    //   options: {
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       if(value === 1){
    //         return <MyBadge badgeText="Added" />;
    //       } else if(value === 2){
    //         return <MyBadge badgeText="Released" />;
    //       } else{
    //         return <MyBadge badgeText="Yet to be added" />;
    //       }
    //     },
    //   },
    // },
    // {
    //   name: "Parent Payment ID",
    //   label: "AGG Payment ID",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "Child Payment ID",
    //   label: "MERC Payment ID",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "mihpayid",
    //   label: "mihpayid",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "payuMoneyId",
    //   label: "payuMoneyId",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "mode",
    //   label: "Mode of Payment",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "bankcode",
    //   label: "Bank Code",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "bank_ref_num",
    //   label: "Bank Ref Num",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "customerName",
    //   label: "Customer Name",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "Txn Status",
    //   label: "Txn Status",
    //   options: {
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return <MyBadge badgeText={value} />;
    //     },
    //   },
    // }
  ];

  const customSelect = () => <span></span>;

  const validationSchema = yup.object({
    refund_amount: yup
      .number("Enter a valid Amount")
      .required("Required Field")
  });

  const formik = useFormik({
    initialValues: {
      refund_amount: "",
      iOrder: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
     handleClick(values);
    },
  });

  const refundInitiate = (iOrder,Merchant_Settlement_Amount,Refund_Processed_Amount) => {
    console.log("Refund Initiate");
    console.log(iOrder);
    formik.setFieldValue("refund_amount","");
    formik.setFieldValue("iOrder",iOrder);
    let amount = Merchant_Settlement_Amount - Refund_Processed_Amount;
    console.log(amount);
    setTransactionAmountResp(amount);
    handleDialog(true);
  }

  const refundInitiateConfirm = () => {
    console.log("refundInitiateConfirm");
    formik.handleSubmit();
  }

  let handleRefundAmount = (e) => {
    console.log(e.target.value);
    console.log(transactionAmountResp);
    if(parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= transactionAmountResp){
      formik.setFieldValue("refund_amount",e.target.value);
    }
    else if(e.target.value === ""){
      formik.setFieldValue("refund_amount",e.target.value);
    }
  }

  const handleClick = (values) => {
    setLoading(true);
    //setoverlay_on(true);
    //setprogress_on(true);
    console.log("handleClick calling");
    console.log(values);
    let iOrder = values.iOrder;
    let refund_amount = parseFloat(values.refund_amount);
    console.log(iOrder);
    console.log(refund_amount);
    console.log(typeof refund_amount);

    let jsonData = {
      "iOrder": iOrder,
      "refund_amount": refund_amount
    }

      axios
      .post(`/mylapay/transaction/refund/initiate`,jsonData
      )
      .then((response) => {
        console.log(response);
        if(response.data.message){
          //setprogress_on(false);
          //setoverlay_on(false);
          setRefundInitiateMsg(response.data.message);
          handleDialogAfterRefundInitiated(true);
          handleDialog(false);
          setLoading(false);
        } else{
          console.log("something went wrong");
          //setoverlay_on(false);
          //setprogress_on(false);
          setLoading(false);
        }
        
      })
      .catch((error) => {
        console.log(error);
      });

  }

  const handleDialogClose = (value) => {
    handleDialog(false);
  };

  const handleDialog = (value) => {
    setDialogOpen(value);
  };
  const handleDialogCloseAfterRefundInitiated = (value) => {
    handleDialogAfterRefundInitiated(false);
  };

  const handleDialogAfterRefundInitiated = (value) => {
    setDialogOpenAfterRefundInitiated(value);
  };

  const handleDaysChange = (e) => {
    e.preventDefault();
    setLastNdays(e.target.value);
    setFromDate(moment().subtract(e.target.value, "days"));
    setToDate(moment());
  };

  const txnTypeOnChange = (value) => {
    setTxnType(value);
    if (value === "all") {
      setSettlementStatus("all");
      setFileName("All");
    } else if (value === "1") {
      setFileName("Sale");
      if (
        settlementStatus === "sale_all" ||
        settlementStatus === "1" ||
        settlementStatus === 2 ||
        settlementStatus === 3
      ) {
        // Nothing to change
      } else {
        setSettlementStatus("sale_all");
      }
    } else if (value === "2") {
      setFileName("Refund");
      if (
        settlementStatus === "refund_all" ||
        settlementStatus === "4" ||
        settlementStatus === 5
      ) {
        // Nothing to change
      } else {
        setSettlementStatus("refund_all");
      }
    }
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
            label="Txn Type"
            variant="outlined"
            size="small"
            value={txnType}
            select
            fullWidth
            style={{ whiteSpace: "nowrap" }}
            onChange={(e) => txnTypeOnChange(e.target.value)}
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
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="1">Sale</MenuItem>
            <MenuItem value="2">Refund</MenuItem>
          </TextField>
        </Box>

        <Box minWidth="120px" ml={2}>
          <TextField
            label="Status"
            variant="outlined"
            size="small"
            value={status}
            select
            fullWidth
            style={{ whiteSpace: "nowrap" }}
            onChange={(e) => setStatus(e.target.value)}
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
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="1">Success</MenuItem>
            <MenuItem value="0">Failure</MenuItem>
          </TextField>
        </Box>

        <Box minWidth="120px" ml={2}>
          {txnType === "all" ? (
            <>
              <TextField
                label="Settlement Status"
                variant="outlined"
                size="small"
                value={settlementStatus}
                select
                fullWidth
                style={{ whiteSpace: "nowrap" }}
                onChange={(e) => setSettlementStatus(e.target.value)}
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
                <MenuItem value="all">All</MenuItem>
              </TextField>
            </>
          ) : null}

          {txnType === "1" ? (
            <>
              <TextField
                label="Settlement Status"
                variant="outlined"
                size="small"
                value={settlementStatus}
                select
                fullWidth
                style={{ whiteSpace: "nowrap" }}
                onChange={(e) => setSettlementStatus(e.target.value)}
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
                <MenuItem value="sale_all">All</MenuItem>
                <MenuItem value="1">order to be closed</MenuItem>
                <MenuItem value="2">Settlement in progress</MenuItem>
                <MenuItem value="3">Settled</MenuItem>
              </TextField>
            </>
          ) : null}

          {txnType === "2" ? (
            <>
              <TextField
                label="Settlement Status"
                variant="outlined"
                size="small"
                value={settlementStatus}
                select
                fullWidth
                style={{ whiteSpace: "nowrap" }}
                onChange={(e) => setSettlementStatus(e.target.value)}
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
                <MenuItem value="refund_all">All</MenuItem>
                <MenuItem value="4">Refund in progress</MenuItem>
                <MenuItem value="5">Refunded</MenuItem>
              </TextField>
            </>
          ) : null}
        </Box>

        {/* <Box minWidth="120px" ml={2}>
          <TextField
            label="Split payment"
            variant="outlined"
            size="small"
            value={splitPayment === 3 ? "all" : splitPayment}
            select
            fullWidth
            style={{ whiteSpace: "nowrap" }}
            onChange={(e) => setSplitPayment(e.target.value)}
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
            <MenuItem value="3">All</MenuItem>
            <MenuItem value="0">Add split</MenuItem>
            <MenuItem value="1">Release split</MenuItem>
          </TextField>
        </Box> */}

        {/* <Box minWidth="120px" ml={2}>
          <TextField
            label="PG"
            variant="outlined"
            size="small"
            value={PG}
            select
            fullWidth
            style={{ whiteSpace: "nowrap" }}
            onChange={(e) => setPG(e.target.value)}
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
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="1">Mylapay</MenuItem>
            <MenuItem value="2">Payu</MenuItem>
          </TextField>
        </Box> */}
      </Box>
    );
  };

  // const handleRowClick = (rowData, rowMeta) => {
  //   console.log(rowData);
  //   //history.push(`/superadmin-transactions/sale/view?id=${rowData[0]}`);

  //   window.open(
  //     `${REACT_APP_MERCHANT_URL}/transactions/breakup?id=${rowData[0]}`
  //   );
  // };

  const breakupRowClick = (rowData) => {
    console.log(rowData);
    window.open(
      `${REACT_APP_MERCHANT_URL}/transactions/breakup?id=${rowData[0]}`
    );
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    downloadOptions: {
      filename: `${fileName}_transactions_${moment().format("YYYY-MM-DD")}.csv`
    },
     onDownload: (buildHead, buildBody, columns, data) => {
      console.log("before");
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          data[i].data[4] = moment(data[i].data[4]).format("DD MMM YYYY, h:mm:ss a")
          if(data[i].data[7] === "YES" && data[i].data[6] === "YES"){
            data[i].data[7] ="Settled";
          }else if(data[i].data[7] === "No" && data[i].data[6] === "YES"){
            data[i].data[7] = "Settlement in progress"
          } else if (data[i].data[3] === "No") {
             data[i].data[7] = '';
          } else if (
            data[i].data[3] === "Yes" &&
            data[i].data[6] === "NO"
          ) {
            data[i].data[7] = "order to be closed";
          } else if (data[i].data[7] === "YES" && data[i].data[2] === "Refund") {
            data[i].data[7] ="Refunded";
          } else if (data[i].data[7] === "No" && data[i].data[2] === "Refund") {
            data[i].data[7] = "Refund in progress";
          }
        }
        return "\uFEFF" + buildHead(columns) + buildBody(data); 
    }, 
    viewColumns: false,
    print: false,
    elevation: 0,
    //onRowClick: handleRowClick,
    //selectableRows: false,
    selectableRows: "none",
    customToolbarSelect: customSelect,
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      console.log("currentRowsSelected", JSON.stringify(currentRowsSelected));
      console.log("allRowsSelected", JSON.stringify(allRowsSelected));
      console.log("rowsSelected", JSON.stringify(rowsSelected));
      let temp = [];
      let indexes = [];

      setrowsSelectedval(rowsSelected);
    },
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
    },
  };

  useEffect(() => {
    if (userData === null) return;
    setoverlay_on(true);
    setprogress_on(true);
    //alert(typeof txnType);
    const getData = async () => {
      await axios
        .get("/mylapay/transaction/get/transactions/payu", {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            txnType: txnType,
            status: status,
            settlementStatus: settlementStatus,
            //splitPayment: splitPayment,
            //PG:PG
          },
        })
        .then((response) => {
          setData(response.data.data);
          setoverlay_on(false);
          setprogress_on(false);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [
    userData,
    txnType,
    lastNdays,
    fromDate,
    toDate,
    status,
    settlementStatus,
    splitPayment,
    PG,
  ]);

  const addSplitPayment = async () => {
    console.log("Add split payment");
    let sel_iorder = [];
    let iDelivery_Type = "";
    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        sel_iorder.push({
          iOrderBreakup: data[item].iOrderBreakup,
          //iDelivery_Type: data[item].iDelivery_Type
        });
      });

      console.log(sel_iorder);
    } else {
      console.log("Please select atleast one transaction to split");
      return;
    }

    setoverlay_on(true);
    setprogress_on(true);
    let addSplitPaymentData = {
      iOrderBreakup: sel_iorder,
    };
    await axios
      .post(`/mylapay/transaction/add/split-payment`, addSplitPaymentData)
      .then((response) => {
        console.log(response.data.data);
        setoverlay_on(false);
        setprogress_on(false);
      })
      .catch((error) => console.log(error));
  };

  const releaseSplitPayment = async () => {
    console.log("Release split payment");
    let sel_iorder = [];
    let iDelivery_Type = "";
    if (rowsSelectedval.length > 0) {
      rowsSelectedval.filter((item, index) => {
        sel_iorder.push({
          iOrderBreakup: data[item].iOrderBreakup,
          //iDelivery_Type: data[item].iDelivery_Type
        });
      });

      console.log(sel_iorder);
    } else {
      console.log("Please select atleast one transaction to release");
      return;
    }

    setoverlay_on(true);
    setprogress_on(true);
    let releaseSplitPaymentData = {
      iOrderBreakup: sel_iorder,
    };
    await axios
      .post(
        `/mylapay/transaction/release/split-payment`,
        releaseSplitPaymentData
      )
      .then((response) => {
        console.log(response.data.data);
        setoverlay_on(false);
        setprogress_on(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Box
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "0px",
        borderRadius: "4px",
      }}
      m={2}
    >
      <div className={classes.root} style={{ display: "none" }}>
        <Grid container spacing={3}>
          <Grid
            className="common_box"
            item
            xs={12}
            sm={6}
            md={3}
            onClick={(e) => handleMerchantDocs("all")}
          >
            <Paper className={`${classes.paper} box1`}>
              <Box className="left_box" justifyContent="flex-start">
                <div className="cart_outer">
                  <AddShoppingCart
                    style={{ width: "32px", height: "32px", marginTop: "20%" }}
                  />{" "}
                </div>
                <div className="orders">Total Transactions</div>
              </Box>
              <Box className="right_box" justifyContent="flex-end">
                <div className="box_right_top"></div>
                <div className="box_right_bottom">{TxnCount.TOTAL}</div>
              </Box>
            </Paper>
          </Grid>
          <Grid
            className="common_box"
            item
            xs={12}
            sm={6}
            md={3}
            onClick={(e) => handleMerchantDocs(1)}
          >
            <Paper className={`${classes.paper} box2`}>
              <Box className="left_box" justifyContent="flex-start">
                <div className="cart_outer">
                  <AccountCircle
                    style={{ width: "32px", height: "32px", marginTop: "15%" }}
                  />{" "}
                </div>
                <div className="orders">Success Transactions</div>
              </Box>
              <Box className="right_box" justifyContent="flex-end">
                <div className="box_right_top"></div>
                <div className="box_right_bottom">{TxnCount.SUCCESS}</div>
              </Box>
            </Paper>
          </Grid>
          <Grid
            className="common_box"
            item
            xs={12}
            sm={6}
            md={3}
            onClick={(e) => handleMerchantDocs(2)}
          >
            <Paper className={`${classes.paper} box3`}>
              <Box className="left_box" justifyContent="flex-start">
                <div className="cart_outer">
                  <Timeline
                    style={{ width: "32px", height: "32px", marginTop: "15%" }}
                  />{" "}
                </div>
                <div className="orders">Failed Transanctions</div>
              </Box>
              <Box className="right_box" justifyContent="flex-end">
                <div className="box_right_top"></div>
                <div className="box_right_bottom">{TxnCount.FAILED}</div>
              </Box>
            </Paper>
          </Grid>
          <Grid
            className="common_box"
            item
            xs={12}
            sm={6}
            md={3}
            onClick={(e) => handleMerchantDocs(0)}
          >
            <Paper className={`${classes.paper} box4`}>
              <Box className="left_box" justifyContent="flex-start">
                <div className="cart_outer">
                  {" "}
                  <AttachMoney
                    style={{ width: "32px", height: "32px", marginTop: "15%" }}
                  />{" "}
                </div>
                <div className="orders">Pending Transactions</div>
              </Box>
              <Box className="right_box" justifyContent="flex-end">
                <div className="box_right_top"></div>
                <div className="box_right_bottom">{TxnCount.PENDING}</div>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </div>

      {splitPayment === 0 || splitPayment === "0" ? (
        <Button
          onClick={() => {
            addSplitPayment();
          }}
          style={{
            float: "right",
            margin: "20px 25px 2px 21px",
          }}
          variant="contained"
          size="large"
          color="primary"
        >
          Add split payment
        </Button>
      ) : null}
      {splitPayment === 1 || splitPayment === "1" ? (
        <Button
          onClick={() => {
            releaseSplitPayment();
          }}
          style={{
            float: "right",
            margin: "20px 25px 2px 21px",
          }}
          variant="contained"
          size="large"
          color="primary"
        >
          Release split payment
        </Button>
      ) : null}
      <div style={{ marginTop: "20px" }}>
        <MUIDataTable
          className="transanctions-table"
          response="scrollFullHeight"
          title={<TableFilter />}
          data={data}
          columns={payuColumns}
          options={options}
          components={{ icons: { DownloadIcon: SaveAlt } }}
        />
      </div>
      <div
        className={`profitability_progress ${
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
      <div
        className={`overlay ${overlay_on ? "overlay_on" : "overlay_off"}`}
      ></div>
      <Dialog
        style={{ width: "50%", margin: "auto" }}
        fullWidth
        maxWidth="md"
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Enter the refund Amount</Box>
            <Box>
              <IconButton
                onClick={() => {
                  handleDialog(false);
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
             <TextField            
              label="Refund Amount"
              variant="outlined"
              type="number"
              fullWidth
              name="refund_amount"
              value={formik.values.refund_amount}
              onChange={handleRefundAmount}
              error={formik.touched.refund_amount && Boolean(formik.errors.refund_amount)}
              helperText={formik.touched.refund_amount && formik.errors.refund_amount}
            />
            <span style={{color: "#71b1f1",fontSize: "14px"}}>Note: Amount should not exceed the settled amount</span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              refundInitiateConfirm();
            }}
            style={{
              backgroundColor: formik.values.refund_amount === "" || parseFloat(formik.values.refund_amount) <= 0 || parseFloat(formik.values.refund_amount) > transactionAmountResp ? "#dbd7d7" : "orange",
              fontSize: "12px"
            }}
            variant="contained"
            size="medium"
            color="primary"
            endIcon={
                      loading ? (
                        <CircularProgress size={16} />
                      ) : (
                        null
                      )
                    }
            disabled={formik.values.refund_amount === "" || parseFloat(formik.values.refund_amount) <= 0 || parseFloat(formik.values.refund_amount) > transactionAmountResp }
          >
            Initiate
          </Button>  
          <Button onClick={handleDialogClose} color="primary" autoFocus 
            style={{backgroundColor: "#ff5200",color: "white",fontSize: "12px",marginRight: "15px"}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

       <Dialog
        style={{ width: "50%", margin: "auto" }}
        fullWidth
        maxWidth="md"
        open={dialogOpenAfterRefundInitiated}
        onClose={handleDialogCloseAfterRefundInitiated}
      >
        <DialogTitle id="id" style={{}}>
          {refundInitiateMsg}
        </DialogTitle>

        <DialogContent>
             
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCloseAfterRefundInitiated} color="primary" autoFocus 
            style={{backgroundColor: "#10a2e7",color: "white",fontSize: "12px",marginRight: "15px"}}>
            Ok
          </Button> 
          <Button onClick={handleDialogCloseAfterRefundInitiated} color="primary" autoFocus 
            style={{backgroundColor: "#ff5200",color: "white",fontSize: "12px",marginRight: "15px"}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
