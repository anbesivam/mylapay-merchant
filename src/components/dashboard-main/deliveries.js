import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { SaveAlt } from "@material-ui/icons";
import moment from "moment";

export default function YourCustomers({ pendingDeliveries }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  //console.log(pendingDeliveries);

  const columns = [
    {
      name: "orderDate",
      label: "Order Date",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY");
        },
      },
    },
    {
      name: "item_count",
      label: "Total Orders",
      options: {
        sort: true,
      },
    },

    {
      name: "totalAmount",
      label: "Order Amount",
      options: {
        sort: true,
        customBodyRender: (value) => {
          return "₹" + value;
        },
      },
    },
    {
      name: "Aging",
      label: "Aging",
      options: {
        sort: true,
      },
    },
    {
      name: "Delivery_Type",
      label: "Delivery Type",
      options: {
        sort: true,
      },
    },
  ];
  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    downloadOptions: {
      filename: `Todays_Deliveries_${moment().format("YYYY-MM-DD")}.csv`,
    },  
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
    setLoading(true);
    // const getData = async () => {
    //   await axios
    //     .get("/mylapay/dashboard/deliveries")
    //     .then((response) => {
    //       setData(response.data.data);
    //       setLoading(false);
    //     })
    //     .catch((error) => console.log(error));
    // };

    // getData();
    setData(pendingDeliveries);
    setLoading(false);
  }, [userData, pendingDeliveries]);

  return (
    <Box
      style={{
        // border: "1px solid rgba(0, 0, 0, 0.12)",
        // borderBottom: "0px",
        borderRadius: "4px",
      }}
      my={2}
    >
      <MUIDataTable
        className="top5customers-table"
        response="scrollFullHeight"
        title="Today's Deliveries"
        data={data}
        columns={columns}
        options={options}
        components={{ icons: { DownloadIcon: SaveAlt } }}
      />
    </Box>
  );
}
