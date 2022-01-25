import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";

import Closed from "./closed";

export default function Invoice() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");

  /* Tab concept starts here */

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 3:
        return <Closed />;

      default:
        return <Closed />;
    }
  };

  /* Tab concept ends here */

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    viewColumns: false,
    print: false,
    elevation: 0,
    sortOrder: {
      name: "orderDate",
      direction: "desc",
    },
    selectableRows: "none",
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
      body: {
        noMatch: loading ? (
          <CircularProgress />
        ) : (
          "Sorry, no matching records found"
        ),
      },
    },
  };

  // const getData = async () => {
  //   await axios
  //     .get("/mylapay/transaction/get/orders")
  //     .then((response) => {
  //       setData(response.data.message);
  //       setLoading(false);
  //     })
  //     .catch((error) => console.log(error));
  // };
  // useEffect(() => {
  //   if (userData === null) return;
  //   getData();
  // }, [userData]);

  return <>{getTabContent()}</>;
}
