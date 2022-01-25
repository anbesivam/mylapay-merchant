import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { SaveAlt } from "@material-ui/icons";
import moment from "moment";

export default function YourCustomers({ lessStockProducts }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  const columns = [
    {
      name: "product_name",
      label: "Product Name",
      options: {
        sort: true,
      },
    },
    {
      name: "prodDescription",
      label: "Description",
      options: {
        sort: true,
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        sort: true,
      },
    },
    {
      name: "stock",
      label: "Available Stock",
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
      filename: `Less_Stock_Products_${moment().format("YYYY-MM-DD")}.csv`,
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

    setData(lessStockProducts);
    setLoading(false);
  }, [userData, lessStockProducts]);

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
        title="Less Stock Products"
        data={data}
        columns={columns}
        options={options}
        components={{ icons: { DownloadIcon: SaveAlt } }}
      />
    </Box>
  );
}
