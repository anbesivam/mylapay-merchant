import { Container } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import axios from "axios";
import AreaChart from "../components/dashboard/AreaChart";
import DoughnutChart from "../components/dashboard/DoughnutChart";
import StatCards from "../components/dashboard/StatCards";
import TopBar from "../components/dashboard/TopBar";
import styles from "./css/Dashboard.module.css";
import { useSelector } from "react-redux";
import TopCustomers from "../components/dashboard-main/top-customers";
import ProductStocks from "../components/dashboard-main/product-stocks";
import Deliveries from "../components/dashboard-main/deliveries";
import moment from "moment";
export default function DashboardV2() {
  const [stateCardData, setStateCardData] = useState();
  const [topBarData, setTopBarData] = useState();
  const [doughnutData, setDoughnutData] = useState();
  const [pendingDeliveries, setPendingDeliveries] = useState();
  const [topCustomers, setTopCustomers] = useState();
  const [lessStockProducts, setLessStockProducts] = useState();
  const [areaChartData, setAreaChartData] = useState();
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());

  const userData = useSelector((state) => state.auth.userData);
  // const handleDaysChange = (e) => {
  //   e.preventDefault();
  //   setLastNdays(e.target.value);
  //   setFromDate(moment().subtract(e.target.value, "days"));
  //   setToDate(moment());
  // };
  useEffect(() => {
    if (userData === null) return;
    getData(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
  const getData = async (fromDate, toDate) => {
    await axios
      .get(`/mylapay/dashboard/v2`, {
        params: {
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        if (res.data.status === 1) {
          //console.log(res.data.data);
          setTopBarData(res.data.data[0].balance);
          setDoughnutData(res.data.data[0].doughnutData);
          setPendingDeliveries(res.data.data[0].pendingDelivery);
          setTopCustomers(res.data.data[0].topCustomers);
          setLessStockProducts(res.data.data[0].lessStockProducts);
          setAreaChartData(res.data.data[0].areaChartData);
          setStateCardData({
            saleBox: res.data.data[0].saleBox,
            pending: res.data.data[0].pending,
            cancelled: res.data.data[0].cancelled,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Container>
        {/* <div style={{ padding: "0 1em" }}> */}
        {topBarData && <TopBar topBarData={topBarData} getData={getData} />}
        {stateCardData && <StatCards stateCardData={stateCardData} />}

        <div className={styles.chart_row}>
          {areaChartData && <AreaChart areaChartData={areaChartData} />}
          {doughnutData && <DoughnutChart doughnutData={doughnutData} />}
        </div>
        {/* </div> */}
      </Container>
      <Container>
        <Deliveries pendingDeliveries={pendingDeliveries} />
      </Container>
      <Container>
        <ProductStocks lessStockProducts={lessStockProducts} />
      </Container>
      <Container>
        <TopCustomers topCustomers={topCustomers} />
      </Container>
    </>
  );
}
