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

export default function UserManual() {
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

      <h2>User Manual</h2>

      <p><strong>How to create your online shop?</strong></p>
      <p>You can create your online shop / ecommerce website with a simple configuration.</p>

      <h2><p><strong>Step 1 (Configure Online Store)</strong></p></h2>
      <p><strong>Theme Section - </strong> Select your online store web template appropriate to your business category from the theme section and choose pre-defined themes suitable for you. the banner images and category section images can be maintained as is or you can upload your own images if you wish.</p>

      <p><strong>Header Section - </strong> Upload you shop logo image, fill shop name and choose the colour you wish to have for your web site.</p>

      <p><strong>Banner Images - </strong> Select banner images suitable for your business from Mylapay gallery or you can upload your own banner images as you wish. Mylapay allow you to have upto 5 banner images as a slider view in your website.</p>

      <p><strong>About Us Section – </strong> Tell your customer about your shop. Mylapay provides a predefined content which can be edited as you wish.</p>

      <p><strong>Contact Us Section – </strong> Your shop address, email id and phone number is auto updated from your profile information which you can edit.</p>

      <p><strong>FAQ Section – </strong> Add question and answer statement which you feel that your customers would frequently ask for better understanding of your shop, product and services.</p>

      <p><strong>Terms & Condition – </strong> Narrate your shop’s terms & condition to your customers with respect to your product and services. You can use predefined content available in the section that may suit you or you can edit or write the terms & condition on your own.</p>

      <p><strong>Why customer love us section – </strong> Narrate a short story on why customer love your shop, products and services to attract your customers. Mylapay provides a predefined content which can be edited as you wish.</p>

      <p><strong>Refund & Cancellation Policy Section – </strong> This is a standard class of policy applicable for all.</p>

      <p><strong>Return Policy Section – </strong> Mylapay provides a standard content on return policy on your website to publish. Select the number of days in the drop-down menu to indicate your customers that your shop can allow the maximum days to return of products or services.</p>

      <p><strong>Footer Section – </strong> Add your social media account page links for customer to connect or view your shop in Facebook, Instagram and Pinterest.</p>

      <h2><p><strong>Step 2 (Add Products)</strong></p></h2>
      <p>You can add unlimited numbers of products to your shop</p>
      <p><strong>Product / Service Image - </strong> Upload your product images. You can upload up to 5 images for each of your products. We suggest you use images provided by your manufacturers or download free images from google or take a picture from your mobile camera and upload it. Please remember that images is what represent your product so we recommend the images to be in high quality.</p>

      <p><strong>Product / Service Name  – </strong> Add a name to your product. This will be appearing as a title on your product view.</p>

      <p><strong>Product / Service Price – </strong> Update the price amount of the product. Make sure the price covers all cost with desired profitability and competitive in the market at the same time.</p>

      <p><strong>GST  – </strong> Select the applicable GST percentage from the drop-down list for the product. The selected GST% will be calculated and included in the overall product price in the product view.</p>

      <p><strong>Stock – </strong> Update the number of stock available. Please make sure the product stoke is regularly updated to avoid out of stock. Customers will be not able to order the product if the stock is out.</p>

      <p><strong>Attributes – </strong> You can add multiple range of attributes to describe the product, features, etc. Add a label name and provide detail / value against it.</p>
      <p>For Example, Label name: Weight and Value: 1KG.</p>

      <p><strong>Gender, Size, Colour – </strong> Applicable only for shop category of Apparels. You can choose gender, size and colour in which the product is available</p>

      <p><strong>Category – </strong> add a category name in which your product to be displaced in your website. You can create unlimited products under multiple product category for your Customers to shop your products by category.</p>

      <p><strong>Product / Service description – </strong> Add a detailed description to your product for your customers to read the specification of your product before they buy it.</p>

      <p>Click Add Product button to save your product in list. You can edit your product with any of its detail including the price at any time.</p>


      <h2><p><strong>Step 3 (Shipment Details)</strong></p></h2>
      <p>Mylapay provides integrated shipment facility with multiple courier options for long distance delivery across the country and with dunzo for a short distance delivery in major metro cities.  You can configure the shipment arrangement with simple sections.</p>

      <p><strong>Delivery Not Applicable Check Box – </strong> Check delivery not applicable check box if you do not wish to take Mylapay shipment facility options or your business is service related and it doesn’t need a delivery.</p>

      <p><strong>Delivery (Courier Shipment) – </strong> Click check box against the courier shipment which will enable you to deliver your products across the country through more than 15 courier cargo options.</p>

      <p><strong>Delivery (Merchant Door Delivery) – </strong> Click check box against the Merchant Door Delivery if you have an option to deliver your customer on your own.</p>

      <p><strong>Pickup (Customer Self Pickup) – </strong> Click check box against the customer self pickup if you wish to allow your customers to pick up the orders from your shop through a direct customer visit or through dunzo.</p>

      <p><strong>Expected TAT – </strong> Select hours and minutes in which you can accept orders and handover the product for shipment.</p>

      <h2><p><strong>Step 4 (Pricing)</strong></p></h2>
      <p>Mylapay allows you to charge customers for the shipment delivery and recover your cost on product handling, packages and settlement fees through convenience fee collection.</p>

      <p><strong>Delivery Charges – </strong> You can add delivery charges to your customer payment based on the order value amount. This is to recover your delivery cost associated with your product shipment.</p>

      <p><strong>Convenience Fee – </strong> You can add convenience fee up to 2% on order value which will be collected from your customer during the payment checkout. This option is provided to recover your cost associated with product handling, packages and payment charges.</p>

      </Box>
      
      
    </>
  );
}

{
  /* title="Your Shop" */
}
