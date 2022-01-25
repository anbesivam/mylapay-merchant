import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Chip,
  CircularProgress
} from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";
import { makeStyles, withStyles } from "@material-ui/core/styles";

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

export default function Payouts() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [txnType, setTxnType] = useState("all");
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const [progress_on, setprogress_on] = useState(false);
  const [overlay_on, setoverlay_on] = useState(false);
  const { REACT_APP_MERCHANT_URL } = process.env;
  const classesFacebook = useStylesFacebook();
  const handlePayoutBreakView = (data) => {
    console.log(data);
    let temp = JSON.stringify(data);
    localStorage.setItem("settlement", temp);
    // window.open(`http://localhost:3000/superadmin-payouts/breakup?id=${data[1]}`);
    window.open(`${REACT_APP_MERCHANT_URL}/settlements/breakup?id=${data[1]}`);
    //window.open(`http://localhost:3000/settlements/breakup?id=${data[1]}`);
  };

  const columns = [
    {
      name: "Merchant_Settlement_Date",
      label: "Settlement Time",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(value).format("MMM Do YYYY, h:mm:ss a");
        },
      },
    },
    {
      name: "Merchant_Settlement_UTR",
      label: "UTR Number",
      options: {
        sort: true,
      },
    },
    {
      name: "Order_count",
      label: "Sale Count",
      options: {
        sort: true,
      },
    },
    {
      name: "Transaction_Amount",
      label: "Transactions Amount (₹)",
      options: {
        sort: true,
        display: "none",
      },
    },
    {
      name: "Total_Deductions",
      label: "Fee / Charges Deductions (₹)",
      options: {
        sort: true,
        display: "none",
      },
    },
    {
      name: "Refund_Deductions",
      label: "Refund Deductions (₹)",
      options: {
        sort: true,
        display: "none",
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? value : "-";
        },
      },
    },
    {
      name: "Refund_count",
      label: "Refund Count",
      options: {
        sort: true,
      },
    },
    {
      name: "Merchant_Settlement_Amount",
      label: "Net Credit Amount (₹)",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log(value);
          console.log(tableMeta.rowData[5]);
          let temp = value - (tableMeta.rowData[5] ? tableMeta.rowData[5] : 0);
          return Math.round(temp * 100) / 100;
        },
      },
    },
    {
      name: "Breakup",
      label: "Breakup",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log(tableMeta.rowData);
          return (
            <Tooltip title="Click here to view Breakup">
              <Chip
                label="Breakup"
                clickable
                onClick={() => {
                  handlePayoutBreakView(tableMeta.rowData);
                }}
                style={{
                  color: "#fff",
                  borderRadius: "3px",
                  backgroundColor: "rgb(33 150 243)",
                  backgroundColor: "#FFA500",
                }}
              />
            </Tooltip>
          );
        },
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
      <>
        <h3>Payouts</h3>
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
      </>
    );
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: false,
    customToolbarSelect: customSelect,
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
    const getData = async () => {
      await axios
        .get("/mylapay/payouts/get/payu", {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            txnType: txnType,
          },
        })
        .then((response) => {
          setData(response.data.data);
          setoverlay_on(false);
          setprogress_on(false);
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData, txnType, lastNdays, fromDate, toDate]);

  return (
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
