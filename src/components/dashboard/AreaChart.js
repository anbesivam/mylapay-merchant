import { MenuItem, TextField, Typography } from "@material-ui/core";
import React from "react";
import Chart from "react-apexcharts";
import styles from "./css/AreaChart.module.css";

export default function AreaChart({ areaChartData }) {
  const options = {
    chart: {
      type: "area",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    // title: {
    //   text: "test",
    //   align: "left",
    // },
    // subtitle: {
    //   text: "Price Movements",
    //   align: "left",
    // },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      opposite: true,
    },
    legend: {
      horizontalAlign: "left",
    },
  };
  const series = [
    {
      data: areaChartData,
    },
  ];

  return (
    <>
      <div className={`${styles.area_wrap} orders-area-chart`}>
        {/* <div className={styles.header_wrap}>
          <Typography variant="h6">Transanction details</Typography>
          <TextField
            variant="outlined"
            size="small"
            value="days"
            select
            fullWidth
            style={{ whiteSpace: "nowrap" }}
            // onChange={(e) => handleDaysChange(e)}
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
            <MenuItem value="days">Days</MenuItem>
            <MenuItem value="weeks">Weeks</MenuItem>
            <MenuItem value="months">Months</MenuItem>
          </TextField>
        </div> */}
        <Chart options={options} series={series} type="area" width="100%" />
      </div>
    </>
  );
}
