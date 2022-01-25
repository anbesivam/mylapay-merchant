import {
  AppBar,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";
import MUIDataTable from "mui-datatables";
import moment from "moment";

export default function FullScreenOrders({
  fsoOpen,
  setFsoOpen,
  cusOrderData,
}) {
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const columns = [
    {
      name: "product_image",
      label: "Product Image",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <img
              src={REACT_APP_SHOPAPI_URL + "/uploads" + value}
              alt="Product"
              height="100"
              width="100"
            />
          );
        },
      },
    },
    {
      name: "item",
      label: "Product Name",
      options: {
        sort: true,
      },
    },
    {
      name: "shop_name",
      label: "Shop Name",
      options: {
        sort: true,
      },
    },
    {
      name: "Amount",
      label: "Amount",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return "₹" + value;
        },
      },
    },
    {
      name: "quantity",
      label: "Quantity",
      options: {
        sort: false,
      },
    },
    {
      name: "orderDate",
      label: "Order Date",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
        },
      },
    },
    {
      name: "orderDate",
      label: "Deliver on",
      options: {
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return "";
        },
      },
    },
    {
      name: "orderDate",
      label: "Return Policy",
      options: {
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return "";
        },
      },
    },
  ];

  // MUI-Datatable Options
  const options = {
    filter: false,
    viewColumns: false,
    search: false,
    print: false,
    elevation: 0,
    download: false,
    selectableRows: "none",
    tableBodyMaxHeight: "calc(100vh - 117px)",
  };

  return (
    <Dialog onClose={() => setFsoOpen(false)} fullScreen open={fsoOpen}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Your Orders</Typography>
          <IconButton
            style={{ marginLeft: "auto" }}
            edge="end"
            color="inherit"
            onClick={() => setFsoOpen(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>

      <MUIDataTable
        className="customer-order-table"
        response="scrollFullHeight"
        data={cusOrderData}
        columns={columns}
        options={options}
      />
    </Dialog>
  );
}
