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

export default function PaymentPages() {
  const [data, setData] = useState([]);
  const [paymentdata, setPaymentData] = useState([]);
  const [shopUrl, setshopUrl] = useState("");
  const [iShop, setiShop] = useState("");
  const [paymentiShop, setPaymentiShop] = useState("");
  const [shopName, setShopName] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(0);

  const [dialogOpenSchedule, setDialogOpenSchedule] = React.useState(false);
  const [fromDate, setFromDate] = useState(moment());
  const [currentDate, setCurrentDate] = useState(moment());
  let dateFormated = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  const [dateFormatted, setDateFormatted] = useState(dateFormated);

  const [selectedFromTime, setSelectedFromTime] = useState(new Date());
  const [selectedToTime, setSelectedToTime] = useState(new Date());

  let timeFormated = moment(new Date()).format("hh:mm A");

  const [fromTime, setFromTime] = useState(timeFormated);
  const [toTime, setToTime] = useState(timeFormated);

  const { REACT_APP_SHOP_URL } = process.env;

  /* Payment Web page get list starts here */
  useEffect(() => {
    getData();
  }, [userData]);
  const getData = async () => {
    await axios
      .get("/mylapay/shop/payment_page")
      .then(async (res) => {
        setPaymentData(res.data.data);
        setPaymentiShop(res.data.data[0].shopID);

        if (res.data.data) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* Payment Web page get list ends here */

  /* Payment-page get list starts here */

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
          localStorage.setItem("iTemplate", res.data.data[0].iTemplate);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getShopList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  /* Payment-page get list ends here */

  const copyToClipboard = () => {
    copy(`${REACT_APP_SHOP_URL}/${shopUrl}/${data[0].Template_Url}`);
  };

  const handleDialogScheduleClose = () => {
    setDialogOpenSchedule(false);
  };

  const handleDialogScheduleConfirm = () => {
    setDialogOpenSchedule(false);

    axios
      .post(`/mylapay/shop/next-open`, {
        iShop: iShop,
        isOpen: 0,
        nextOpenDate: dateFormatted,
        fromTime: fromTime,
        toTime: toTime,
      })
      .then((res) => {
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
    let dateFormatedTemp = moment(date).format("YYYY-MM-DD HH:mm:ss");

    setDateFormatted(dateFormatedTemp);
    setFromDate(date);
  };

  const handleFromTimeChange = (date) => {
    let timeFormated = moment(date).format("hh:mm A");
    let toTimeFormated = moment(date).add(9, "hours").format("hh:mm A");

    setToTime(toTimeFormated);
    setSelectedFromTime(date);
    setFromTime(timeFormated);
  };

  const handleToTimeChange = (date, day) => {
    let timeFormated = moment(date).format("hh:mm A");

    setSelectedToTime(date);
    setToTime(timeFormated);
  };

  const handleChangeShopOpenClose = (event) => {
    let shopID = iShop;

    if (event.target.checked) {
      setShopOpen(1);
      axios
        .get(
          `/mylapay/shop/open-close?iShop=${shopID}&isOpen=${event.target.checked}`
        )
        .then((res) => {
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
    // {
    //   name: "MID",
    //   label: "Merchant ID",
    //   options: {
    //     sort: true,
    //   },
    // },
    // {
    //   name: "category",
    //   label: "Merchant Business Category",
    //   options: {
    //     sort: true,
    //   },
    // },
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
              href={`${REACT_APP_SHOP_URL}/${value}/${data[0].caturl}`}
              target="_blank"
              rel="noreferrer"
            >
              {value}
            </a>
          ) : (
            <a
              className="mp-link"
              href={`${REACT_APP_SHOP_URL}/${value}/${data[0].caturl}`}
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
              ></Button>
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
            ></Button>
          );
        },
      },
    },
    {
      name: "",
      label: "Copy URL",
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
            ></Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              color="primary"
              disabled={true}
              startIcon={<FileCopyIcon color="secondary" />}
              onClick={copyToClipboard}
            ></Button>
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
        <a href={"/user-manual"} target="_blank">
          <span
            style={{
              marginTop: "20px",
              marginRight: "15px",
              fontWeight: "500",
              float: "right",
            }}
          >
            User Manual
          </span>
        </a>
      </Box>
      <Box m={2}>
        <MUIDataTable
          className="transanctions-table"
          response="scrollFullHeight"
          data={data}
          disabled="true"
          title={
            <>
              <Box style={{ paddingRight: "1em", display: "flex" }}>
                <span
                  style={{
                    marginTop: "5px",
                    marginRight: "65px",
                    fontWeight: "500",
                  }}
                >
                  Your Shop
                </span>
                {iShop ? (
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={(event) => handleChangeShopOpenClose(event)}
                      checked={shopOpen === 1 ? true : false}
                      id="togBtn"
                    />
                    <div className="slider round"></div>
                  </label>
                ) : null}
              </Box>
            </>
          }
          columns={columns}
          options={options}
        />
      </Box>

      {data[0]!=undefined?
        <TemplateCards
          shopUrl={shopUrl}
          iShop={iShop}
          paymentiShop={paymentiShop}
          templateid={data[0].iTemplate}
        />
      :
      null}
      

      <Dialog
        style={{ width: "800px", margin: "auto" }}
        open={dialogOpenSchedule}
        onClose={handleDialogScheduleClose}
      >
        <DialogTitle>Next Shop Opening Date & Time</DialogTitle>
        <DialogContent>
          <Box mb={1} mt={2} style={{ display: "flex" }}>
            <Box mb={1} mt={2} mr={4}>
              <DatePicker
                label="From"
                variant="inline"
                inputVariant="outlined"
                format="DD MMM YYYY"
                autoOk={true}
                value={fromDate}
                onChange={(date) => handlePreferredDate(date)}
                size="medium"
                minDate={currentDate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Today />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box mb={1} mt={2} mr={4}>
              <KeyboardTimePicker
                label="Next Open Time"
                placeholder="08:00 AM"
                mask="__:__ _M"
                value={selectedFromTime}
                onChange={(date) => handleFromTimeChange(date)}
              />
            </Box>
            {/* <Box mb={1} mt={2}>
              <KeyboardTimePicker
                label="To Time"
                placeholder="08:00 AM"
                mask="__:__ _M"
                value={selectedToTime}
                onChange={(date) => handleToTimeChange(date)}
              />
            </Box> */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogScheduleConfirm}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
          <Button onClick={handleDialogScheduleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

{
  /* title="Your Shop" */
}
