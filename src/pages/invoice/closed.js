import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Button,
} from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt, Receipt } from "@material-ui/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import UserAction from "../../components/transanctions/UserAction";
import GenerateInvoice from "./generate-invoice";
import toast from "react-hot-toast";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  top: {
    color: "#1a90ff",
    animationDuration: "550ms",
    position: "absolute",
    left: 0,
  },
  circle: {
    strokeLinecap: "round",
  },
}));

export default function Closed() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const [pageData, setPageData] = useState(null);
  const [taxes, setTaxes] = useState(0);
  const [shipingMode, setShipingMode] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [shopAddress, setShopAddress] = useState(null);
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [overlay_on, setoverlay_on] = useState(false);
  const [progress_on, setprogress_on] = useState(false);

  const classes = useStylesFacebook();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const columns = [
    {
      name: "iOrder",
      label: "iOrder",
      options: {
        sort: true,
      },
    },
    {
      name: "orderId",
      label: "Order ID",
      options: {
        sort: true,
      },
    },
    {
      name: "Order_Time",
      label: "Order Date",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
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
      name: "customerName",
      label: "Customer Name",
      options: {
        sort: true,
      },
    },
    {
      name: "invoice",
      label: "Invoice",
      options: {
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          //console.log(tableMeta.rowData[0]);
          return (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => viewInvoice(tableMeta.rowData[0])}
              style={{ color: "#fff" }}
              endIcon={<Receipt />}
            >
              View Invoice
            </Button>
          );
        },
      },
    },
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

  const getData = async (iOrder) => {
    await axios
      .get(`/mylapay/orders/get/${iOrder}?orderStatus=4`)
      .then((response) => {
        if (response.data && response.data.message.length > 0) {
          getCustomerAddress(
            response.data.message[0].email,
            response.data.message[0].phone,
            response.data.message[0].shopId,
            response.data.message[0],
            iOrder
          );
          getShopAddress(response.data.message[0].shopId);
        }
      })
      .catch((error) => {
        if (!isAuthenticated) return;
        toast(`❌ Something went wrong. Please try again.`);
        console.log(error);
      });
  };

  const getCustomerAddress = async (
    email,
    phone,
    shopId,
    pageDataTemp,
    iOrder
  ) => {
    await axios
      .post("/mylapay/customer/address", {
        // email: email,
        // phone: phone,
        iOrder: iOrder,
      })
      .then((response) => {
        //console.log(response);
        if (response.data.success) {
          let customerAddressTemp = `${response.data.data[0].Building_No},${response.data.data[0].Street_Name},${response.data.data[0].Landmark}`;
          // setCustomerAddress(customerAddress);
          let customerAddress = {
            address: customerAddressTemp,
            city: `${response.data.data[0].City} -${response.data.data[0].Pincode}`,
          };
          //console.log(customerAddress);
          getDeliveryCharges(shopId, customerAddress, pageDataTemp, iOrder);
        } else {
          toast(`❌  Error while fetching Customer Address.`);
        }
      })
      .catch((error) => {
        toast("❌ Something went wrong, Please try again");
      });
  };

  const getShopAddress = async (shopId) => {
    await axios
      .get("/mylapay/shop/shop_address?iShop=" + shopId)
      .then((response) => {
        if (response.data.status) {
          setShopAddress(response.data.message[0]);
        } else {
          toast(`❌  Error while fetching Shop Address.`);
        }
      })
      .catch((error) => {
        toast("❌ Something went wrong, Please try again");
      });
  };

  const getDeliveryCharges1 = async (
    shopId,
    customerAddress,
    pageDataTemp,
    iOrder
  ) => {
    await axios
      .post("/mylapay/orders/delivery-charges", {
        iShop: shopId,
        iOrder: iOrder,
      })
      .then((response) => {
        //console.log(response);
        if (response.data.success) {
          let deliveryCharges = response.data.data;
          setDeliveryCharges(deliveryCharges);
          setCustomerAddress(customerAddress);
          setShipingMode(response.data.shipingMode);
          setPageData(pageDataTemp);
          setTaxes(0); // Need to change in future product GST Based
          //console.log(deliveryCharges);
          setoverlay_on(false);
          setprogress_on(false);
          setShowInvoice(true);
        } else {
          toast(`❌  Error while fetching Delivery Charges.`);
        }
      })
      .catch((error) => {
        toast("❌ Something went wrong, Please try again");
      });
  };
  const getDeliveryCharges = async (
    shopId,
    customerAddress,
    pageDataTemp,
    iOrder
  ) => {
    await axios
      .get("/mylapay/orders/invoice?iOrder=" + iOrder + "")
      .then((response) => {
        //console.log(response);
        if (response.data.success) {
          let deliveryCharges = response.data.data;
          setDeliveryCharges(deliveryCharges);
          setCustomerAddress(customerAddress);
          setShipingMode(response.data.shipingMode);
          setPageData(pageDataTemp);

          setTaxes(0); // Need to change in future product GST Based
          //console.log(deliveryCharges);
          setoverlay_on(false);
          setprogress_on(false);
          setShowInvoice(true);
        } else {
          toast(`❌  Error while fetching Delivery Charges.`);
        }
      })
      .catch((error) => {
        toast("❌ Something went wrong, Please try again");
      });
  };

  const viewInvoice = (iOrderInvoice) => {
    setoverlay_on(true);
    setprogress_on(true);
    getData(iOrderInvoice);
    // setShowInvoice(true);
  };
  const invoiceOpen = (boolean) => {
    setShowInvoice(boolean);
  };
  const customSelect = () => <span></span>;

  const handleDaysChange = (e) => {
    e.preventDefault();
    setLastNdays(e.target.value);
    setFromDate(moment().subtract(e.target.value, "days"));
    setToDate(moment());
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
    viewColumns: false,
    print: false,
    elevation: 0,
    customToolbarSelect: customSelect,
    selectableRows: "none",
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
            paymentStatus: 1,
            orderTracker: 4,
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
      {pageData ? (
        <GenerateInvoice
          pageData={pageData}
          customerAddress={customerAddress}
          shopAddress={shopAddress}
          deliveryCharges={deliveryCharges}
          shipingMode={shipingMode}
          showInvoice={showInvoice}
          invoiceOpen={invoiceOpen}
          taxes={taxes}
        />
      ) : null}

      <div
        className={`profitability_progress ${
          progress_on ? "progress_on" : "progress_off"
        }`}
      >
        <CircularProgress
          variant="indeterminate"
          disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle,
          }}
          size={40}
          thickness={4}
        />
      </div>
      <div
        className={`overlay ${overlay_on ? "overlay_on" : "overlay_off"}`}
      ></div>
    </Box>
  );
}
