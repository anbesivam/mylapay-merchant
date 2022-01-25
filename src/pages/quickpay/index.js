import { Box, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Quickpay() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const { REACT_APP_SHOP_URL } = process.env;

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("/mylapay/shop/quick_pay")
        .then((res) => {
          setData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getData();
  }, [userData]);

  const options = {
    filter: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: "none",
    download: false,
    customToolbar: () => (
      <Button
        component={Link}
        to="/quickpay/new"
        style={{ marginLeft: "1em" }}
        variant="contained"
        color="primary"
        endIcon={<Add />}
      >
        Create New
      </Button>
    ),
  };
  const columns = [
    {
      name: "iQuickPay",
      label: "Id",
      options: {
        sort: true,
      },
    },
    {
      name: "CreatedDate",
      label: "Creation Date",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
        },
      },
    },
    {
      name: "amount",
      label: "Amount",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => "₹" + value,
      },
    },
    {
      name: "reason",
      label: "Reason",
      options: {
        sort: true,
      },
    },
    {
      name: "quickPayId",
      label: "Quickpay Link",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <a
            className="mp-link"
            href={`${REACT_APP_SHOP_URL}/quickpay/${value}`}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        ),
      },
    },
  ];
  return (
    <Box m={2}>
      <MUIDataTable
        response="scrollFullHeight"
        data={data}
        disabled="true"
        title="Quickpay Links"
        columns={columns}
        options={options}
      />
    </Box>
  );
}
