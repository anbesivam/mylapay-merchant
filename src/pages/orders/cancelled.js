import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, InputAdornment, MenuItem, TextField } from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";
import { useHistory } from "react-router";
import UserAction from "../../components/transanctions/UserAction";

export default function Cancelled() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const history = useHistory();

  const columns = [
    {
      name: "orderId",
      label: "Order ID",
      options: {
        sort: true,
      },
    },
    {
      name: "Order_Time",
      label: "Order Time",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm A");
        },
      },
    },
    {
      name: "orderTotal",
      label: "Amount",
      options: {
        sort: true,
      },
    },
    {
      name: "iOrder",
      label: "Cust Ref ID",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "customerName",
      label: "Customer Name",
      options: {
        sort: true,
      },
    },
    // {
    //   name: "orderStatus",
    //   label: "Order Status",
    //   options: {
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return <MyBadge badgeText={value} />;
    //     },
    //   },
    // },
    // {
    //   name: "User Action",
    //   label: "User Action",
    //   options: {
    //     sort: false,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return <UserAction value={value} />;
    //     },
    //   },
    // },
  ];

  const customSelect = () => <span></span>;

  const handleDaysChange = (e) => {
    e.preventDefault();
    setLastNdays(e.target.value);
    setFromDate(moment().subtract(e.target.value, "days"));
    setToDate(moment());
  };

  const handleRowClick = (rowData, rowMeta) => {
    history.push(`/orders/transitvieworder?id=${rowData[3]}&orderStatus=5`);
  };

  const TableFilter = () => {
    return (
      <Box py={2} display="flex">
        <Box maxWidth="160px">
          <DatePicker
            label="From"
            variant="inline"
            inputVariant="outlined"
            format="DD MMM YYYY"
            autoOk={true}
            value={fromDate}
            onChange={setFromDate}
            size="small"
            disableFuture
            maxDate={toDate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Today />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box maxWidth="160px" ml={2}>
          <DatePicker
            label="To"
            variant="inline"
            inputVariant="outlined"
            format="DD MMM YYYY"
            autoOk={true}
            value={toDate}
            onChange={setToDate}
            size="small"
            disableFuture
            minDate={fromDate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Today />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box ml={2}>
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
      </Box>
    );
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    downloadOptions: {
      filename: `Cancelled_Orders_${moment().format("YYYY-MM-DD")}.csv`,
    },
    viewColumns: false,
    print: false,
    elevation: 0,
    onRowClick: handleRowClick,
    selectableRows: false,
    customToolbarSelect: customSelect,
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
    },
  };

  useEffect(() => {
    if (userData === null) return;

    const getData = async () => {
      await axios
        .get("/mylapay/orders/get", {
          params: {
            fromDate: moment(fromDate).format("YYYY-MM-DD"),
            toDate: moment(toDate).format("YYYY-MM-DD"),
            paymentStatus: "1",
            orderTracker: 5,
          },
        })
        .then((response) => {
          setData(response.data.data);
          // setLoading(false);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData, lastNdays, fromDate, toDate]);

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
        title={<TableFilter />}
        data={data}
        columns={columns}
        options={options}
        components={{ icons: { DownloadIcon: SaveAlt } }}
      />
    </Box>
  );
}
