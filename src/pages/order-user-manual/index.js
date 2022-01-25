import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  InputAdornment,
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { CropFree, Today } from "@material-ui/icons";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import copy from "copy-to-clipboard";

import ShareIcon from "@material-ui/icons/Share";

import TemplateCards from "../../components/payment-pages/TemplateCards";
import SharePopup from "../../components/payment-pages/SharePopup";
import Swal from "sweetalert2";
import { DatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import moment from "moment";

export default function OrderUserManual() {
  const [data, setData] = useState([]);
  const [shopUrl, setshopUrl] = useState("");
  const [iShop, setiShop] = useState("");
  const [shopName, setShopName] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(0);

  const [dialogOpenSchedule, setDialogOpenSchedule] = React.useState(false);
  const [fromDate, setFromDate] = useState(moment());
  let dateFormated = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  console.log(dateFormated);
  const [dateFormatted, setDateFormatted] = useState(dateFormated);

  const [selectedFromTime, setSelectedFromTime] = useState(new Date());
  const [selectedToTime, setSelectedToTime] = useState(new Date());

  let timeFormated = moment(new Date()).format("hh:mm A");
  console.log(timeFormated);

  const [fromTime, setFromTime] = useState(timeFormated);
  const [toTime, setToTime] = useState(timeFormated);

  const { REACT_APP_SHOP_URL } = process.env;

  useEffect(() => {
    const getShopList = async () => {
      await axios
        .get("/mylapay/transaction/shop/list")
        .then((res) => {
          setData(res.data.data);
          setiShop(res.data.data[0].id);
          setShopOpen(res.data.data[0].isOpen);
          setshopUrl(res.data.data[0].url_name);
          setShopName(res.data.data[0].shop_name);
          localStorage.setItem("category", res.data.data[0].category);
          localStorage.setItem("MCC_Code", res.data.data[0].MCC_Code);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getShopList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const copyToClipboard = () => {
    copy(`${REACT_APP_SHOP_URL}/${shopUrl}/${data[0].Template_Url}`);
  };

  const handleDialogScheduleClose = () => {
    setDialogOpenSchedule(false);
  };

  const handleDialogScheduleConfirm = () => {
    console.log("schedule confirm");
    setDialogOpenSchedule(false);
    console.log(dateFormatted);
    console.log(fromTime);
    console.log(toTime);
    axios
      .post(`/mylapay/shop/next-open`, {
        iShop: iShop,
        isOpen: 0,
        nextOpenDate: dateFormatted,
        fromTime: fromTime,
        toTime: toTime,
      })
      .then((res) => {
        console.log(res);

        if (res.data.status === 1) {
          setShopOpen(0);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
        //setprogress_on(false);
        //setoverlay_on(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePreferredDate = (date) => {
    console.log(date);
    let dateFormatedTemp = moment(date).format("YYYY-MM-DD HH:mm:ss");
    console.log(dateFormatedTemp);
    setDateFormatted(dateFormatedTemp);
    setFromDate(date);
  };

  const handleFromTimeChange = (date) => {
    console.log(date);
    let timeFormated = moment(date).format("hh:mm A");
    console.log(timeFormated);
    setSelectedFromTime(date);
    setFromTime(timeFormated);
  };

  const handleToTimeChange = (date, day) => {
    console.log(date);
    console.log(day);
    let timeFormated = moment(date).format("hh:mm A");
    console.log(timeFormated);
    setSelectedToTime(date);
    setToTime(timeFormated);
  };

  const handleChangeShopOpenClose = (event) => {
    console.log("event click :" + event.target.checked);
    let shopID = iShop;
    console.log(shopID);
    if (event.target.checked) {
      setShopOpen(1);
      axios
        .get(
          `/mylapay/shop/open-close?iShop=${shopID}&isOpen=${event.target.checked}`
        )
        .then((res) => {
          console.log(res);

          if (res.data.status === 1) {
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
          //setprogress_on(false);
          //setoverlay_on(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //setShopOpen(0);
      setDialogOpenSchedule(true);
    }
  };

  const options = {
    filter: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    search: false,
    selectableRows: "none",
    pagination: false,
    download: false,
    rowsPerPageOptions: [],
  };
  const columns = [
    {
      name: "MID",
      label: "Merchant ID",
      options: {
        sort: true,
      },
    },
    {
      name: "category",
      label: "Merchant Business Category",
      options: {
        sort: true,
      },
    },
    {
      name: "businessName",
      label: "Business Name",
      options: {
        sort: true,
      },
    },
    {
      name: "Template_Url",
      label: "Shop URL",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "url_name",
      label: "Shop URL",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) =>
          tableMeta.rowData[3] != null ? (
            <a
              className="mp-link"
              href={`${REACT_APP_SHOP_URL}/${value}/${data[0].Template_Url}`}
              target="_blank"
              rel="noreferrer"
            >
              {value}
            </a>
          ) : (
            <a
              className="mp-link"
              href={`${REACT_APP_SHOP_URL}/${value}/${data[0].Template_Url}`}
              target="_blank"
              rel="noreferrer"
            >
              {value}
            </a>
          ),
      },
    },
    {
      name: "Share",
      label: "Share URL",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return shopUrl ? (
            <>
              <Button
                variant="contained"
                size="small"
                color="primary"
                startIcon={<ShareIcon color="secondary" />}
                onClick={() => setSharePopupOpen(true)}
              >
                Share URL
              </Button>
              <SharePopup
                sharePopupOpen={sharePopupOpen}
                setSharePopupOpen={setSharePopupOpen}
                shopName={shopName}
                shopUrl={shopUrl}
                Template_Name={data[0].Template_Url}
              />
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              color="primary"
              disabled
              startIcon={<ShareIcon color="secondary" />}
              onClick={() => setSharePopupOpen(true)}
            >
              Share URL
            </Button>
          );
        },
      },
    },
    {
      name: "",
      label: "",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return shopUrl ? (
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<FileCopyIcon color="secondary" />}
              onClick={copyToClipboard}
            >
              Copy URL
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              color="primary"
              disabled={true}
              startIcon={<FileCopyIcon color="secondary" />}
              onClick={copyToClipboard}
            >
              Copy URL
            </Button>
          );
        },
      },
    },
    {
      name: "url_name",
      label: "Payment QR",
      options: {
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              component={Link}
              to={"/shop/qr?Qr=PaymentQr"}
              style={{ color: "#fff" }}
              endIcon={<CropFree />}
            >
              Generate QR
            </Button>
          );
        },
      },
    },
    {
      name: "url_name",
      label: "Shop QR",
      options: {
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return shopUrl ? (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              component={Link}
              to={"/shop/qr?Qr=shopQr&id=" + iShop}
              style={{ color: "#fff" }}
              endIcon={<CropFree />}
            >
              Generate QR
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              component={Link}
              disabled
              to={"/shop/qr?Qr=shopQr&id=" + iShop}
              style={{ color: "#fff" }}
              endIcon={<CropFree />}
            >
              Generate QR
            </Button>
          );
        },
      },
    },
  ];
  return (
    <>
      <Box m={2}>

      <h2>Order User Manual</h2>

      <p><strong>How to Manage your orders? </strong></p>
      <p>Orders menu in your dashboard will allow you to view, cancel or accept the orders and initiate for shipment through Mylapay’s integrated shipment facility.</p>

      <h2><p><strong>Step 1 (New Orders Tab):</strong></p></h2>
      <p>Every new incoming orders will be displayed in the New Orders Tab, where u can check the order details, order delivery type, products view, customer name, amount of the order.</p>

      <p>In case of any product stock is not available from the order, u can select that particular product to cancel from the order by providing valid reason.</p>

      <p>The Order will be automatically cancelled If the order is not accepted within the TAT time configured in the online store management menu {'->'} shipment details.</p>

      <p>You can now start preparing the order and pack it.</p>

      <p><strong>Contact Us Section – </strong> Your shop address, email id and phone number is auto updated from your profile information which you can edit.</p>

      <h2><p><strong>Step 2 (Accepted Orders Tab):</strong></p></h2>
      <p>Accepted orders tab will have 3 simple steps to manage the order and arrange shipment.</p>
      <p><strong>Product details: </strong> You can still cancel a product from the order or the entire order with valid reason (cancellation charges is applicable if the order is cancelled after accepting) which will notify your customer on the cancellation. </p>
      <p>Click next button to proceed for shipment initiation.</p>

      <p><strong>Shipment Details: </strong> If the delivery type of the order is - <strong>Delivery </strong></p>
      <p>(You can choose the shipment option from the drop-down list)</p>

      <p><strong>Options: 1. Courier Shipment, 2. Door delivery. </strong> </p>
      <p>If you prefer to choose Door Delivery option</p>
      <p>Click view customer details and check for customer address to check on distance feasibility for delivery. If you prefer to proceed, enter the deliver person’s name and contact information and click the confirm shipment button and you will get confirmation popup</p>
      <p>If you prefer to choose Courier Shipment option</p>
      <p>1)	Once your order is ready and packed for pickup, Click “Order ready for pickup” button </p>
      <p>2)	choose and select the shipment “Shiprocket” option</p>
      <p>3)	provide package dimension details and click “select courier” button</p>
      <p>4)	select the courier options available in the list and click “confirm shipment” button</p>
      <p>5)	You can generate manifest (courier acknowledgement) and print it and paste it on the package which will be picked up by the courier agency for delivery.</p>
      <p>6)	With that, your shipment is initiated, and the order will be moved to “Transit” tab</p>
      < br/>

      <p><strong>3. </strong>If the delivery type of the order is - <strong>Store Self Pickup</strong> </p>
      <p>(Customer can direct visit your shop to pick up the order)</p>
      <p>1)	Once your order is ready and packed for pickup, Click “Order ready for pickup” button </p>
      <p>2)	Click “confirm shipment” button which will initiate a SMS notification to the customer to pick up the order.</p>
      <p>3)	With that, your shipment is initiated, and the order will be moved to “Transit” tab</p>
      < br/>
      <p><strong>4. </strong>If the delivery type of the order is - <strong>Dunzo Pickup</strong> </p>
      <p>(Customer has an option to initiate the order pick up through dunzo)</p>
      <p>1)	Once your order is ready and packed for pickup, Click “Order ready for pickup” button </p>
      <p>2)	Click “confirm shipment” button which will initiate a pickup request to dunzo.</p>
      <p>3)	With that, your shipment is initiated, and the order will be moved to “Transit” tab</p>


      <h2><p><strong>Step 3 (Transit Tab):</strong></p></h2>
      <p>Orders in transit will be listed in the “Transit Tab” where you can check order transit and delivery status for courier shipment and dunzo pickup.</p>

      <p>For <strong>Door delivery & Store-self pickup</strong> </p>
      
      <p>1)	Delivery Passcode OTP will be sent to the customer registered mobile number</p>
      <p>2)	Upon successful door delivery or store self pickup, Get the OTP from customer and verify the same by clicking “Verify OTP” button against the order in the Transit Tab</p>
      <p>3)	With that, the order will be moved to closed tab.</p>

      <p>For <strong>Dunzo pickup and Courier Shipment</strong> </p>
      <p>System will track the delivery status and move the orders to closed tab upon the successful order delivery.</p>
     

      <h2><p><strong>Step 4 (Closed Tab)</strong></p></h2>
      <p>Closed Tab will display all the orders that has been successfully delivered.</p>

      <h2><p><strong>Step 5 (Cancelled Tab)</strong></p></h2>
      <p>Cancelled Tab will display all the orders  that has been cancelled.</p>

      </Box>
      
      
    </>
  );
}

{
  /* title="Your Shop" */
}
