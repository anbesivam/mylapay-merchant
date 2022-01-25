import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";
import UserAction from "../../components/transanctions/UserAction";

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

export default function Refunds() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  // const [txnType, setTxnType] = useState("all");
  const [txnType, setTxnType] = useState("2");
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

  const [overlay_on, setoverlay_on] = useState(false);
  const [progress_on, setprogress_on] = useState(false);

  const classes = useStyles();
  const classesFacebook = useStylesFacebook();

  const history = useHistory();

  let payuColumns = [
    {
      name: "ORDERNO",
      label: "iOrder",
      options: {
        sort: true,
        display: "none",
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
      name: "isRefunded",
      label: "Refund Status",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log(value);
          return value.data[0] == 1 ? "Refunded" : "Not Refunded";
        },
      },
    },
    {
      name: "Refund_Time",
      label: "Refunded Time",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
        },
      },
    },
    {
      name: "Pgname",
      label: "PG Name",
      options: {
        sort: true,
      },
    },
    {
      name: "Shipment_Type",
      label: "Shipment Type",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === 1) return "Delivery";
          else if (value === 2) return "Self Pickup";
          else if (value === 3) return "Dunzo";
          else return "Self Pickup";
        },
      },
    },
    {
      name: "txnamount",
      label: "Txn Amount (₹)",
      options: {
        sort: true,
      },
    },
    {
      name: "MERC_deductions",
      label: "MERC Deductions (₹)",
      options: {
        sort: true,
      },
    },
  ];

  const customSelect = () => <span></span>;

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

        <Box minWidth="120px" ml={2}>
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
        </Box>
      </Box>
    );
  };

  const handleRowClick = (rowData, rowMeta) => {
    console.log(rowData);
    history.push(`/transactions/refund/view?id=${rowData[0]}`);
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    viewColumns: false,
    print: false,
    elevation: 0,
    onRowClick: handleRowClick,
    selectableRows: false,
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

    const getData = async () => {
      await axios
        .get("/mylapay/transaction/get/transactions/payu", {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            txnType: txnType,
            PG: PG,
          },
        })
        .then((response) => {
          setData(response.data.data);

          // axios
          // .get("/mylapay/transaction/get/transactions-count")
          // .then((response) => {
          //   let tempCount = {
          //    "TOTAL":  response.data.data[0].txn_count + response.data.data[1].txn_count + response.data.data[2].txn_count + response.data.data[3].txn_count,
          //    "PENDING": response.data.data[0].txn_count,
          //    "TIME_OUT": response.data.data[1].txn_count,
          //    "SUCCESS": response.data.data[2].txn_count,
          //    "FAILED": response.data.data[3].txn_count,
          //   }
          //   setTxnCount(tempCount)
          //   console.log(response.data.data);
          // })
          // .catch((error) => console.log(error));

          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData, txnType, lastNdays, fromDate, toDate, PG]);

  return (
    <Box
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "0px",
        borderRadius: "4px",
      }}
      m={2}
    >
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
    </Box>
  );
}
