import React, { useEffect, useState } from "react";
import { Box, InputAdornment, MenuItem, TextField,CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today } from "@material-ui/icons";
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

export default function Index() {
  const [overallOrders, setOverallOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [
    completedOrdersSettlementInProgress,
    setCompletedOrdersSettlementInProgress,
  ] = useState([]);
  const [
    completedOrdersSettlementSettled,
    setCompletedOrdersSettlementSettled,
  ] = useState([]);

  const userData = useSelector((state) => state.auth.userData);

  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const [progress_on, setprogress_on] = useState(false);
  const [overlay_on, setoverlay_on] = useState(false);

  const classesFacebook = useStylesFacebook();

  useEffect(() => {
    if (userData === null) return;
    setoverlay_on(true);
    setprogress_on(true);
    const getData = async () => {
      await axios
        .get("/mylapay/reconciliation/get/payu", {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
          },
        })
        .then((response) => {
          console.log(response.data.data[0]);
          setoverlay_on(false);
          setprogress_on(false);
          if (response.data.data[0].length > 0) {
            let reconciliation = response.data.data[1];
            setOverallOrders(reconciliation[0]);
            setOpenOrders(reconciliation[1]);
            setCompletedOrdersSettlementInProgress(reconciliation[2]);
            setCompletedOrdersSettlementSettled(reconciliation[3]);

          }
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData, lastNdays, fromDate, toDate]);

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

  return (
    <>
      <Box
        style={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "0px",
          borderRadius: "4px",
          backgroundColor: "white",
          padding: "0px 20px 20px 20px",
        }}
        m={2}
      >
        <TableFilter />
        <div style={{ marginTop: "40px" }}>
          <div
            style={{
              backgroundColor: "rgb(175 175 175)",
              height: "37px",
              paddingLeft: "6px",
              paddingTop: "10px",
              paddingRight: "6px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Reconciliation Status
          </div>
          <table id="order_product_details" style={{ borderBottom: "none" }}>
            <tr>
              <th>Order Status</th>
              <th>Count</th>
              <th>Transaction Amount</th>
              <th>Fee / Charges Deductions</th>
              <th>Refund Deductions</th>
              <th>Net Credit Amount</th>
            </tr>
            <tr>
              <td>Overall Orders</td>
              <td>{overallOrders.iOrder}</td>
              <td>{overallOrders.Transactionamount}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Open Orders</td>
              <td>{openOrders.iOrder}</td>
              <td>{openOrders.Transactionamount}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Completed Orders - Settlement in Progress</td>
              <td>{completedOrdersSettlementInProgress.iOrder}</td>
              <td>{completedOrdersSettlementInProgress.Transactionamount}</td>
              <td>
                {completedOrdersSettlementInProgress.Fee_Charges_Deductions}
              </td>
              <td>{completedOrdersSettlementInProgress.Refund_Deductions}</td>
              <td>{completedOrdersSettlementInProgress.Net_Credit_Amount}</td>
            </tr>
            <tr>
              <td>Completed Orders - Settled (Click here for UTR reference)</td>
              <td>{completedOrdersSettlementSettled.iOrder}</td>
              <td>{completedOrdersSettlementSettled.Transactionamount}</td>
              <td>{completedOrdersSettlementSettled.Fee_Charges_Deductions}</td>
              <td>{completedOrdersSettlementSettled.Refund_Deductions}</td>
              <td>{completedOrdersSettlementSettled.Net_Credit_Amount}</td>
            </tr>
            <tr>
              <td>Differences</td>
              <td>
                {overallOrders.iOrder -
                  (openOrders.iOrder +
                    completedOrdersSettlementInProgress.iOrder +
                    completedOrdersSettlementSettled.iOrder)}
              </td>
              <td>
                {Math.round(
                  (overallOrders.Transactionamount -
                    openOrders.Transactionamount -
                    completedOrdersSettlementInProgress.Transactionamount -
                    completedOrdersSettlementSettled.Transactionamount) *
                    100
                ) / 100}
              </td>
              <td></td>
              <td></td>
              <td></td>
              {/*
                <td>{overallOrders.Refund_Deductions - (openOrders.Refund_Deductions + completedOrdersSettlementInProgress.Refund_Deductions + completedOrdersSettlementSettled.Refund_Deductions)}</td>
                <td>{Math.round((overallOrders.Net_Credit_Amount - (openOrders.Net_Credit_Amount + completedOrdersSettlementInProgress.Net_Credit_Amount + completedOrdersSettlementSettled.Net_Credit_Amount)) * 100) / 100}</td>
              */}
            </tr>
          </table>
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
    </>
  );
}
