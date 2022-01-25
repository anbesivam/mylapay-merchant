import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { SaveAlt } from "@material-ui/icons";
//import moment from "moment";
///import { Button } from "@material-ui/core";
//import { Link } from "react-router-dom";

export default function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  const columns = [
    {
      name: "customerName",
      label: "Customer Name",
      options: {
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        sort: true,
      },
    },
    {
      name: "phone",
      label: "Phone",
      options: {
        sort: true,
      },
    },
    {
      name: "totalAmount",
      label: "Total Amount",
      options: {
        sort: true,
        customBodyRender: (value) => {
          return "₹" + value;
        },
      },
    },
    {
      name: "totalOrders",
      label: "Total Orders",
      options: {
        sort: true
      },
    }
  ];

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

  useEffect(() => {
    if (userData === null) return;

    const getData = async () => {
      await axios
        .get("/mylapay/transaction/get/customer_list")
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData]);

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
        title="Orders"
        data={data}
        columns={columns}
        options={options}
        components={{ icons: { DownloadIcon: SaveAlt } }}
      />
    </Box>
  );
}
