import React, { useEffect, useState } from "react";
import styles from "./css/DoughnutChart.module.css";
import Chart from "react-apexcharts";

export default function DoughnutChart({ doughnutData }) {
  console.log(doughnutData);
  const [chartReady, setChartReady] = useState(false);
  const options = {
    legend: {
      position: "right",
    },
    labels: ["New", "Accepted", "In Transit", "Delivered", "Cancelled"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: "Your",
              formatter: () => "Orders",
            },
          },
        },
      },
    },
  };
  // const series = [
  //   doughnutData[4] ? doughnutData[4].cnt : 0,
  //   doughnutData[0] ? doughnutData[0].cnt : 0,
  //   doughnutData[3] ? doughnutData[3].cnt : 0,
  //   doughnutData[2] ? doughnutData[2].cnt : 0,
  //   doughnutData[1] ? doughnutData[1].cnt : 0,
  // ];
  const series = [
    doughnutData[0] ? doughnutData[0].cnt : 0,
    doughnutData[1] ? doughnutData[1].cnt : 0,
    doughnutData[2] ? doughnutData[2].cnt : 0,
    doughnutData[3] ? doughnutData[3].cnt : 0,
    doughnutData[4] ? doughnutData[4].cnt : 0,
  ];

  useEffect(() => {
    setTimeout(() => {
      setChartReady(true);
    }, 1000);
  }, []);

  return (
    <>
      <div className={`${styles.doughnut_wrap} orders-donut-chart`}>
        {chartReady ? (
          <Chart options={options} series={series} type="donut" width="100%" />
        ) : null}
      </div>

      <style>
        {`
          .orders-donut-chart .apexcharts-legend.apx-legend-position-right {
            top: 0px !important;
            right: 1em !importrant;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .orders-donut-chart .apexcharts-pie-label {
            font-size: 1em;
            font-family: inherit !important;
            filter: none;
          }
          .orders-donut-chart .apexcharts-datalabel-label,
          .orders-donut-chart .apexcharts-datalabel-value {
            font-size: 1.5em;
          }
        `}
      </style>
    </>
  );
}
