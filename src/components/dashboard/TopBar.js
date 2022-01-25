import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Today } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import styles from "./css/TopBar.module.css";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
export default function TopBar({ topBarData, getData }) {
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const userData = useSelector((state) => state.auth.userData);

  const handleDaysChange = (e) => {
    e.preventDefault();
    setLastNdays(e.target.value);
    setFromDate(moment().subtract(e.target.value, "days"));
    setToDate(moment());
  };

  useEffect(() => {
    if (userData === null) return;
    getData(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, lastNdays, fromDate, toDate]);
  // const getData = async () => {
  //   await axios
  //     .get(`/mylapay/dashboard/v2`, {
  //       params: {
  //         fromDate: moment(fromDate).format("YYYY-MM-DD"),
  //         toDate: moment(toDate).format("YYYY-MM-DD"),
  //       },
  //     })
  //     .then((res) => {
  //       if (res.data.status === 1) {
  //         //console.log(res.data.data);
  //         setTopBarData(res.data.data[0].balance);

  //         setDoughnutData(res.data.data[0].doughnutData);
  //         setPendingDeliveries(res.data.data[0].pendingDelivery);
  //         setTopCustomers(res.data.data[0].topCustomers);
  //         setLessStockProducts(res.data.data[0].lessStockProducts);
  //         setStateCardData({
  //           saleBox: res.data.data[0].saleBox,
  //           pending: res.data.data[0].pending,
  //           cancelled: res.data.data[0].cancelled,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <>
      <div className={styles.topbar}>
        <Box className={styles.filterWrap}>
          <DatePicker
            label="From"
            variant="inline"
            inputVariant="outlined"
            format="DD MMM YYYY"
            autoOk={true}
            value={fromDate}
            onChange={setFromDate}
            maxDate={toDate}
            size="small"
            fullWidth
            disableFuture
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Today />
                </InputAdornment>
              ),
            }}
          />
          <DatePicker
            label="To"
            variant="inline"
            inputVariant="outlined"
            format="DD MMM YYYY"
            autoOk={true}
            value={toDate}
            onChange={setToDate}
            minDate={fromDate}
            size="small"
            fullWidth
            disableFuture
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Today />
                </InputAdornment>
              ),
            }}
          />
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
        {topBarData && (
          <div className={styles.balanceWrap}>
            <div className={styles.balText}>
              <Typography
                color="textSecondary"
                variant="body1"
                style={{ lineHeight: "1" }}
              >
                Your Current Balance
              </Typography>
              <Typography color="textSecondary" variant="caption">
                Amt to be settled in your account
              </Typography>
            </div>
            <div className={styles.balAmt}>
              <Typography variant="h6">
                {"₹" +
                  (
                    topBarData[0].Txn_amount_sale -
                    topBarData[0].Total_deductions -
                    topBarData[0].Txn_amount_refund
                  ).toFixed()}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
