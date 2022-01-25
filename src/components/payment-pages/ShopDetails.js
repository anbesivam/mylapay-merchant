import {
  Box,
  Button,
  Paper,
  TextField,
  Grid,
  Typography,
  Container,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  DialogTitle,
  IconButton,
  FormControlLabel,
  InputAdornment,
  FormGroup,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Switch,
} from "@material-ui/core";

import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import {AddShoppingCart} from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SelectSearch from "react-select-search";
import CloseIcon from "@material-ui/icons/Close";
import BannerFileUpload from "./BannerFileUpload";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import moment from "moment";
import PropTypes from "prop-types";
import styles from "./css/StepOne.module.css";
import editStyles from "./css/Edit.module.css";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

import { Helmet } from "react-helmet";

import {
  ArrowForward,
  Cancel,
  ControlPoint,
  ArrowForwardIos,
  Visibility,
  AccessTime,
} from "@material-ui/icons";
// import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { styled } from "@material-ui/styles";

import { ExpandMore } from "@material-ui/icons";

// import AddCategory from "./AddCategory";
import ImageUpload from "./ImageUpload";
import BannerImageUpload from "./BannerImageUpload";

import { useFormik, getIn } from "formik";
import * as yup from "yup";
import { setShopDetails, setiShop } from "../../redux/paymentPageSlice";
import { setUserDetails } from "../../redux/authSlice";

import { ChromePicker } from "react-color";
import Swal from "sweetalert2";
import { useLocation } from "react-router";
import queryString from "query-string";
const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    // borderRadius: '30px 0px 30px 0',
    // '&:not(:last-child)': {
    //   borderBottom: 0,
    // },
    "&:before": {
      display: "none",
    },

    "&$expanded": {
      margin: "1px 0",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "#21CFFF",
    borderBottom: "1px solid #12738E",
    // marginBottom: -1,
    color: "#666666",
    // borderRadius: '30px 0px 30px 0',
    // minHeight: 40,
    // '&$expanded': {
    //   minHeight: 40,
    // },
  },
  minHeight: "10px",
  content: {
    "&$expanded": {
      margin: "0px 0",
      minHeight: "10px",
    },
  },
  expanded: {
    margin: "1px 0",
  },
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

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

//tabpanel starts here

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

//tabpanel ends here

export default function ShopDetails({ shopID, stepChange, geShopData }) {
  const { REACT_APP_SHOPAPI_URL } = process.env;

  const history = useHistory();

  //const userDetails = useSelector((state) => state.auth.userDetails);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  // console.log("User details intial : ", userDetails);

  // const images = importAll(require.context('https://shopapi.mylapay.com/uploads/Themes/GROCERY-STORES-AND-SUPERMARKETS/Mylapay-Banner-images', false, /\.(png|jpe?g|svg)$/))
  const { search } = useLocation();
  const { editItem } = queryString.parse(search);
  const [selectedValue, setselectedValue] = React.useState(0);
  const [templateid, settemplateid] = React.useState();
  const [templateurl, settemplateurl] = React.useState();
  const [bannerimage, setbannerimage] = React.useState([]);
  const [domainValue, setdomainValue] = React.useState(0);
  const [newDomainValue, setNewDomainValue] = React.useState(1);
  const [domainList, setDomainList] = React.useState([]);

  const [galleryvalue, setgalleryvalue] = React.useState("");

  // console.log("User Deatils : " + JSON.stringify(userDetails));
  const [checked, setChecked] = React.useState(false);
  const [termschecked, setTermsChecked] = React.useState(false);
  const [privacypolicychecked, setprivacypolicychecked] = React.useState(false);

  const [cuslovechecked, setcuslovechecked] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overlay_on, setoverlay_on] = useState(false);
  const [progress_on, setprogress_on] = useState(false);

  //new Date()
  const [selectedFromTimeSunday, setSelectedFromTimeSunday] = useState(
    new Date()
  );
  const [selectedToTimeSunday, setSelectedToTimeSunday] = useState(new Date());

  const [selectedFromTimeMonday, setSelectedFromTimeMonday] = useState(
    new Date()
  );
  const [selectedToTimeMonday, setSelectedToTimeMonday] = useState(new Date());

  const [selectedFromTimeTuesday, setSelectedFromTimeTuesday] = useState(
    new Date()
  );
  const [selectedToTimeTuesday, setSelectedToTimeTuesday] = useState(
    new Date()
  );

  const [selectedFromTimeWednesday, setSelectedFromTimeWednesday] = useState(
    new Date()
  );
  const [selectedToTimeWednesday, setSelectedToTimeWednesday] = useState(
    new Date()
  );

  const [selectedFromTimeThursday, setSelectedFromTimeThursday] = useState(
    new Date()
  );
  const [selectedToTimeThursday, setSelectedToTimeThursday] = useState(
    new Date()
  );

  const [selectedFromTimeFriday, setSelectedFromTimeFriday] = useState(
    new Date()
  );
  const [selectedToTimeFriday, setSelectedToTimeFriday] = useState(new Date());

  const [selectedFromTimeSaturday, setSelectedFromTimeSaturday] = useState(
    new Date()
  );
  const [selectedToTimeSaturday, setSelectedToTimeSaturday] = useState(
    new Date()
  );
  const [activeStep, setActiveStep] = useState(1);

  let timeFormated = moment(new Date()).format("hh:mm A");
  // console.log(timeFormated);

  // const [fromTime, setFromTime] = useState(timeFormated);
  // const [toTime, setToTime] = useState(timeFormated);
  const [fromTimeSunday, setFromTimeSunday] = useState(timeFormated);
  const [toTimeSunday, setToTimeSunday] = useState(timeFormated);

  const [fromTimeMonday, setFromTimeMonday] = useState(timeFormated);
  const [toTimeMonday, setToTimeMonday] = useState(timeFormated);

  const [fromTimeTuesday, setFromTimeTuesday] = useState(timeFormated);
  const [toTimeTuesday, setToTimeTuesday] = useState(timeFormated);

  const [fromTimeWednesday, setFromTimeWednesday] = useState(timeFormated);
  const [toTimeWednesday, setToTimeWednesday] = useState(timeFormated);

  const [fromTimeThursday, setFromTimeThursday] = useState(timeFormated);
  const [toTimeThursday, setToTimeThursday] = useState(timeFormated);

  const [fromTimeFriday, setFromTimeFriday] = useState(timeFormated);
  const [toTimeFriday, setToTimeFriday] = useState(timeFormated);

  const [fromTimeSaturday, setFromTimeSaturday] = useState(timeFormated);
  const [toTimeSaturday, setToTimeSaturday] = useState(timeFormated);

  const [sundayOpen, setSundayOpen] = useState(false);
  const [mondayOpen, setMondayOpen] = useState(false);
  const [tuesdayOpen, setTuesdayOpen] = useState(false);
  const [wednesdayOpen, setWednesdayOpen] = useState(false);
  const [thursdayOpen, setThursdayOpen] = useState(false);
  const [fridayOpen, setFridayOpen] = useState(false);
  const [saturdayOpen, setSaturdayOpen] = useState(false);
  const [businessHoursValues, setBusinessHoursValues] = useState(null);
  const shopDetails = useSelector((state) => state.paymentPage.shopDetails);
  const classes = useStylesFacebook();

  const [value, setValue] = React.useState(0);

  const handleChangetabpanel = (event, newValue) => {
    setValue(newValue);
  };

  const [imageArray, setImageArray] = useState([]);
  // const [categoryimageArray, setcategoryImageArray] = useState([]);

  const [categoryimageArray, setcategoryImageArray] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
  };

  const linksTitle = [
    "Shop URL",
    "Header Content",
    "Themes",
    "Category Image",
    "About Us",
    "Why choose your shop",
    "Contact us",
    "FAQ Content",
    "Terms & Conditions",
    "Privacy Policy",
    "Return Policy",
    "Cancellation & Refund policy",
    "Footer Content",
  ];

  const [cuslove, setcuslove] = React.useState(
    `We pick the convenient delivery slots to have your grocery delivered. This is available for customers from Place name, to their doorstep. We work hard for customer loyalty, trust and confidence, by taking feedback and giving our customers what they want.`
  );

  const [termsval, setTermsval] = React.useState("");

  const [refund, setRefund] = React.useState("");

  const [previewurl, setpreviewurl] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [dialogOpengallery, setDialogOpengallery] = React.useState(false);
  const [dialogOpentheme, setDialogOpentheme] = React.useState(false);

  const [dialogOpencategorygallery, setDialogOpencategorygallery] =
    React.useState(false);

  const [dialogOpenSchedule, setDialogOpenSchedule] = React.useState(false);

  const { REACT_APP_SHOP_URL } = process.env;
  const { REACT_APP_DELHIVERY_URL } = process.env;
  const [formValues, setFormValues] = useState([{ question: "", answer: "" }]);

  const [caturl, setcaturl] = useState("");
  const [optionSelected, setoptionSelected] = useState(null);
  const [themeoptionSelected, setthemeoptionSelected] = useState(null);

  const [categoryoptionSelected, setcategoryoptionSelected] = useState(null);

  const [galleryimages, setgalleryImage] = useState([]);
  const [themegalleryimages, setthemegalleryImage] = useState([]);

  // const [categorygalleryimages, setcategorygalleryImage] = useState([]);

  const [categorygalleryimages, setcategorygalleryImage] = useState("");

  const [banner_image, setbannerimages] = useState([]);

  // const [mylapaygallery, setmylapaygallery] = useState([
  //   { id: 0,themename:"Grocery",url:"grocery", image_path: "/images/mylapay_gallery/grocery/grocery_banner.png", pdfpath :"https://merchant.mylapay.com/Grocery.pdf"},
  //   { id: 1, themename:"Apparel",url:"apparel", image_path: "/images/mylapay_gallery/apparel/apparel-hero.jpg", pdfpath :"https://merchant.mylapay.com/Apparel.pdf" },
  //   { id: 2, themename:"Restaurants",url:"restaurant", image_path: "/images/mylapay_gallery/restaurant/restaurant_bg.jpg", pdfpath :"https://merchant.mylapay.com/Restaurants.pdf" },

  //   ]);

  const [mylapaygallery, setmylapaygallery] = useState([]);
  const [mylapaygallerybanner, setmylapaygallerybanner] = useState([]);
  const [mylapaygallerycategorybanner, setmylapaygallerycategorybanner] =
    useState([]);
  const [selectedthemeimages, setselectedthemeimages] = useState([]);
  const [selectedthemelist, setselectedthemelist] = useState([]);

  const [image_length, setimagelength] = useState(0);
  const [checktoggle, setchecktoggle] = useState(0);

  const [aboutus, setaboutus] = useState("");
  const [alertlimit, setalertlimit] = useState(0);

  const [statecolor, setstatecolor] = useState({
    background: "#fff",
  });

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChangeaccord = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const onTogglethemetemeplate = async (event, itemplate, templateurl) => {
    setthemegalleryImage([]);
    setselectedthemeimages([]);
    setchecktoggle(1);

    settemplateurl(templateurl);

    console.log("event id  : " + event);

    if (event == 0) {
      setcaturl("grocery");
      formik.setFieldValue("caturl", "grocery");
    } else if (event == 1) {
      setcaturl("apparel");
      formik.setFieldValue("caturl", "apparel");
    } else if (event == 2) {
      setcaturl("restaurant");
      formik.setFieldValue("caturl", "restaurant");
    }

    if (themeoptionSelected == event) {
      // console.log("Checkbox uncheck : " + event);
      setthemeoptionSelected(null);
      // setcaturl("");
      // formik.setFieldValue("caturl", "");
      setgalleryvalue("");
    } else {
      // console.log("Checkbox check ");
      setthemeoptionSelected(event);

      await axios
        .get(
          `mylapay/customer/shop/view?shop_url=demoshop&theme=${templateurl}&layout=${templateid}`
        )
        .then((res) => {
          if (res.data.status === 1) {
            if (res.data.data.length === 0) return;
            // dispatch(setShopData(res.data.data));
            console.log("Shop data banner : " + res.data.data.shop_banner);
            setselectedthemeimages(res.data.data.shop_banner);
            // setmylapaygallerycategorybanner(res.data.data.Category_Image)
            setgalleryvalue("theme");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // function importAll(r) {
  //   let images = {};
  //   r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });

  //   console.log("Images list : " + JSON.stringify(images))
  //   return images;
  // }

  const onToggletheme = async (event, itemplate) => {
    // console.log("itemplate : " + itemplate);
    // setoptionSelected(event)

    // if (itemplate == 1) {
    //   setRefund(`Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login
    //   Order can be cancelled within 30 minutes from the time of placing order.
    //   Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order.
    //   The Refund amount will be credited back to the account from where the payment was made.
    //   Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
    //   Order once shipped will not be eligible for Cancellation.
    //   In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`);
    // } else if (itemplate == 2) {
    //   setRefund(`Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login
    //   Order can be cancelled before shipment of the Order.
    //   Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order.
    //   The Refund amount will be credited back to the account from where the payment was made.
    //   Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
    //   Order once shipped will not be eligible for Cancellation.
    //   In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`);
    // } else if (itemplate == 3) {
    //   setRefund(`Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login
    //   Order can be cancelled within 5 minutes from the time of order placed.
    //   Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order.
    //   The Refund amount will be credited back to the account from where the payment was made.
    //   Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
    //   Order once shipped will not be eligible for Cancellation.
    //   Shop once accepting order will ensure that placed orders are shipped, if there are change or unavailability of orders, the shop will intimate to customer through call to check for alternative.`);
    // }

    setthemeoptionSelected(null);

    if (optionSelected == event) {
      // console.log("Checkbox uncheck : " + event);
      setoptionSelected(null);
      setselectedthemelist([]);
      // setcaturl("");
      // formik.setFieldValue("caturl", "");
    } else {
      // console.log("Checkbox check ");
      setoptionSelected(event);

      // setcaturl(mylapaygallery[event].Template_Url);
      // formik.setFieldValue("caturl", mylapaygallery[event].Template_Url);

      await axios
        .get(`mylapay/shop/templates/` + itemplate)
        .then(async (res) => {
          if (res.data.status === 1) {
            setselectedthemelist(res.data.message);
            setmylapaygallerybanner(res.data.message[0].banners);
            if (res.data.message[0].categoryImages) {
              setmylapaygallerycategorybanner(
                res.data.message[0].categoryImages
              );
            }

            console.log("shopDetails.iSub_Template 2 : " + shopDetails);

            // if(shopDetails.iSub_Template!=null)
            // {
            //   res.data.message.map((tem_value, tem_index) => {
            //     if (
            //       tem_value.iSub_Template == shopDetails.iSub_Template
            //     ) {
            //       setthemeoptionSelected(tem_index);
            //       if (tem_index == 0) {
            //         setcaturl("grocery");
            //         formik.setFieldValue("caturl", "grocery");
            //       } else if (tem_index == 1) {
            //         setcaturl("apparel");
            //         formik.setFieldValue("caturl", "apparel");
            //       } else if (tem_index == 2) {
            //         setcaturl("restaurant");
            //         formik.setFieldValue("caturl", "restaurant");
            //       }

            //       settemplateurl(tem_value.Sub_Template_Url);
            //       axios
            //         .get(
            //           `mylapay/customer/shop/view?shop_url=demoshop&theme=${tem_value.Sub_Template_Url}&layout=${templateid}`
            //         )
            //         .then((res) => {
            //           if (res.data.status === 1) {
            //             if (res.data.data.length === 0) return;
            //             console.log(
            //               "Shop data banner : " +
            //                 res.data.data.shop_banner
            //             );
            //             setselectedthemeimages(res.data.data.shop_banner);
            //             setgalleryvalue("theme");
            //           }
            //         })
            //         .catch((err) => console.log(err));
            //     }
            //   });
            // }
          }
        });
    }
  };

  const getThemelist = async (templateidval) => {
    await axios
      .get(`mylapay/shop/templates/` + templateidval)
      .then(async (res) => {
        if (res.data.message.length > 0) {
          setselectedthemelist(res.data.message);
          setmylapaygallerybanner(res.data.message[0].banners);
          if (res.data.message[0].categoryImages) {
            setmylapaygallerycategorybanner(res.data.message[0].categoryImages);
          }

          console.log("shopDetails.iSub_Template 3 : " + shopDetails);

          if (checktoggle == 0) {
            if (shopDetails != null) {
              res.data.message.map((tem_value, tem_index) => {
                if (tem_value.iSub_Template == shopDetails.iSub_Template) {
                  setthemeoptionSelected(tem_index);
                  if (tem_index == 0) {
                    setcaturl("grocery");
                    formik.setFieldValue("caturl", "grocery");
                  } else if (tem_index == 1) {
                    setcaturl("apparel");
                    formik.setFieldValue("caturl", "apparel");
                  } else if (tem_index == 2) {
                    setcaturl("restaurant");
                    formik.setFieldValue("caturl", "restaurant");
                  }

                  settemplateurl(tem_value.Sub_Template_Url);
                  axios
                    .get(
                      `mylapay/customer/shop/view?shop_url=demoshop&theme=${tem_value.Sub_Template_Url}&layout=${templateid}`
                    )
                    .then((res) => {
                      if (res.data.status === 1) {
                        if (res.data.data.length === 0) return;
                        console.log(
                          "Shop data banner : " + res.data.data.shop_banner
                        );
                        setselectedthemeimages(res.data.data.shop_banner);
                        setgalleryvalue("theme");
                      }
                    })
                    .catch((err) => console.log(err));
                }
              });
            }
          }

          if (templateidval != null) {

            if (templateidval == 1) {
              // console.log("Working refund");
              formik.setFieldValue(
                "refund",
                `Customer has the option to cancel <br /> the order placed vide cancel button available next to order detail in customer login.
                Order can be cancelled within 30 minutes from the time of placing order. 
                Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order. 
                The Refund amount will be credited back to the account from where the payment was made. 
                Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
                Order once shipped will not be eligible for Cancellation. 
                In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`
              );
            } else if (templateidval == 2) {
              // console.log("Working refund");

              formik.setFieldValue(
                "refund",
                `Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login 
                Order can be cancelled before shipment of the Order.
                Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order. 
                The Refund amount will be credited back to the account from where the payment was made. 
                Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
                Order once shipped will not be eligible for Cancellation. 
                In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`
              );
            } else if (templateidval == 3) {
              // console.log("Working refund");

              formik.setFieldValue(
                "refund",
                `Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login 
                Order can be cancelled within 5 minutes from the time of order placed. 
                Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order. 
                The Refund amount will be credited back to the account from where the payment was made. 
                Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
                Order once shipped will not be eligible for Cancellation. 
                Shop once accepting order will ensure that placed orders are shipped, if there are change or unavailability of orders, the shop will intimate to customer through call to check for alternative.`
              );
            } else if (templateidval > 3) {
              // console.log("Working refund");

              formik.setFieldValue(
                "refund",
                `Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login 
                Order can be cancelled before shipment of the Order.
                Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order. 
                The Refund amount will be credited back to the account from where the payment was made. 
                Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
                Order once shipped will not be eligible for Cancellation. 
                In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`
              );
            }
          }
          else
          {
            formik.setFieldValue(
              "refund",
              `Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login 
              Order can be cancelled before shipment of the Order.
              Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order. 
              The Refund amount will be credited back to the account from where the payment was made. 
              Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
              Order once shipped will not be eligible for Cancellation. 
              In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`
            );
          }
        } else {
          if (templateidval > 3) {
            // console.log("Working refund");

            formik.setFieldValue(
              "refund",
              `Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login 
              Order can be cancelled before shipment of the Order.
              Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order. 
              The Refund amount will be credited back to the account from where the payment was made. 
              Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
              Order once shipped will not be eligible for Cancellation. 
              In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`
            );
          }
        }
      });
  };

  const onTogglethemegallery = async (event) => {
    if (event.target.checked) {
      let newArray = [...themegalleryimages, event.target.value];
      if (themegalleryimages.includes(event.target.value)) {
        newArray = newArray.filter((day) => day !== event.target.value);
      }
      setthemegalleryImage([]);
      setthemegalleryImage(newArray);
    } else {
      let newArray = [...themegalleryimages, event.target.value];
      if (themegalleryimages.includes(event.target.value)) {
        newArray = newArray.filter((day) => day !== event.target.value);
      }
      setthemegalleryImage([]);
      setthemegalleryImage(newArray);
    }
    // console.log("Selected image : " + JSON.stringify(themegalleryimages));
  };

  const onToggle = async (event) => {
    // let newItems = this.state.items.slice();
    // newItems[index].checked = !newItems[index].checked

    console.log("Selected image : " + galleryimages.length);

    // if(galleryimages.length<=4)
    // {
    if (event.target.checked) {
      // value = event.target.value;

      let newArray = [...galleryimages, event.target.value];
      if (galleryimages.includes(event.target.value)) {
        newArray = newArray.filter((day) => day !== event.target.value);
      }

      setgalleryImage(newArray);
    } else {
      let newArray = [...galleryimages, event.target.value];
      if (galleryimages.includes(event.target.value)) {
        newArray = newArray.filter((day) => day !== event.target.value);
      }

      setgalleryImage(newArray);
    }
    // }
    // else
    // {
    //   var x = document.getElementsByClassName("myCheckbox" + event.target.value);

    //   console.log("Check box element : " + x);
    //   for(let i=0; i<=x.length; i++) {
    //       x[i-1].checked = false;
    //   }
    // }

    // console.log("Selected image : " + JSON.stringify(galleryimages));
  };

  const onTogglecategory = async (event) => {
    console.log("Selected image : " + event);
    // if (event.target.checked) {

    //   console.log("Selected image : " + event.target.value);

    //   setcategoryoptionSelected(event.target.value)

    //   let newArray = [...categorygalleryimages, event.target.value];
    //   if (categorygalleryimages.includes(event.target.value)) {
    //     newArray = newArray.filter((day) => day !== event.target.value);
    //   }

    //   setcategorygalleryImage(newArray);
    // } else {

    //   setcategoryoptionSelected(null)

    //   let newArray = [...categorygalleryimages, event.target.value];
    //   if (categorygalleryimages.includes(event.target.value)) {
    //     newArray = newArray.filter((day) => day !== event.target.value);
    //   }

    //   setcategorygalleryImage(newArray);
    // }
    // console.log("Selected image : " + JSON.stringify(categorygalleryimages));

    if (categoryoptionSelected == event) {
      // console.log("Checkbox uncheck : " + event);

      setcategoryoptionSelected(null);

      // let newArraycheck = [...categorygalleryimages, []];

      // console.log("New array length : " + newArraycheck.length);

      // if (categorygalleryimages.includes(event)) {
      //   newArraycheck = newArraycheck.filter((day) => day !== event);
      // }

      // let newArraycheck = "";

      // newArraycheck = event;

      setcategorygalleryImage(-1);

      // if(categorygalleryimages.length==0)
      // {
      //   let newArray = [...categorygalleryimages, event];

      //   console.log("New array length : " + newArray.length);

      //   if (categorygalleryimages.includes(event)) {
      //     newArray = newArray.filter((day) => day !== event);
      //   }

      //   setcategorygalleryImage(newArray);
      // }
    } else {
      setcategoryoptionSelected(null);

      // setcategorygalleryImage([]);

      // console.log("Checkbox check " + event);
      setcategoryoptionSelected(event);

      // let newArraycheck = "";

      // newArraycheck = event;

      setcategorygalleryImage(event);

      // if(categorygalleryimages.length==0)
      // {

      //   let newArray = [...categorygalleryimages, event];
      //   if (categorygalleryimages.includes(event)) {
      //     newArray = newArray.filter((day) => day !== event);
      //   }

      //   setcategorygalleryImage(newArray);
      // }
    }
    // console.log("Selected image : " + JSON.stringify(categoryoptionSelected));
  };

  const handleChangeChkprivacypolicy = (event) => {
    setprivacypolicychecked(!privacypolicychecked);

    if (event.target.checked == true) {
      let privacy_new =
        formik.values.shop_name +
        " - PRIVACY POLICY <br /> As the operators of the “" +
        formik.values.shop_url +
        "” Web App, <Official company/brand name> (“we“, “us”, “our”) is committed to protecting and respecting your privacy. This Privacy Policy (“Policy”) sets out the basis on which the personal data collected from you, or that you provide to us will be processed by us. Please read the following carefully to understand our views and practices regarding your personal data and how we will treat it. <br /> INFORMATION WE MAY COLLECT FROM YOU <br /> We may collect and process the following information from you: |n * Information that you provide by filling in forms on our site " +
        formik.values.shop_url +
        " (for the purposes of the Privacy Policy). This includes information provided at the time of registering to use our App (which may be directly through the App, or through third party service providers, and in the case of the latter, we will obtain the personal data you have provided to the third party service provider), subscribing to our service, posting material or requesting further information or services. We may also ask you for information when you report a problem with our App. <br /> * If you contact us, we may keep a record of that correspondence. <br /> * We may also ask you to complete surveys that we use for research purposes, although you do not have to respond to them. <br /> * Details of transactions you carry out through our App and of the fulfilment of your orders. <br /> RETENTION OF YOUR PERSONAL DATA <br /> We take appropriate measures to ensure that any personal data is kept secure and kept for the duration of your use of our service. Unfortunately, the transmission of information via the internet is not completely secure. Although we will do our best to protect your personal data, we cannot guarantee the security of your data when transmitted to our App; any transmission is at your own risk. Once we have received your information, we will use strict procedures and security features to try to prevent unauthorised access. <br /> The App may give you access to message boards, forums or chat rooms from time to time. You acknowledge and agree that any personal data published by you using these features is at your sole discretion and is accessible by the public. <br /> If your personal details change you may update them by accessing the relevant page of the App. If you have any questions about how we use data collected which relates to you, please contact us by sending a request by email to the contact details below. <br /> USES MADE OF YOUR INFORMATION <br /> We use information held about you in the following ways: <br /> * To ensure that content from our App is presented in the most effective manner for you and for your computer. <br /> * To provide you with information, products or services that you request from us or which we feel may interest you, where you have consented to be contacted for such purposes. <br /> * To carry out our obligations arising from any contracts entered into between you and us. <br /> * To allow you to participate in interactive features of our service, when you choose to do so. <br /> * To notify you about changes to our service. <br /> * To manage your account, including processing payments and refunds and providing notifications. <br /> In addition to the above uses we may use your information, or permit selected third parties to use your information, to notify you about goods or services which may be of interest to you. <br /> For such uses we will only contact you by electronic means (e-mail or SMS) if you have consented to such communication when we collect your data. OR if the contact relates to goods and services similar to those which were the subject of a previous transaction with you. <br /> DISCLOSURE OF YOUR INFORMATION <br /> We may disclose your personal information to any member of our group, which means our subsidiaries, our ultimate holding company and its subsidiaries, as defined in applicable Indian Law (where applicable). <br /> We may disclose your personal information to third parties: <br /> * in the event that we sell or buy any business or assets, in which case we may disclose your personal data to the prospective seller or buyer of such business or assets; or <br /> * if we or substantially all of our assets are acquired by a third party, in which case personal data held by us about our customers will be one of the transferred assets; or <br /> * if we are under a duty to disclose or share your personal data in order to comply with any legal obligation, or in order to enforce or apply our App Terms and Conditions and other agreements; or <br /> * to protect the rights, property, or safety of <official company/store name>, the App, our users and any third party we interact with the to provide the App. <br /> IP ADDRESSES AND COOKIES <br /> Our App uses cookies. A cookie is a small file of letters and numbers that we put on your computer if you agree. These cookies allow us to distinguish you from other users of the App, which helps us to provide you with a good experience when you browse our App and also allows us to improve the App. <br /> YOUR RIGHTS <br /> You have the right to ask us not to process your personal data for marketing purposes. We will usually inform you (before collecting your data) if we intend to use your data for such purposes or if we intend to disclose your information to any third party for such purposes. You can exercise your right to prevent such processing by checking/ticking certain tick boxes we use to collect your data. You can also exercise the right at any time by contacting us using our contact details set out below. <br /> The App may, from time to time, contain links to and from the websites of our partner networks, advertisers and affiliates. If you follow a link to any of these websites, please note that these websites have their own privacy policies and terms of use and that we do not accept any responsibility or liability for these policies and terms of use. Please check these policies before you submit any personal data to these websites. <br /> ACCESS TO INFORMATION <br /> The Data Protection Act gives you the right to access information held about you. Your right of access can be exercised in accordance with the Data Protection Act. Any access request may be subject to a fee of £10 to meet our costs in providing you with details of the information we hold about you. <br /> CHANGES TO OUR PRIVACY POLICY <br /> We reserve the right to modify this Privacy Policy at any time. Any changes we may make to our Privacy Policy in the future will be notified and made available to you using the App. Your continued use of the services and the App shall be deemed your acceptance of the varied Privacy Policy. <br /> CONTACT <br /> All questions, comments and requests regarding this Privacy Policy should be addressed to " +
        formik.values.contactEmail +
        " <br /> INFORMATION ABOUT OUR USE OF COOKIES <br />  Our App uses cookies to distinguish you from other users of our App. This helps us to provide you with a good experience when you browse our App and also allows us to improve the App. <br /> A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer’s hard drive. <br /> You can find more information about the individual cookies we use and the purposes for which we use them in the table below. The cookies we use include “analytical” cookies. They allow us to recognize and count the number of visitors and to see how visitors move around the App when they are using it. This helps us to improve the way our App works, for example, by ensuring that users are finding what they are looking for easily. <br /> Please note that our advertisers may also use cookies, over which we have no control. <br /> You block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.";

      formik.setFieldValue("privacypolicy", privacy_new);
    } else {
      formik.setFieldValue("privacypolicy", "");
    }
  };

  const handleChangeChkterms = (event) => {
    setTermsChecked(!termschecked);

    // event.preventDefault();

    if (event.target.checked == true) {
      let terms_new =
        formik.values.shop_name +
        " - Terms & Conditions <br /> TERMS AND CONDITIONS <br /> THIS DOCUMENT SETS OUT THE TERMS AND CONDITIONS (“TERMS”) ON WHICH YOU (“YOU OR “USER” ) MAY USE THE " +
        formik.values.shop_name +
        " WEBSITE " +
        formik.values.shop_url +
        " PLEASE READ THESE TERMS CAREFULLY BEFORE COMMITTING TO USE THE PLATFORM OR SERVICES OFFERED ON THE APP. BY USING THE APP, YOU AGREE TO COMPLY WITH AND BE LEGALLY BOUND BY THE TERMS AND CONDITIONS OF THESE TERMS, WHETHER OR NOT YOU BECOME A REGISTERED USER OF THE SERVICES. THESE TERMS GOVERN YOUR ACCESS TO AND USE OF THE APP AND CONSTITUTE A BINDING LEGAL AGREEMENT BETWEEN YOU AND " +
        formik.values.shop_name +
        ". <br /> YOU ARE ADVISED TO PRINT AND RETAIN A COPY OF THESE TERMS FOR YOUR FUTURE REFERENCE. <br /> THESE TERMS MAY BE SUBJECT TO CHANGE FROM TIME TO TIME, AND ACCORDINGLY YOU ARE ADVISED TO REFER BACK TO THESE TERMS BEFORE REGISTERING ON THE APP.<br /> SECTION A: General Provisions <br /> 1. INFORMATION ABOUT " +
        formik.values.shop_name +
        "<br /> 1. The website is owned and managed, operated and maintained by " +
        formik.values.shop_name +
        ", a company registered in " +
        userDetails.City +
        " " +
        userDetails.StateName +
        ". <br /> 2. The website is an online marketplace offering where people (“Users”) who wish to find <items you sell on website> can do (“Orders”). Users can also create personal profiles (“Profiles”), communicate with other " +
        formik.values.shop_url +
        " users, rate their experiences and use such other Services available on the App from time to time. <br /> 3. " +
        formik.values.shop_name +
        " shall be entitled at its own discretion to suspend the App for any reason whatsoever, including but not limited to repairs, planned maintenance or upgrades and shall not be liable to you for any losses, damages, costs or expenses arising from or in connection with any suspension or unavailability of the App, including but not limited to preventing you from using the Platform or using any of the Services available on the App. <br /> 4. " +
        formik.values.shop_name +
        " reserves the right to make any changes to the webapp including any functionalities and content therein or to discontinue any aspect of the same without notice to you. <br /> 5. " +
        formik.values.shop_name +
        " relies on third party providers (such as network providers, data centres and telecommunication providers) to make the App and the content therein and the Services available to you. Whilst " +
        formik.values.shop_name +
        " takes all reasonable steps available to it to provide you with a good level of service, you acknowledge and agree that " +
        formik.values.shop_name +
        " does not warrant that the webapp shall be uninterrupted or fault-free at all times. " +
        formik.values.shop_name +
        " therefore shall not be liable in any way for any losses you may suffer as a result of delays or failures of the Services and webapp as a result of " +
        formik.values.shop_name +
        "’s service providers. <br /> 6. " +
        formik.values.shop_name +
        " uses third party payment handlers to process your payment. The third party payment gateway provides services for the issuing, use, and management of e-money. These services are offered on the App as a means of payment for " +
        formik.values.shop_name +
        ". By signing up to " +
        formik.values.shop_url +
        " (both as a user), you agree to be bound by the Terms and Conditions of the third party payment Gateway service provider. <br /> 7. " +
        formik.values.shop_url +
        " may be contacted at  by email at " +
        userDetails.contact_email +
        " <br /> 2. PRELIMINARY INFORMATION <br /> 1. By registering your details with " +
        formik.values.shop_url +
        "  as a User, you warrant that: <br /> 2.1.1. You are legally capable of entering into binding contracts <br /> 2.1.2. You are at least 18 years old; and <br /> 2.1.3. You are not in any way prohibited by the applicable law in the jurisdiction which you are currently located to enter into these Terms for the use of the Services.<br /> 3. REGISTRATION <br /> 1. In order to use the Application services, you will need to complete the online registration form and set up an account (“Account”) in " +
        formik.values.shop_name +
        ". <br /> 2. By registering your details and setting up an Account you consent to " +
        formik.values.shop_name +
        " conducting verification and security procedures in respect of the information provided by you online. <br /> 3. You hereby warrant that the information provided by you to " +
        formik.values.shop_name +
        " is true, accurate and correct. You further warrant that you shall promptly notify " +
        formik.values.shop_name +
        " in the event of any changes to such information. <br /> 4. Upon the completion and submission of the online registration form on the App, you shall be sent a verification email ( “Verification Email”) to the email address you provided on the registration form. This Verification Email will contain details of how to activate your Account By signing up you agree to the Terms of Use and Privacy Policy. <br /> 5. Upon registration, " +
        formik.values.shop_name +
        " will give you the opportunity to invite friends to join the App by emailing an invite (whereby you will be required to enter their email addresses), or by contacting friends through their Facebook profiles. <br /> 6. You shall keep your registration details for the App (“Login Details”) confidential and secure. Without prejudice to any other rights and remedies available to " +
        formik.values.shop_name +
        ", " +
        formik.values.shop_name +
        " reserves the right to promptly disable your Login Details and suspend your access to the App in the event that " +
        formik.values.shop_name +
        " has any reason to believe you have breached any of the provisions set out herein. <br /> 7. Notwithstanding the foregoing, " +
        formik.values.shop_name +
        " reserves the right to: <br /> 3.7.1. Accept or reject your application to register for any reason; and 3.7.2. Suspend your Account and/or refuse you access to the Services and/or App (partly or wholly) if you breach any of the provisions hereunder.<br /> 4. USER OBLIGATIONS <br /> 1. You agree that you are solely responsible and liable for all activities carried out by your use of the App. <br /> 2. You shall not submit to appear on the App through your use of the Services, any information, reviews, comments, images, third party URL links or other material whatsoever in any format (User Submissions”), whether within your personal Profile, when rating or submitting a review in relation to another User or seller or elsewhere on the App that, in " +
        formik.values.shop_name +
        "’s reasonable opinion, may be deemed to be offensive, illegal, inappropriate or that in any way: <br /> 4.2.1. Promote racism, bigotry, hatred or physical harm of any kind against any group or individual; <br /> 4.2.2. Harass or advocate harassment of another person; <br /> 4.2.3. display pornographic or sexually explicit material; <br /> 4.2.4. promote any conduct that is abusive, threatening, obscene, defamatory or libelous; <br /> 4.2.5. promote any illegal activities; <br /> 4.2.6. provide instructional information about illegal activities, including violating someone else’s privacy or providing or creating computer viruses; <br /> 4.2.7. Promote or contain information that you know or believe to be inaccurate, false or misleading; <br /> 4.2.8. engage in or promote commercial activities and/or sales, including but not limited to contests, sweepstakes, barter, advertising and pyramid schemes, without the prior written consent of " +
        formik.values.shop_name +
        "; or <br /> 4.2.9. Infringe any rights of any third party. <br /> 3. You acknowledge that making a User Submission does not guarantee that such User Submission, or any part thereof, shall appear on the App whether or not the submission of such User Submission is part of the Services. You agree that " +
        formik.values.shop_name +
        " may, at its sole discretion, choose to display or to remove any User Submission or any part of the same that you make on the App, and you hereby grant to " +
        formik.values.shop_name +
        " a non-exclusive, perpetual, irrevocable, worldwide license to do so. <br /> 4. You warrant and represent that you own or are licensed to use any and all patents, trademarks (whether registrable or non-registrable), designs, rights in database, rights in software (including without limitation the source and object code), copyright and all proprietary rights ( “Intellectual Property Rights”) in all User Submissions that you make to the App as part of your use of the Services. <br /> 5. You hereby grant to " +
        formik.values.shop_name +
        " a non-exclusive, irrevocable license to make the User Submissions available to other Users of the App. <br /> 6. If you feel that any User Submission made by another User is objectionable, please contact " +
        formik.values.shop_name +
        " using the contact details set out on the App. " +
        formik.values.shop_name +
        " shall use its reasonable endeavors to review the relevant User Submission as soon as is practicable and shall take such action as it deems necessary, if any at all. <br /> 7. You further agree that at all times, you shall: <br /> 4.7.1. not use your Login Details with the intent of impersonating another person; <br /> 4.7.2. not allow any other person to use your Login Details; <br /> 4.7.3. not use the information presented on the App or provided to you by " +
        formik.values.shop_name +
        " for any commercial purposes; <br /> 4.7.4. not do anything likely to impair, interfere with or damage or cause harm or distress to any persons using the App or in respect of the network; <br /> 4.7.5. not infringe any rights of any third parties; <br /> 4.7.6. contact " +
        formik.values.shop_name +
        " at " +
        userDetails.contact_email +
        " immediately if you consider any User Submission posted by another User to breach any of the Terms herein; <br /> 4.7.7. comply with all instructions and policies from " +
        formik.values.shop_name +
        " from time to time in respect of the use of the Platform, the Services and the App; <br /> 4.7.8. co-operate with any reasonable security or other checks or requests for information made by " +
        formik.values.shop_name +
        " from time to time; and <br /> 4.7.9. use the information made available to you on the App and through the Services at your own risk. <br /> 8. In the event that you have a dispute with any other User of the App, you hereby release " +
        formik.values.shop_name +
        "from any claims, demands and damages (whether actual or consequential) of any kind and nature, known and unknown, arising out of or in connection with such dispute. <br /> 5. EXCLUSION OF WARRANTIES AND " +
        formik.values.shop_name +
        "’S LIMITATION OF LIABILITY <br /> 1. Subject to clause 5.4 and 5.5, if " +
        formik.values.shop_name +
        " fails to comply with these Terms, " +
        formik.values.shop_name +
        " shall be entitled to be given a reasonable opportunity to rectify any errors and to re-perform its obligations hereunder. If " +
        formik.values.shop_name +
        "‘s failure to comply with its obligations is not remedied as in this clause 5.1, then " +
        formik.values.shop_name +
        "shall only be liable for losses (whether arising on contract, tort (including negligence) or otherwise) which are a reasonably foreseeable consequence of such failure, up to a maximum of one hundred rupees (Rs 100.00). <br /> 2. Further, you acknowledge and agree that where the App includes views, opinions, advice or recommendations, such views, opinions, advice and recommendations are not endorsed by " +
        formik.values.shop_name +
        " and to the maximum extent permitted by law," +
        formik.values.shop_name +
        " excludes all liability for the accuracy, defamatory nature, completeness, timeliness, suitability or otherwise of such views, opinions, advice or recommendations. <br /> 3. " +
        formik.values.shop_name +
        "does not verify and does not have any control in respect of any User Submission, or other information made available to you through your use of the Platform, the Services and/or the App. Consequently, " +
        formik.values.shop_name +
        " does not warrant or guarantee the accuracy, correctness, reliability, suitability or at all in respect of any User Submission or any other information made available to you through your use of the items, the Services and/or the App. " +
        formik.values.shop_name +
        "advises you not to rely on it to assist in making or refraining from making a decision, or to assist in deciding on a course or specific cause of action. If you so intend to use and/or rely upon any User Submission or any other information made available to you through your use of the Platform, the Services and/or the App, you do so at your own risk and liability. <br /> 4. Subject to clause 5.5, " +
        formik.values.shop_name +
        " shall not be liable for losses that result from its failure to comply with these Terms that fall into the following categories: <br /> 5.4.1. consequential, indirect or special losses; <br /> 5.4.2. loss of profits, income or revenue; <br /> 5.4.3. loss of savings or anticipated savings, interest or production; <br /> 5.4.4. loss of business or business benefits; <br /> 5.4.5. loss of contracts; <br /> 5.4.6. loss of opportunity or expectations; <br /> 5.4.7. loss of goodwill and/or reputation; <br /> 5.4.8. loss of marketing and/or public relations time and/or opportunities; <br /> 5.4.9. loss of data; or <br /> 5.4.10. loss of management or office time or any other losses howsoever arising and whether caused by tort (including negligence), breach of contract or otherwise, even if foreseeable. <br /> 5. Nothing in these Terms excludes or limits " +
        formik.values.shop_name +
        "’s liability for: <br /> 5.5.1. death or personal injury caused by its negligence; <br /> 5.5.2. fraud or fraudulent misrepresentation; or <br /> 5.5.3. any other matter for which it would be illegal for " +
        formik.values.shop_name +
        " to exclude or attempt to exclude its liability. <br /> 6. Commentary and other materials posted on the App or provided by " +
        formik.values.shop_name +
        " are not intended to amount to advice on which reliance should be placed. " +
        formik.values.shop_name +
        "therefore disclaims all liability and responsibility arising from any reliance placed on such materials by any User of the App, or by anyone who may be informed of any of its contents. Further, responsibility for decisions taken on the basis of information, suggestions and advice given to you by " +
        formik.values.shop_name +
        " shall remain solely with you. <br /> 7. " +
        formik.values.shop_name +
        " does not in any way participate nor shall it be liable in any way for whatever reason for any communication, transaction, meet-up, set-up or relationship between you and other Users." +
        formik.values.shop_name +
        " therefore recommends that you take all safety precautions when contacting, socialising and engaging in social gatherings or meetings, including without limitation with regard to the delivery of items, with other Users. <br /> 6. INTELLECTUAL PROPERTY RIGHTS <br /> 1. " +
        formik.values.shop_name +
        " and its licensors own all the intellectual property rights relating to the App, Services and Platform. <br /> 2. You are expressly prohibited from: <br /> 6.2.1. Reproducing, copying, editing, transmitting, uploading or incorporating into any other materials, any of the App; and <br /> 6.2.2. removing, modifying, altering or using any registered or unregistered marks/logos/designs owned by " +
        formik.values.shop_name +
        " or its licensors, and doing anything which may be seen to take unfair advantage of the reputation and goodwill of " +
        formik.values.shop_name +
        "or could be considered an infringement of any of the rights in the Intellectual Property Rights owned by and/or licensed to " +
        formik.values.shop_name +
        ". <br /> 3. Provided that " +
        formik.values.shop_name +
        " is unaware of any infringement of any third party intellectual property rights at the time you submit any User Submissions, " +
        formik.values.shop_name +
        "shall not be liable in any way to you or any third party for any breach of such rights subsequently notified to you or " +
        formik.values.shop_name +
        " . <br /> 7. PRIVACY AND DATA PROTECTION <br /> 1. " +
        formik.values.shop_name +
        " complies with the Data Protection Act 1998 and all other successor legislation and regulations in the performance of its obligations under these Terms. Please click here to view " +
        formik.values.shop_name +
        "’s Privacy Policy. The terms of the Privacy Policy form part of these Terms and you agree to be bound by them. <br /> 8. FORCE MAJEURE <br /> 1. " +
        formik.values.shop_name +
        " shall not be liable or responsible for any failure to perform, or delay in performance of, any of its obligations under these Terms that is caused by events outside its reasonable control (“Force Majeure Event”). <br /> 2. A Force Majeure Event includes any act, event, non-happening, omission or accident beyond " +
        formik.values.shop_name +
        "’s reasonable control and includes in particular (without limitation) the following: <br /> 8.2.1. strikes, lock-outs or other industrial action; <br /> 8.2.2. civil commotion, riot, invasion, terrorist attack or threat of terrorist attack, war (whether declared or not) or threat or preparation for war; <br /> 8.2.3. fire, explosion, storm, flood, earthquake, subsidence, epidemic or other natural disaster; <br /> 8.2.4. impossibility of the use of railways, shipping, aircraft, motor transport or other means of public or private transport; <br /> 8.2.5. impossibility of the use of public or private telecommunications networks; and <br /> 8.2.6. the acts, decrees, legislation, regulations or restrictions of any government. <br /> 3. " +
        formik.values.shop_name +
        "’s performance under these Terms is deemed to be suspended for the period that the Force Majeure Event continues, and " +
        formik.values.shop_name +
        "shall have an extension of time for performance for the duration of that period. " +
        formik.values.shop_name +
        "will use its reasonable endeavours to bring the Force Majeure Event to a close or to find a solution by which its obligations under these Terms may be performed despite the Force Majeure Event. <br /> 9. COMPLAINTS AND TERMINATION <br />  1. If you wish to lodge a complaint about another User for breaching any of these Terms, you may do so by clicking on “Report Abuse” on the App or send " +
        formik.values.shop_name +
        "details of your complaint by using the “Contact Us” form available on the App. " +
        formik.values.shop_name +
        "will use its reasonable endeavours to respond to your complaints within a reasonable time and to take reasonable action which it deems appropriate to resolve or rectify the subject matter of such complaints. <br /> 2. " +
        formik.values.shop_name +
        " may suspend or terminate your use of the Services and/or App if: <br /> 9.2.1. any of " +
        formik.values.shop_name +
        "’s third party communication network providers cease to make their services available to " +
        formik.values.shop_name +
        " for any reason; <br /> 9.2.2. " +
        formik.values.shop_name +
        " believes you or someone using your login details has failed to comply with one or more of these Terms; <br /> 9.2.3. " +
        formik.values.shop_name +
        " believes there has been fraudulent use, misuse or abuse of the Services; <br /> 9.2.4. W" +
        formik.values.shop_name +
        " believes you have provided any false, inaccurate or misleading information. <br /> 3. On termination, your access to the App shall cease and " +
        formik.values.shop_name +
        " may delete your Profile. <br /> 10. GENERAL <br /> 1. If " +
        formik.values.shop_name +
        " fails at any time to insist upon strict performance of its obligations under these Terms, or if it fails to exercise any of the rights or remedies to which it is entitled under these Terms, this will not constitute a waiver of any such rights or remedies and shall not relieve you from compliance with such obligations. <br /> 2. A waiver by " +
        formik.values.shop_name +
        " of any default shall not constitute a waiver of any subsequent default. <br /> 3. No waiver by " +
        formik.values.shop_name +
        "of any of these Terms shall be effective unless it is expressly stated to be a waiver and is communicated to you in writing. <br /> 4. For the avoidance of doubt, references to ‘writing’ shall be deemed to include email. <br /> 5. " +
        formik.values.shop_name +
        "reserves the right to use third party suppliers or sub-contractors at any time and in any way in respect of the performance of its obligations under these Terms. <br /> 6. If any of these Terms is determined by any competent authority to be invalid, unlawful or unenforceable to any extent, such term, condition or provision will to that extent be severed from the remaining terms, conditions and provisions which shall continue to be valid to the fullest extent permitted by law. <br /> 7. These Terms and any document expressly referred to in them represent the entire agreement between you and " +
        formik.values.shop_name +
        "in respect of your use of the App and your purchase and use of the Platform and the Services, and shall supersede any prior agreement, understanding or arrangement between you and " +
        formik.values.shop_name +
        " , whether oral or in writing. <br /> 8. You acknowledge that in entering into these Terms, you have not relied on any representation, undertaking or promise given by or implied from anything said or written whether on the App, the internet or in negotiation between you and " +
        formik.values.shop_name +
        "except as expressly set out in these Terms. <br /> 9. " +
        formik.values.shop_name +
        " may alter or amend our Terms by giving you reasonable notice. By continuing to use the App after expiry of the notice period, or accepting the amended Terms (as we may decide at our sole discretion), you will be deemed to have accepted any amendment to these Terms. If, on receipt of such notice, you wish to terminate your access to the App, you may do so by giving us not less than 7 (seven) day’s written notice, (which may be by e-mail), such termination to take effect on the date upon which the amended Terms would otherwise have come into effect. <br /> 10. These Terms are governed by and construed in accordance with Indian law. The Courts of India shall have exclusive jurisdiction over any disputes arising out of these Terms. If you live outside India, Indian law shall apply only to the extent that it does not deprive you of any legal protection accorded under the law of the place where you are habitually resident. If Indian law deprives you of any legal protection which is accorded to you under your local law, these terms will be governed by your local law and any dispute or claim arising out of or in connection with these Terms shall be subject to the non-exclusive jurisdiction of the courts where you are habitually resident. <br /> SECTION B: USERS TERMS AND CONDITIONS <br /> 11. INTRODUCTION <br /> 1. Upon registration as a User, and in consideration of your compliance with these terms and conditions, " +
        formik.values.shop_name +
        " will provide you with the User Services as described on the App and in this section B. You are a User if you submit Orders through the Platform. <br /> 12. USER SERVICES <br /> 1. Subject to clause 1.4 of Section A above, the User Services will comprise of the following: <br /> 12.1.1. the facility to create a Profile page; <br /> 12.1.2. the ability to search for items you have registered with the web app for Order; <br /> 12.1.3. the ability to communicate with other Users using the App; <br /> 12.1.4. access to any other features and functionality for the User Services provided by " +
        formik.values.shop_name +
        " Users from time to time. <br /> 2. You acknowledge and agree that all Orders are subject to acceptance by the users. The contract for fulfilment of an Order is created between you and the seller, which will only be formed once you have received such acceptance. " +
        formik.values.shop_name +
        " is not responsible for either party’s performance under such a contract and " +
        formik.values.shop_name +
        " makes no guarantee that the obligations of either party under the contract will be fulfilled. <br /> 3. All items sold on the App are perishable, therefore cancellations or refunds may not permitted by sellers. <br /> 4. In Case of online payment done by the user and the order is not fulfilled for some reasons , the user can contact " +
        formik.values.shop_name +
        "  for claiming the refund .In such cases , " +
        formik.values.shop_name +
        " will investigate the issue and if found reasonable will initiate the refund to the user at its own discretion. <br /> 13. ADDITIONAL OBLIGATIONS AS A USER <br /> 1. You must at all times use the User Services and the webapp in accordance with these Terms. In particular, all content and material uploaded to or forming part of your Profile must comply with the rules relating to User Submissions set out in Section A of these Terms. <br /> 2. As a User, you are responsible for: <br /> 13.2.1. ascertaining the identity of the Seller; <br /> 13.2.2. verifying the Price of any items/services , which you acknowledge may fluctuate from time to time and will be determined at the seller’s sole discretion; <br /> 13.2.3. ensuring you have sufficient information relating to any health & safety risks, including ascertaining that the seller is, where applicable registered with their local environmental health department; <br /> 13.2.4. verification of all information provided by seller in relation to any item provided, including the ingredients. <br /> 3. In using the User Services, you must: <br /> 13.3.1. not provide information (including in your Profile) which you know to be inaccurate, false, incomplete, untrue or is or may be deemed to be a misrepresentation of the facts; <br /> 13.3.2. immediately notify " +
        formik.values.shop_name +
        " in the event you have any reason to believe or suspect that a seller or another User has breached any of the terms under Section A or that any seller profile is not genuine, or is false, inaccurate and/or incomplete. <br /> 14. CANCELLATIONS AND REFUNDS <br /> 1. You acknowledge that the legal right to cancel and obtain a refund under consumer legislation may not apply in respect of your Order. However, and unless expressly stated by a seller to the contrary, " +
        formik.values.shop_name +
        "operates the following cancellation and refund policy in respect of Orders (“Refund Policy”): <br /> 14.1.1. you may cancel your Order and obtain a full refund of the Price, provided such cancellation is received by the seller in writing (including by e-mail), or by following the seller’s cancellation procedure, which needs to be dealt between yourself and " +
        formik.values.shop_name +
        " will be not be responsible for any conflicts arise out of the same. <br /> 21. CHARGES AND PAYMENTS <br /> 1. All payments from Users made through the App shall be made via such payment processor as " +
        formik.values.shop_name +
        " may choose (“Payment Processor”) to " +
        formik.values.shop_name +
        " , who will remit to you: <br /> 21.1.1. the amount received from the Users in respect of the Order (“Sale Price”); <br /> 21.1.2. less any fees charged by the Payment Processor; and <br /> 21.1.3. less our commission at the rate notified to you during the registration process (“Commission”), <br /> within thirty (30) days of receipt of the applicable payment by " +
        formik.values.shop_name +
        " from the Payment Processor. <br /> 2. Where a User requests a refund, the seller shall comply with the Refund Policy set out in Section B or such other policy as the seller may notify the User in writing. Where the User is entitled to a refund under the Refund Policy, the seller shall refund the Sale Price less the Commission (“Refund Monies”) to " +
        formik.values.shop_name +
        " immediately. W" +
        formik.values.shop_name +
        "shall refund the Sale Price to the User within 5 days of receipt of the Refund Monies. <br /> 3. You shall pay all other fees and charges notified to you during the registration process (“Fees”). The Fees shall be due and payable in accordance with the payment terms notified to you during registration. The Fees are exclusive of VAT and other sales tax which shall, where applicable, be paid in addition. <br /> 4. We may change the Commission and/or Fees at any time on the provision of notice to you in writing, by email or through your use of the App. Your continued use of the App following notice of such change shall be deemed to be your acceptance of the new Commission and/or Fees. If you do not agree with the changes to the Commission and/or Fees, you may terminate your agreement with us by notice in writing or by email. <br /> 22. ADDITIONAL EXCLUSION OF WARRANTIES <br /> 1. You acknowledge and agree that " +
        formik.values.shop_name +
        "only provides you with the facility to post and supply items to Users by providing you with the Online Home Shoppe Services. " +
        formik.values.shop_name +
        " does not warrant, represent or guarantee that you will find any Users to deliver  Items to or achieve any specific results whatsoever. <br /> 2. You acknowledge and agree that using the Platform through the App may require registration as a business and a food hygiene & safety certificate. Your use and reliance on any information on the App shall be at your own risk and we shall not be liable whatsoever for any damages and loss which you may incur as a result of or in connection with your use and reliance of such information. You undertake to conduct your own research and ensure that you comply with the requirements applicable to you. " +
        formik.values.shop_name +
        "shall not be liable to you for any failure by you to comply with any relevant laws and regulations that may apply to you in the use of the Platform through the App. <br /> 3. You further agree that " +
        formik.values.shop_name +
        " does not vet or verify the identity of the Users posted on the App. Consequently, " +
        formik.values.shop_name +
        " does not warrant or guarantee: <br /> 22.3.1. the currentness, completeness, correctness and accuracy of any Users’ Profile; <br /> 22.3.2. that any Orders made by Users are genuine; <br /> 22.3.3. the identity of the Users using the App. <br /> 4. You further acknowledge that " +
        formik.values.shop_name +
        " has no control of and therefore has no liability whatsoever in respect of the behaviour, response and quality of the Users on the App. <br /> 5. " +
        formik.values.shop_name +
        " provides the services solely to connect you, Users who may be seeking to Order items/services from you. You acknowledge and agree that you are solely responsible for all communication with, and any subsequent dealings with, Users (including but not limited to the terms upon which you create and deliver items to Users). You, the sellers, hereby indemnify " +
        formik.values.shop_name +
        " in full and on demand against all losses, damages, costs, claims and expenses that " +
        formik.values.shop_name +
        " incurs (including but not limited to such losses and damages incurred by " +
        formik.values.shop_name +
        " in respect of sickness, disease or death of any User arising out of or in connection with your acts or omissions in the use of the Platform) arising out of or in connection with any of your dealings with, provided to, Users.";

      formik.setFieldValue("terms", terms_new);
    } else {
      formik.setFieldValue("terms", "");
    }
  };

  const handleChangeChkcus_love = (event) => {
    setcuslovechecked(!cuslovechecked);

    // event.preventDefault();

    if (event.target.checked) {
      // let cus_love = cuslove;
      // formik.setFieldValue("cuslove", cus_love);

      if (templateid == 1) {
        let cus_love =
          "We pick the convenient delivery slots to have your grocery delivered. This is available for customers from <place name>, to their doorstep. We work hard for customer loyalty, trust and confidence, by taking feedback and giving our customers what they want.";

        formik.setFieldValue("cuslove", cus_love);
      }

      if (templateid == 2) {
        let cus_love =
          "The collection is unique & affordable. You can comfortably fit into something without it being too big or too small. We have a variety of styles and we’re versatile. Our customers love staying in trend with the fashion industry! We provide smooth, hassle free delivery at your doorstep";

        formik.setFieldValue("cuslove", cus_love);
      }

      if (templateid == 3) {
        let cus_love =
          "Our dishes leave a mark on your mind. We make necessary changes in order to continue offering you the quality you expect and deserve. Available for order timings We provide delivery at your doorstep";

        formik.setFieldValue("cuslove", cus_love);
      }
    } else {
      formik.setFieldValue("cuslove", "");
    }
  };

  const handleChangeChk = (event) => {
    setChecked(!checked);

    console.log(" Template id : " + templateid);

    if (event.target.checked) {
      if (formik.values.shop_name != "") {
        if (userDetails.City != undefined) {
          if (templateid == 1) {
            let about_us =
              formik.values.shop_name +
              " from " +
              userDetails.City +
              " delivers the freshest and top quality food and daily essentials ranging from hundreds of branded items that will be handpicked and delivered to your home, all at the click of a button! We bring many products closer to our customers. All your daily needs are covered here. Remove all the stress associated with shopping for daily essentials without travelling long distances or standing in queues. Hassle-free Home Delivery options.";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 2) {
            let about_us =
              formik.values.shop_name +
              " aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 3) {
            let about_us =
              formik.values.shop_name +
              " provided in all its outlets! With the magic of taste and good prosperity, we're dedicated to making fresh and flavorful dishes that you and your family & friends will love. Our ingredients and food are prepared fresh everyday to ensure our dishes exceed your expectations. Hassle-free Home Delivery options available";

            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid > 3) {

            console.log("error working 3")

            if(formik.values.shop_name!=undefined)
            {
              let about_us =
              formik.values.shop_name +
              " aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
              formik.setFieldValue("aboutUs", about_us);
            }
            else
            {
              let about_us =
              "Store Name aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
              formik.setFieldValue("aboutUs", about_us);
            }

            
          }

        } else {
          if (templateid == 1) {
            let about_us =
              formik.values.shop_name +
              " from Location delivers the freshest and top quality food and daily essentials ranging from hundreds of branded items that will be handpicked and delivered to your home, all at the click of a button! We bring many products closer to our customers. All your daily needs are covered here. Remove all the stress associated with shopping for daily essentials without travelling long distances or standing in queues. Hassle-free Home Delivery options. ";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 2) {
            let about_us =
              formik.values.shop_name +
              " aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 3) {
            let about_us =
              formik.values.shop_name +
              " provided in all its outlets! With the magic of taste and good prosperity, we're dedicated to making fresh and flavorful dishes that you and your family & friends will love. Our ingredients and food are prepared fresh everyday to ensure our dishes exceed your expectations. Hassle-free Home Delivery options available";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid > 3) {

            if(formik.values.shop_name!=undefined)
            {

              console.log("error working 1")
              let about_us =
              formik.values.shop_name +
              " aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
              formik.setFieldValue("aboutUs", about_us);
            }
            else
            {
              
              let about_us =
              "Store Name aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
              formik.setFieldValue("aboutUs", about_us);
            }
            
          }
        }
      } else {
        if (userDetails.City != undefined) {
          if (templateid == 1) {
            let about_us =
              "Store Name from " +
              userDetails.City +
              " delivers the freshest and top quality food and daily essentials ranging from hundreds of branded items that will be handpicked and delivered to your home, all at the click of a button! We bring many products closer to our customers. All your daily needs are covered here. Remove all the stress associated with shopping for daily essentials without travelling long distances or standing in queues. Hassle-free Home Delivery options.";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 2) {
            let about_us =
              "Store Name " +
              userDetails.City +
              " aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 3) {
            let about_us =
              "Restaurant Name " +
              userDetails.City +
              " provided in all its outlets! With the magic of taste and good prosperity, we're dedicated to making fresh and flavorful dishes that you and your family & friends will love. Our ingredients and food are prepared fresh everyday to ensure our dishes exceed your expectations. Hassle-free Home Delivery options available";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid > 3) {

            console.log("error working 2")

            let about_us =
              "Store Name " +
              userDetails.City +
              " aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
            formik.setFieldValue("aboutUs", about_us);
          }
        } else {
          if (templateid == 1) {
            let about_us =
              "Store Name from Location Name delivers the freshest and top quality food and daily essentials ranging from hundreds of branded items that will be handpicked and delivered to your home, all at the click of a button! We bring many products closer to our customers. All your daily needs are covered here. Remove all the stress associated with shopping for daily essentials without travelling long distances or standing in queues. Hassle-free Home Delivery options.";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 2) {
            let about_us =
              "Store Name aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid == 3) {
            let about_us =
              "Restaurant Name provided in all its outlets! With the magic of taste and good prosperity, we're dedicated to making fresh and flavorful dishes that you and your family & friends will love. Our ingredients and food are prepared fresh everyday to ensure our dishes exceed your expectations. Hassle-free Home Delivery options available";
            formik.setFieldValue("aboutUs", about_us);
          }

          if (templateid > 3) {
            let about_us =
              "Store Name aims to provide you with products of high quality at reasonable prices. Choose, order and get the collection delivered at your doorstep. We thrive on reliability and dependability to the highest standards, being transparent & going the extra mile. Our success is due to our attention to detail and consistency of service. Ensuring that you look your absolute best with out collection, everywhere you go! Hassle-free Home Delivery options";
            formik.setFieldValue("aboutUs", about_us);
          }
        }
      }
    } else {
      formik.setFieldValue("aboutUs", "");
    }
  };

  const [statepicker, setstatepicker] = useState({
    displayColorPicker: false,
  });

  const popover = {
    position: "absolute",
    zIndex: "2",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  const handleChangeComplete = (color) => {
    setstatecolor({ background: color.hex });

    formik.setFieldValue("colorCode", color.hex);
  };

  const handleClick = () => {
    setstatepicker({ displayColorPicker: !statepicker.displayColorPicker });
  };

  function deleteFile(e) {
    const s = shopDetails.bannerImage.filter((item, index) => index !== e);
    // setImagesvalue(s);
    // console.log(s);
  }

  const handleChange = (event) => {
    // setselectedValue(event);

    formik.setFieldValue("returndays", event);
    // console.log(event);

    if (event > 0) {
      let return_txt =
        `Once the order is shipped and delivered, customer will have a button activated against his order for Return. <br />
      Return of orders has to be done with valid reasons and image upload option where if the product is not what he ordered or if the product is damaged. <br />
      General return without reason will not be accepted <br />
      Return can be initiated within (` +
        event +
        ` days) of receiving the products otherwise the return of goods will not be entertained <br />
      Refund will not be made for return. <br />
      based on damage or wrong product sent, correct product will be dispatched by the Shop again upon receiving the returned product from the customer. <br />
      Merchant will initiate pickup request for the orders to be returned and shop will ship the correct order again. <br />
      Shop will not entertain replacement if the alternate goods are damaged or used or if the quantity is found to be less. <br />
      `;
      formik.setFieldValue("return", return_txt);
    } else {
      formik.setFieldValue("return", "");
    }
  };

  const handlegalleryClick = () => {
    setDialogOpengallery(true);
    // if(imageArray.length<=4)
    // {
    //   setDialogOpengallery(true);
    // }
    // else
    // {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "You have reached the limit",
    //   });
    // }
  };

  const handleCategorygalleryClick = () => {
    setDialogOpencategorygallery(true);
  };

  const handlethemeClick = () => {
    setDialogOpentheme(true);
  };

  const nextstep = () => {
    // if(shopID!=undefined)
    // {
    //   formData.append("iShop", shopID);
    // }

    dispatch(setiShop(shopID));
    stepChange(1);
  };

  const setFile = (e, elName) => {
    // console.log(e);
    let t = [...imageArray, e.currentTarget.files[0]];
    setImageArray(t);
    // console.log(t);
    // formik.setFieldValue(elName, e.currentTarget.files[0]);
    formik.setFieldValue(elName, t);
  };

  // const setCategoryFile = (e, elName) => {
  //   // console.log(e);
  //   setcategoryImageArray([]);

  //   if (e.currentTarget.files) {

  //     let items = [...categoryimageArray];

  //     let item1 = { ...items[0] };

  //     item1 = e.currentTarget.files[0];

  //     items[0] = item1;

  //     setcategoryImageArray(items);

  //     // setcategoryImageArray(null)
  //     // setcategoryImageArray(e.currentTarget.files[0])

  //     // setcategoryImageArray(categoryimageArray => (
  //     //       [...categoryimageArray, e.currentTarget.files[0]]
  //     //     ))

  //     // console.log("Image file : " + JSON.stringify(e.currentTarget.files));
  //     //   let t = []

  //     //   for(let i=0; i<e.currentTarget.files.length; i++)
  //     //   {
  //     //     console.log("Image file : " + JSON.stringify(e.currentTarget.files[i]));

  //     //     // setcategoryImageArray(categoryimageArray => (
  //     //     //   [...categoryimageArray, e.currentTarget.files[i]]
  //     //     // ))

  //     //     setcategoryImageArray([...categoryimageArray, e.currentTarget.files[i]])

  //     //     // setcategoryImageArray(categoryimageArray => (
  //     //     //   ia[i]
  //     //     // ))

  //     //   }

  //     // setcategorygalleryImage([]);
  //   }

  //   // if(e.currentTarget.files.length>0)
  //   // {
  //   //   setcategoryImageArray([]);

  //   //   // setcategoryImageArray(categoryimageArray => (
  //   //   //   [...categoryimageArray, e.currentTarget.files[0]]
  //   //   // ))

  //   //   let t = [...categoryimageArray, e.currentTarget.files[0]];
  //   //   setcategoryImageArray(t);
  //   // }

  //   // console.log(t);
  //   // formik.setFieldValue(elName, e.currentTarget.files[0]);
  //   // formik.setFieldValue(elName, t);
  // };

  const setCategoryFile = (e, elName) => {
    // console.log(e);
    setcategoryImageArray("");

    if (e.currentTarget.files) {
      // let items = [...categoryimageArray];

      // let item1 = { ...items[0] };

      // item1 = e.currentTarget.files[0];

      // items[0] = item1;

      setcategoryImageArray(e.currentTarget.files[0]);
    }
  };

  const deleteImageFromArray = (i) => {
    let t = imageArray.filter((item) => i !== item);
    setImageArray(t);
  };

  const deletecategoryImageFromArray = (i) => {
    let t = categoryimageArray.filter((item) => i !== item);
    setcategoryImageArray(t);
  };

  const handleChangedomain = (event) => {
    // setSelectedValue(event.target.value);

    // console.log("Check radio : " + event.target.value);

    if (event.target.value == "1") {
      setdomainValue(1);
      // formik.setFieldValue("shop_url", "")
      formik.setFieldValue("ownDomain", "");
      // console.log("Shop name : " + formik.values.shop_name)
    } else {
      setdomainValue(2);
      //const res = formik.values.shop_name.replace(/ /g, "");
      // console.log("Shop name : " + res); // BJ721JL

      // formik.setFieldValue("shop_url", res)
      formik.setFieldValue("ownDomain", "");
    }
  };

  const handleChangeNewdomain = (event) => {
    // setSelectedValue(event.target.value);

    // console.log("Check radio : " + event.target.value);

    if (event.target.value == "1") {
      setNewDomainValue(1);
      //formik.setFieldValue("ownDomain", "");
    } else {
      setNewDomainValue(2);
      //formik.setFieldValue("ownDomain", "");
    }
  };

  
  const handleChangeDomainSearch = (event) => {
    console.log(event.target.value);
    formik.setFieldValue("domain_name_search",event.target.value);
  };

  
  const handleDomainSearchSubmit = async () => {
     
     let domain = formik.values.domain_name_search;
     console.log(domain);
     setoverlay_on(true);
     setprogress_on(true);
     
     await axios
      .get(
        `mylapay/shop/godaddy/domain-suggestion?domain=${domain}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === 1) {
          if (res.data.data.length === 0) return;
          setDomainList(res.data.data);
          setoverlay_on(false);
          setprogress_on(false);
        }
      })
      .catch((err) => console.log(err));
    
  };

  const handleChangegallery = (event) => {
    // console.log("Check radio : " + event.target.value);

    if (event.target.value == "custom") {
      setgalleryvalue("custom");
    } else if (event.target.value == "theme") {
      setgalleryvalue("theme");
    } else if (event.target.value == "gallery") {
      setgalleryvalue("gallery");
    }
  };

  const handlethemePreviewClick = (item_url, index) => {
    // console.log("Selected theme : " + mylapaygallery[index].pdfpath)

    // https://shop.mylapay.com/demoshop/apparel?theme=Theme2&layout=grocery

    if (index == 0) {
      window.open(
        `${REACT_APP_SHOP_URL}/demoshop/grocery/${item_url}/demo/${templateid}`
      );
    }

    if (index == 1) {
      window.open(
        `${REACT_APP_SHOP_URL}/demoshop/apparel/${item_url}/demo/${templateid}`
      );
    }

    if (index == 2) {
      window.open(
        `${REACT_APP_SHOP_URL}/demoshop/restaurant/${item_url}/demo/${templateid}`
      );
    }

    // window.open(`${REACT_APP_SHOP_URL}/demoshop/${templateid}?theme=${item_url}&layout=${index}`);

    // if(templateid==1)
    // {
    //   window.open(`${REACT_APP_SHOP_URL}/demoshop/${item_url}/grocery`);
    // }

    // if(templateid==2)
    // {
    //   window.open(`${REACT_APP_SHOP_URL}/${item_url}/apparel`);
    // }

    // if(templateid==3)
    // {
    //   window.open(`${REACT_APP_SHOP_URL}/${item_url}/restaurant`);
    // }
  };

  const handlePreviewClick = () => {
    setoverlay_on(true);
    setprogress_on(true);

    // setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 25));

    if (optionSelected != null) {
      // console.log(
      //   "Save and continue values : " +
      //     JSON.stringify(mylapaygallery[optionSelected]["Template_Url"])
      // );

      if (optionSelected != null) {
        formik.values.iTheme = JSON.stringify(
          mylapaygallery[optionSelected]["iTemplate"]
        );
      }
      if (themeoptionSelected != null) {
        formik.values.iSub_Template = JSON.stringify(
          selectedthemelist[themeoptionSelected]["iSub_Template"]
        );
      }

      formik.values.iTemplate = templateid;

      formik.values.facebook =
        "https://www.facebook.com/" + formik.values.facebook;
      formik.values.instagram =
        "https://www.instagram.com/" + formik.values.instagram;
      formik.values.pinterest =
        "https://www.twitter.com/" + formik.values.pinterest;

      const formData = new FormData();

      Object.keys(formik.values).forEach((key) =>
        formData.append(key, formik.values[key])
      );

      // if (optionSelected != null) {
      //   formData.append(
      //     "iTheme",
      //     JSON.stringify(mylapaygallery[optionSelected]["iTemplate"])
      //   );
      // }

      // if (themeoptionSelected != null) {
      //   formData.append(
      //     "idSub_Template",
      //     JSON.stringify(
      //       selectedthemelist[themeoptionSelected]["iSub_Template"]
      //     )
      //   );
      // }

      console.log("FAQ values : " + JSON.stringify(formValues.length));

      let faq_empty = 0;

      if (formValues.length > 0) {
        for (var i = formValues.length - 1; i >= 0; i--) {
          if (formValues[i].question == "" || formValues[i].answer == "") {
            faq_empty = 1;
          }
        }

        if (faq_empty == 1) {
          Swal.fire({
            title: "Are you sure?",
            text: "FAQ Section has empty want to edit?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#20295C",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then(async (result) => {
            if (result.isConfirmed) {
            } else {
              formValues.splice(i, 1);
              faq_empty = 0;
            }
          });
        }

        if (faq_empty == 0) {
          console.log("FAQ values : " + JSON.stringify(formValues));

          formData.append("faq", JSON.stringify(formValues));

          if (businessHoursValues) {
            formData.append(
              "business_hours",
              JSON.stringify(businessHoursValues)
            );
            // console.log(businessHoursValues);
          }

          formData.append("categoryCode", localStorage.getItem("MCC_Code"));

          if (shopID != undefined) {
            formData.append("iShop", shopID);
          }

          // console.log("Image Length : " + image_length);
          // console.log("banner Image Length : " + imageArray.length);

          if (imageArray.length > 0) {
            for (var i = 0; i < imageArray.length; i++) {
              formData.append("shop_banner_" + i, imageArray[i]);
            }
          }

          // if (categoryimageArray.length > 0) {
          //   for (var i = 0; i < categoryimageArray.length; i++) {
          //     formData.append("categorybannerImage", categoryimageArray[i]);
          //   }
          // }

          if (categoryimageArray != "") {
            formData.append("categorybannerImage", categoryimageArray);
          }

          // for (var pair of formData.entries()) {
          //   console.log(pair[0] + ", " + pair[1]);
          // }

          axios
            .post("/mylapay/shop/shop_details", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              // setProgress((prevProgress) => (80));

              if (res.data.status === 1) {
                setProgress((prevProgress) => 95);
                setoverlay_on(false);
                setprogress_on(false);

                // console.log("-------res.data.iShop----", res.data.iShop);
                dispatch(setiShop(res.data.iShop));
                // stepChange(1);
                // window.open(`${REACT_APP_SHOP_URL}/${shopDetails['shop_url']}/${shopDetails['caturl']}`)

                let url = `${REACT_APP_SHOP_URL}/${formik.values.shop_url}/${caturl}`;

                setpreviewurl(
                  "<iframe src=" + url + " style='width:130%; height:450px'/>"
                );

                setDialogOpen(true);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      // setLoading(false);
      // setoverlay_on(false);
      // setprogress_on(false);

      // console.log("Form data checj shop : " + JSON.stringify(formData));

      // console.log("Shop details : " + JSON.stringify(shopDetails));

      // {`${REACT_APP_SHOP_URL}/${value}/${tableMeta["rowData"][3]}`}
    } else {
      setoverlay_on(false);
      setprogress_on(false);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      // console.log("error log -------------->>>>>>>>>>>>>>>>>>");
    }
  };

  const handlefullscreen = () => {
    window.open(
      `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}`
    );
  };

  const handleClose = () => {
    setstatepicker({ displayColorPicker: false });
  };

  // const [dialogOpen, setDialogOpen] = useState(false);
  //const [shopCategories, setShopCategories] = useState([]);
  // const userDetails = useSelector((state) => state.auth.userDetails);

  // const shopDetails = null;

  const dispatch = useDispatch();

  useEffect(() => {
    // geShopData();
  }, [editItem]);

  // useEffect(() => {
  //   let fromTimeFixed = moment().set({ hour: 10, minute: 0 }).format("hh:mm A");
  //   let toTimeFixed = moment().set({ hour: 19, minute: 0 }).format("hh:mm A");
  //   console.log("Time fixed");
  //   console.log("Default Business Hours");
  //   console.log(fromTimeFixed);
  //   console.log(toTimeFixed);
  //   for (let i = 0; i <= 6; i++) {
  //     let cdtOpenTime = moment(fromTimeFixed, "HH:mm A");
  //     let dayOpenTime = i;
  //     handleFromTimeChange(cdtOpenTime, dayOpenTime);

  //     let cdtCloseTime = moment(toTimeFixed, "HH:mm A");
  //     let dayCloseTime = i;
  //     handleToTimeChange(cdtCloseTime, dayCloseTime);
  //   }
  //   // geShopData();
  // });

  const setShopLogo = (value) => {
    formik.setFieldValue("shop_logo", value);
  };

  const addFormFields = (value) => {
    // setFormValues(({
    //   formValues: [...formValues, { question: "", answer: "" }]
    // }))

    setFormValues([...formValues, { question: "", answer: "" }]);
  };

  const removeFormFields = (i) => {
    // let formValues_temp = formValues;
    // formValues_temp.splice(i, 1);
    // setFormValues({ formValues_temp });

    const list = [...formValues];
    list.splice(i, 1);
    setFormValues(list);
  };

  const handleChangequs = (i, e) => {
    // let formValues = formValues;

    // formValues[i][e.target.name] = formValues[i][e.target.name] + e.target.value;

    // console.log("working : " + JSON.stringify(formValues));

    // // console.log("working : " + JSON.stringify(formValues));

    // setFormValues({formValues});

    const { name, value } = e.target;
    const list = [...formValues];
    list[i][name] = value;
    setFormValues(list);
  };

  const setBannerimage = (value) => {
    // values.map((value) => {
    //   setbannerimages((oldValue) => [...oldValue, { key: value }]);
    // }

    // formik.setFieldValue("bannerImage", value);

    // console.log("Final images : " + JSON.stringify(value.length));

    // var chk_ara = [];

    // for (var i = 0; i < value.length; i++) {

    //   chk_ara.push(value[i]);

    //   // formik.setFieldValue("shop_banner_" + i, value[i]);

    //     console.log("Final images upload inside check a: " + JSON.stringify( chk_ara))
    //     setbannerimages([...banner_image, chk_ara])

    //     // setbannerimages(banner_image => [...banner_image, value[i]]);

    //     // console.log("Final images upload inside : " + JSON.stringify( banner_image))

    //   // console.log("Final images upload inside : " + JSON.stringify(chk_ara));
    //   // setbannerimages([...banner_image, chk_ara]);
    // }

    const tempArr = [];

    // [...value].forEach(file => {

    for (var i = 0; i < value.length; i++) {
      // console.log("file >>> ", value[i]);

      // tempArr.push({
      //   data: file,
      //   url: URL.createObjectURL(file)
      // });

      tempArr.push(value[i]);

      // console.log("pictures >> ", banner_image);
    }

    // });

    if (tempArr.length > 0) {
      setimagelength(tempArr.length);
      setbannerimages([...banner_image, tempArr]);
    }
  };

  const setSliderimage = (value) => {
    formik.setFieldValue("slider_images", value);
  };

  const handleDialogClosegallery = (value) => {
    handleDialoggallery(false);
  };

  const handleDialogClosecategorygallery = (value) => {
    handleDialogcategorygallery(false);
  };

  const handleDialogClosetheme = (value) => {
    handleDialogtheme(false);
  };

  const handleDialogthemesubmit = async () => {
    handleDialogtheme(false);

    if (optionSelected != null) {
      // setcaturl(mylapaygallery[optionSelected].Template_Url);
      // formik.setFieldValue(
      //   "caturl",
      //   mylapaygallery[optionSelected].Template_Url
      // );
    }
  };

  const handleselectedthemegallery = async () => {
    let countarr = imageArray.length + themegalleryimages.length;

    Swal.fire({
      title: "Are you sure?",
      text: "Selected images will appear in shop banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#20295C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (countarr <= 5) {
          let ia = await Promise.all(
            themegalleryimages.map(async (item) => {
              let imageFile = await createFileFromUrl(
                `${REACT_APP_SHOPAPI_URL}/uploads/${selectedthemeimages[item].Banner_Image}`,
                item
              );
              return imageFile;
            })
          );
          if (ia.length > 0) {
            setthemegalleryImage([]);
            setselectedthemeimages([]);
            let t = [];

            for (let i = 0; i < ia.length; i++) {
              // console.log("Image file : " + JSON.stringify(ia[i]));
              setImageArray((imageArray) => [...imageArray, ia[i]]);
            }
          }

          await axios
            .get(
              `mylapay/customer/shop/view?shop_url=demoshop&theme=${templateurl}&layout=${templateid}`
            )
            .then((res) => {
              if (res.data.status === 1) {
                if (res.data.data.length === 0) return;
                // dispatch(setShopData(res.data.data));
                // console.log("Shop data banner : " + res.data.data.shop_banner);
                setselectedthemeimages(res.data.data.shop_banner);
                setgalleryvalue("theme");
              }
            })
            .catch((err) => console.log(err));
        } else {
          setgalleryImage([]);
          setDialogOpengallery(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You can upload only 5 images.",
          });
        }
      }
    });
  };

  const handleselectedgallery = async () => {
    let countarr = imageArray.length + galleryimages.length;

    if (countarr <= 5) {
      let ia = await Promise.all(
        galleryimages.map(async (item) => {
          let imageFile = await createFileFromUrl(
            `${REACT_APP_SHOPAPI_URL}/uploads/${selectedthemelist[0].banners[item]}`,
            item
          );
          return imageFile;
        })
      );
      if (ia.length > 0) {
        let t = [];

        for (let i = 0; i < ia.length; i++) {
          // console.log("Image file : " + JSON.stringify(ia[i]));
          setImageArray((imageArray) => [...imageArray, ia[i]]);
        }

        setgalleryImage([]);
        setDialogOpengallery(false);
      }
    } else {
      setgalleryImage([]);
      setDialogOpengallery(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You have reached the limit",
      });
    }
  };

  const handleselectedcategorygallery = async () => {
    console.log(
      "Selected Gallery images : " + JSON.stringify(categorygalleryimages)
    );

    // if(categorygalleryimages.length>0)
    // {
    //   console.log(
    //     "length : " + categorygalleryimages.length
    //   );
    // }

    setcategoryoptionSelected(null);

    // if(categorygalleryimages!="")
    // {
    if (categorygalleryimages >= 0) {
      console.log("inserted working : " + categorygalleryimages);

      if (mylapaygallerycategorybanner[categorygalleryimages] != undefined) {
        let ia = await createFileFromUrl(
          `${REACT_APP_SHOPAPI_URL}/uploads/${mylapaygallerycategorybanner[categorygalleryimages]}`,
          0
        );

        console.log("Image file : " + JSON.stringify(ia));

        if (ia != "") {
          console.log("Image file : " + JSON.stringify(ia));

          setcategoryImageArray([]);
          setcategorygalleryImage("");
          // console.log("Image file : " + JSON.stringify(ia.length));
          let t = [];

          setcategoryImageArray(ia);

          setDialogOpencategorygallery(false);
        }
      }
    } else {
      console.log("Else inserted");
    }
    // }

    // let ia = await Promise.all(

    // categorygalleryimages.map(async (item, index) => {

    //     console.log("working");
    //     let imageFile = await createFileFromUrl(
    //       `${REACT_APP_SHOPAPI_URL}/uploads/${mylapaygallerycategorybanner[item]}`,
    //       item
    //     );
    //     return imageFile;
    // })
    // );
  };

  const handleDialoggallery = (value) => {
    setDialogOpengallery(value);
  };

  const handleDialogcategorygallery = (value) => {
    setDialogOpencategorygallery(value);
  };

  const handleDialogtheme = (value) => {
    setDialogOpentheme(value);
  };

  const handleDialogClose = (value) => {
    handleDialog(false);
  };

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  const validationSchema = yup.object({
    shop_name: yup
      .string("Shop name is reqired")
      .required("Shop name is reqired"),
    shop_logo: yup
      .string("Required field")
      .nullable(true)
      .required("Required field"),
    tagline: yup.string("Tagline is required").required("Tagline is required"),
    shop_url: yup
      .string("Shop url is required")
      .required("Shop url is required")
      .test(
        "is-taken",
        "Already taken!",
        async (value, testContext) =>
          await axios
            .get("mylapay/transaction/shop/check/availability", {
              params: {
                url_name: value,
                shopID: shopID && shopID,
              },
            })
            .then((res) => res.data.data === 1)
      ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: shopDetails || {
      shop_name: "",
      shop_logo: null,
      bannerImage: null,
      categorybannerImage: null,
      slider_images: [],
      tagline: "",
      aboutUs: "",
      faqs: [],
      contactEmail: "",
      contactNumber: "",
      location: "",
      caturl: "",
      shop_url: "",
      ownDomain: "",
      domain_name_search: "",
      colorCode: "",
      refund: "",
      return: "",
      copyright: "",
      copyyear: "",
      facebook: "",
      instagram: "",
      pinterest: "",
      terms: "",
      privacypolicy: "",
      returndays: "",
      cuslove: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setoverlay_on(true);
      setprogress_on(true);

      // let MCC_Code = localStorage.getItem("MCC_Code");
      // if (
      //   MCC_Code == 5137 ||
      //   MCC_Code == 5611 ||
      //   MCC_Code == 5651 ||
      //   MCC_Code == 5691 ||
      //   MCC_Code == 7296
      // ) {
      //   setcaturl("apparel");
      // }
      // else
      // {
      //   setcaturl("grocery");
      // }

      values.iTheme = JSON.stringify(
        mylapaygallery[templateid - 1]["iTemplate"]
      );
      values.iSub_Template = JSON.stringify(
        selectedthemelist[themeoptionSelected]["iSub_Template"]
      );

      values.iTemplate = templateid;

      values.facebook = "https://www.facebook.com/" + formik.values.facebook;
      values.instagram = "https://www.instagram.com/" + formik.values.instagram;
      values.pinterest = "https://www.twitter.com/" + formik.values.pinterest;

      // console.log("Save and continue values : " + JSON.stringify(shopDetails.faqs));

      const formData = new FormData();

      Object.keys(values).forEach((key) => formData.append(key, values[key]));

      // if(optionSelected!=null)
      // {
      //   formData.append("iTheme", JSON.stringify(mylapaygallery[optionSelected]['iTemplate']));
      // }

      // if(themeoptionSelected!=null)
      // {
      //   formData.append("idSub_Template", JSON.stringify(selectedthemelist[themeoptionSelected]['iSub_Template']));
      // }

      // const list = [...formValues];

      // console.log("FAQ values : " + JSON.stringify(formValues.length));

      // if (formValues.length > 0) {

      //   for (var i = formValues.length - 1; i >= 0; i--) {
      //       if (formValues[i].question == "" || formValues[i].answer == "") {
      //           formValues.splice(i, 1);
      //       }
      //   }

      // }

      let faq_empty = 0;
      let faq_length = 0;

      if (formValues.length > 0) {
        for (var i = formValues.length - 1; i >= 0; i--) {
          if (formValues[i].question == "" || formValues[i].answer == "") {
            faq_empty = 1;
            setLoading(false);
            setoverlay_on(false);
            setprogress_on(false);
          } else {
            if (formValues[i].question.length < 10) {
              faq_length = 1;
              setLoading(false);
              setoverlay_on(false);
              setprogress_on(false);
            }

            if (formValues[i].answer.length < 10) {
              faq_length = 1;
              setLoading(false);
              setoverlay_on(false);
              setprogress_on(false);
            }
          }
        }

        if (faq_empty == 1) {
          Swal.fire({
            title: "FAQ Content",
            text: "Please don't leave fields empty",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#20295C",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then(async (result) => {
            if (result.isConfirmed) {
              setActiveStep(8);
            } else {
              setActiveStep(8);
              faq_empty = 0;
            }
          });
        }

        if (faq_length == 1) {
          Swal.fire({
            title: "FAQ Content",
            text: "Question/Answer Fields needs filling (minmun length 10)",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#20295C",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then(async (result) => {
            if (result.isConfirmed) {
              setActiveStep(8);
            } else {
              setActiveStep(8);
              faq_length = 0;
            }
          });
        }
      }

      if (faq_empty == 0 && faq_length == 0) {
        console.log("FAQ values : " + JSON.stringify(formValues));

        // setFormValues(list);

        formData.append("faq", JSON.stringify(formValues));

        if (businessHoursValues) {
          formData.append(
            "business_hours",
            JSON.stringify(businessHoursValues)
          );
          // console.log(businessHoursValues);
        }

        formData.append("categoryCode", localStorage.getItem("MCC_Code"));

        if (shopID != undefined) {
          formData.append("iShop", shopID);
        }

        // console.log("Image Length : " + image_length);
        // console.log("banner Image Length : " + imageArray.length);

        if (imageArray.length > 0) {
          for (var i = 0; i < imageArray.length; i++) {
            formData.append("shop_banner_" + i, imageArray[i]);
          }
        }

        // if (categoryimageArray.length > 0) {
        //   for (var i = 0; i < categoryimageArray.length; i++) {
        //     formData.append("categorybannerImage", categoryimageArray[i]);
        //   }
        // }

        if (categoryimageArray != "") {
          formData.append("categorybannerImage", categoryimageArray);
        }

        // console.log("Image Length : " + image_length)
        // console.log("banner Image Length : " + banner_image.length)

        // if(banner_image.length>0)
        // {

        //   if(banner_image[0].length>1)
        //   {

        //     console.log(
        //       "Banner image length : " + JSON.stringify(banner_image[0].length)
        //     );

        //     for (var i = 0; i < banner_image[0].length; i++) {
        //       formData.append("shop_banner_" + i, banner_image[0][i]);
        //     }
        //   }
        //   else
        //   {

        //     console.log(
        //       "Banner image length : " + JSON.stringify(banner_image.length)
        //     );
        //     for (var i = 0; i < banner_image.length; i++) {
        //       formData.append("shop_banner_" + i, banner_image[i][0]);
        //     }
        //   }

        // }

        // for (var pair of formData.entries()) {
        //   console.log(pair[0] + ", " + pair[1]);
        // }

        axios
          .post("/mylapay/shop/shop_details", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (res.data.status === 1) {
              setProgress((prevProgress) => 95);
              setoverlay_on(false);
              setprogress_on(false);

              // console.log("-------res.data.iShop----", res.data.iShop);

              dispatch(setiShop(res.data.iShop));

              if (shopDetails) {
                if (values.pinterest != null && values.pinterest != "") {
                  formik.setFieldValue(
                    "pinterest",
                    values.pinterest.split("https://www.twitter.com/").pop()
                  );
                }

                if (values.facebook != null && values.facebook != "") {
                  formik.setFieldValue(
                    "facebook",
                    values.facebook.split("https://www.facebook.com/").pop()
                  );
                }

                if (values.instagram != null && values.instagram != "") {
                  formik.setFieldValue(
                    "instagram",
                    values.instagram.split("https://www.instagram.com/").pop()
                  );
                }
                dispatch(setShopDetails(shopDetails));
              }

              // stepChange(1);
              toast.success(res.data.data, { position: "top-center" });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });

        setLoading(false);
      }

      // console.log("Form data checj shop : " + JSON.stringify(formData));

      // console.log("FAQ : " + JSON.stringify(formValues));

      // dispatch(setShopDetails(values));
      // stepChange(1);
    },
  });

  const handleChangeabout = (event) => {
    // const {name,value} = event.target
    // formik.setFieldValue(name,value) // this call formik to set your value

    if (checked == true) {
      if (event.target.value != "") {
        if (userDetails.City != undefined) {
          let about_us =
            event.target.value +
            " from " +
            userDetails.City +
            " delivers the freshest and top quality food and daily essentials ranging from hundreds of branded items that will be handpicked and delivered to your home, all at the click of a button! We bring many products closer to our customers. All your daily needs are covered here. Remove all the stress associated with shopping for daily essentials without travelling long distances or standing in queues. Hassle-free Home Delivery options.";
          formik.setFieldValue("aboutUs", about_us);
          formik.setFieldValue("shop_name", event.target.value);
        } else {
          let about_us =
            event.target.value +
            " from " +
            "Location Name delivers the freshest and top quality food and daily essentials ranging from hundreds of branded items that will be handpicked and delivered to your home, all at the click of a button! We bring many products closer to our customers. All your daily needs are covered here. Remove all the stress associated with shopping for daily essentials without travelling long distances or standing in queues. Hassle-free Home Delivery options.";
          formik.setFieldValue("aboutUs", about_us);
          formik.setFieldValue("shop_name", event.target.value);
        }
      } else {
        let about_us =
          "Store name from Location Name delivers the freshest and top quality food and daily essentials ranging from hundreds of branded items that will be handpicked and delivered to your home, all at the click of a button! We bring many products closer to our customers. All your daily needs are covered here. Remove all the stress associated with shopping for daily essentials without travelling long distances or standing in queues. Hassle-free Home Delivery options.";
        formik.setFieldValue("aboutUs", about_us);
        formik.setFieldValue("shop_name", event.target.value);
      }
    } else {
      formik.setFieldValue("aboutUs", "");
      formik.setFieldValue("shop_name", event.target.value);
    }

    // console.log("Shop name intial : " + about_us)
  };

  const handleChangeaboutfield = (event) => {
    formik.setFieldValue("aboutUs", event.target.value);

    // if (event.target.value != "") {

    //   formik.setFieldValue("aboutUs", event.target.value);
    // }
  };

  const handleChangeterms = (event) => {
    formik.setFieldValue("terms", event.target.value);
  };

  const handleChangeprivacypolicy = (event) => {
    formik.setFieldValue("privacypolicy", event.target.value);
  };

  const handleDialogScheduleClose = () => {
    setDialogOpenSchedule(false);
  };

  const getBusinessHours = (shopID) => {
    setoverlay_on(true);
    setprogress_on(true);
    axios
      .get(`/mylapay/shop/business-hours?iShop=${shopID}`)
      .then((res) => {
        // console.log(res);
        console.log("Business");
        if (res.data.status === 1) {
          let business_hours = res.data.data;
          if (business_hours.length > 0) {
            console.log("Business Hours Already there");
            for (let i = 0; i < business_hours.length; i++) {
              console.log(business_hours[i].OpenTime);
              var cdtOpenTime = moment(business_hours[i].OpenTime, "HH:mm A");
              let dayOpenTime = business_hours[i].DayOfWeek;
              handleFromTimeChange(cdtOpenTime, dayOpenTime);

              var cdtCloseTime = moment(business_hours[i].CloseTime, "HH:mm A");
              let dayCloseTime = business_hours[i].DayOfWeek;
              handleToTimeChange(cdtCloseTime, dayCloseTime);

              let isOpen = business_hours[i].Closed;
              handleChangeShopOpenClosePrefill(isOpen, dayCloseTime);
            }
            setDialogOpenSchedule(true);
          } else {
            let fromTimeFixed = moment()
              .set({ hour: 10, minute: 0 })
              .format("hh:mm A");
            let toTimeFixed = moment()
              .set({ hour: 19, minute: 0 })
              .format("hh:mm A");
            console.log("Time fixed");
            console.log("Default Business Hours");
            console.log(fromTimeFixed);
            console.log(toTimeFixed);
            for (let i = 0; i <= 6; i++) {
              let cdtOpenTime = moment(fromTimeFixed, "HH:mm A");
              let dayOpenTime = i;
              handleFromTimeChange(cdtOpenTime, dayOpenTime);

              let cdtCloseTime = moment(toTimeFixed, "HH:mm A");
              let dayCloseTime = i;
              handleToTimeChange(cdtCloseTime, dayCloseTime);
            }
            setSundayOpen(true);
            setMondayOpen(true);
            setTuesdayOpen(true);
            setWednesdayOpen(true);
            setThursdayOpen(true);
            setFridayOpen(true);
            setSaturdayOpen(true);
            setDialogOpenSchedule(true);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
        setprogress_on(false);
        setoverlay_on(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleScheduleBusinessHours = async () => {
    // console.log("schedule business hours");
    // console.log(shopID);
    if (shopID) {
      getBusinessHours(shopID);
    } else {
      let fromTimeFixed = moment()
        .set({ hour: 10, minute: 0 })
        .format("hh:mm A");
      let toTimeFixed = moment().set({ hour: 19, minute: 0 }).format("hh:mm A");
      console.log("Time fixed");
      console.log("Default Business Hours");
      console.log(fromTimeFixed);
      console.log(toTimeFixed);
      for (let i = 0; i <= 6; i++) {
        let cdtOpenTime = moment(fromTimeFixed, "HH:mm A");
        let dayOpenTime = i;
        handleFromTimeChange(cdtOpenTime, dayOpenTime);

        let cdtCloseTime = moment(toTimeFixed, "HH:mm A");
        let dayCloseTime = i;
        handleToTimeChange(cdtCloseTime, dayCloseTime);
      }
      setDialogOpenSchedule(true);
    }
  };

  const handleChangeShopOpenClosePrefill = (isOpen, day) => {
    // console.log(isOpen);
    // console.log(day);
    if (day === 0) {
      if (isOpen === 1) {
        setSundayOpen(true);
      } else {
        setSundayOpen(false);
      }
    } else if (day === 1) {
      if (isOpen === 1) {
        setMondayOpen(true);
      } else {
        setMondayOpen(false);
      }
    } else if (day === 2) {
      if (isOpen === 1) {
        setTuesdayOpen(true);
      } else {
        setTuesdayOpen(false);
      }
    } else if (day === 3) {
      if (isOpen === 1) {
        setWednesdayOpen(true);
      } else {
        setWednesdayOpen(false);
      }
    } else if (day === 4) {
      if (isOpen === 1) {
        setThursdayOpen(true);
      } else {
        setThursdayOpen(false);
      }
    } else if (day === 5) {
      if (isOpen === 1) {
        setFridayOpen(true);
      } else {
        setFridayOpen(false);
      }
    } else if (day === 6) {
      if (isOpen === 1) {
        setSaturdayOpen(true);
      } else {
        setSaturdayOpen(false);
      }
    }
    // console.log("check click");
  };

  const handleFromTimeChange = (date, day) => {
    // console.log(date);
    // let timeFormated = moment(date, "hh:mm A");
    let timeFormated = moment(date).format("hh:mm A");
    // let timeFormated = date;
    if (day === 0) {
      setSelectedFromTimeSunday(date);
      setFromTimeSunday(timeFormated);
    } else if (day === 1) {
      setSelectedFromTimeMonday(date);
      setFromTimeMonday(timeFormated);
    } else if (day === 2) {
      setSelectedFromTimeTuesday(date);
      setFromTimeTuesday(timeFormated);
    } else if (day === 3) {
      setSelectedFromTimeWednesday(date);
      setFromTimeWednesday(timeFormated);
    } else if (day === 4) {
      setSelectedFromTimeThursday(date);
      setFromTimeThursday(timeFormated);
    } else if (day === 5) {
      setSelectedFromTimeFriday(date);
      setFromTimeFriday(timeFormated);
    } else if (day === 6) {
      setSelectedFromTimeSaturday(date);
      setFromTimeSaturday(timeFormated);
    }
    //setFromTime(timeFormated);
  };
  const handleToTimeChange = (date, day) => {
    // let timeFormated = date;
    let timeFormated = moment(date).format("hh:mm A");
    if (day === 0) {
      setSelectedToTimeSunday(date);
      setToTimeSunday(timeFormated);
    } else if (day === 1) {
      setSelectedToTimeMonday(date);
      setToTimeMonday(timeFormated);
    } else if (day === 2) {
      setSelectedToTimeTuesday(date);
      setToTimeTuesday(timeFormated);
    } else if (day === 3) {
      setSelectedToTimeWednesday(date);
      setToTimeWednesday(timeFormated);
    } else if (day === 4) {
      setSelectedToTimeThursday(date);
      setToTimeThursday(timeFormated);
    } else if (day === 5) {
      setSelectedToTimeFriday(date);
      setToTimeFriday(timeFormated);
    } else if (day === 6) {
      setSelectedToTimeSaturday(date);
      setToTimeSaturday(timeFormated);
    }
    // setSelectedToTime(date);
    // setToTime(timeFormated);
  };
  const handleChangeShopOpenClose = (event, day) => {
    // console.log("event click :" + event.target.checked);
    // console.log(day);

    if (day === 0) {
      if (event.target.checked === true) {
        setSundayOpen(true);
      } else {
        setSundayOpen(false);
      }
    } else if (day === 1) {
      if (event.target.checked === true) {
        setMondayOpen(true);
      } else {
        setMondayOpen(false);
      }
    } else if (day === 2) {
      if (event.target.checked === true) {
        setTuesdayOpen(true);
      } else {
        setTuesdayOpen(false);
      }
    } else if (day === 3) {
      if (event.target.checked === true) {
        setWednesdayOpen(true);
      } else {
        setWednesdayOpen(false);
      }
    } else if (day === 4) {
      if (event.target.checked === true) {
        setThursdayOpen(true);
      } else {
        setThursdayOpen(false);
      }
    } else if (day === 5) {
      if (event.target.checked === true) {
        setFridayOpen(true);
      } else {
        setFridayOpen(false);
      }
    } else if (day === 6) {
      if (event.target.checked === true) {
        setSaturdayOpen(true);
      } else {
        setSaturdayOpen(false);
      }
    }
    // console.log("check click");
  };

  const handleDialogScheduleConfirm = () => {
    let tempArray = [
      {
        day: 0,
        open: fromTimeSunday,
        close: toTimeSunday,
        isOpen: sundayOpen,
      },
      {
        day: 1,
        open: fromTimeMonday,
        close: toTimeMonday,
        isOpen: mondayOpen,
      },
      {
        day: 2,
        open: fromTimeTuesday,
        close: toTimeTuesday,
        isOpen: tuesdayOpen,
      },
      {
        day: 3,
        open: fromTimeWednesday,
        close: toTimeWednesday,
        isOpen: wednesdayOpen,
      },
      {
        day: 4,
        open: fromTimeThursday,
        close: toTimeThursday,
        isOpen: thursdayOpen,
      },
      {
        day: 5,
        open: fromTimeFriday,
        close: toTimeFriday,
        isOpen: fridayOpen,
      },
      {
        day: 6,
        open: fromTimeSaturday,
        close: toTimeSaturday,
        isOpen: saturdayOpen,
      },
    ];
    if (shopID) saveBusinessHoursValues(tempArray);
    setBusinessHoursValues(tempArray);
    setDialogOpenSchedule(false);
  };

  const saveBusinessHoursValues = async (payload) => {
    const formData = new FormData();
    formData.append("business_hours", JSON.stringify(payload));
    formData.append("iShop", shopID);
    await axios
      .post("mylapay/shop/business-hours", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangecuslove = (event) => {
    formik.setFieldValue("cuslove", event.target.value);
  };

  const getData = async () => {
    await axios.get(`mylapay/shop/shop_details`).then(async (res) => {
      if (res.data.status === 1) {
      }
    });
  };

  const getTemplate = async () => {
    await axios.get(`mylapay/shop/templates`).then(async (res) => {
      if (res.data.status === 1) {
        setmylapaygallery(res.data.message);
      }
    });
  };

  const editProduct = async () => {
    if (shopDetails.bannerImage && shopDetails.bannerImage.length > 0) {
      // setbannerimage(shopDetails.bannerImage)

      let ia = await Promise.all(
        shopDetails.bannerImage.map(async (item) => {
          let imageFile = await createFileFromUrl(
            `${REACT_APP_SHOPAPI_URL}/uploads${item.Banner_Image}`,
            item.iBanner
          );
          return imageFile;
        })
      );
      setImageArray(ia);

      // shopDetails.bannerImage = ia;
      // formik.resetForm({ values: shopDetails });
    }

    if (shopDetails.categorybannerImage != null) {
      // setbannerimage(shopDetails.bannerImage)

      // let ia = await Promise.all(
      //   shopDetails.categorybannerImage.map(async (item) => {
      //     let imageFile = await createFileFromUrl(
      //       `${REACT_APP_SHOPAPI_URL}/uploads${item}`,
      //       item
      //     );
      //     return imageFile;
      //   })
      // );

      let ia = await createFileFromUrl(
        `${REACT_APP_SHOPAPI_URL}/uploads${shopDetails.categorybannerImage}`,
        1
      );

      setcategoryImageArray(ia);
    }
  };
  const checkvalidurlpinterest = (event) => {
    if (event.target.value != "") {
      formik.setFieldValue("pinterest", event.target.value);
    } else {
      formik.setFieldValue("pinterest", event.target.value);
    }

    // if(event.target.value.includes('https://in.pinterest.com/'))
    // {
    //   console.log("Pinterst value : " + event.target.value)
    // }
    // else
    // {
    //   if(event.target.value == "https://in.pinterest.com")
    //   {
    //     formik.setFieldValue("pinterest", "https://in.pinterest.com/");
    //   }
    //   else
    //   {
    //     formik.setFieldValue("pinterest", "https://in.pinterest.com/" + event.target.value);
    //   }
    // }
  };

  const checkvalidurlfacebook = (event) => {
    if (event.target.value != "") {
      formik.setFieldValue("facebook", event.target.value);
    } else {
      formik.setFieldValue("facebook", event.target.value);
    }
    // if(event.target.value.includes('https://www.facebook.com/'))
    // {
    //   console.log("Pinterst value : " + event.target.value)
    // }
    // else
    // {
    //   if(event.target.value == "https://www.facebook.com")
    //   {
    //     formik.setFieldValue("facebook", "https://www.facebook.com/");
    //   }
    //   else
    //   {
    //     formik.setFieldValue("facebook", "https://www.facebook.com/" + event.target.value);
    //   }

    // }
  };

  const checkvalidurlinstagram = (event) => {
    if (event.target.value != "") {
      formik.setFieldValue("instagram", event.target.value);
    } else {
      formik.setFieldValue("instagram", event.target.value);
    }

    // if(event.target.value.includes('https://www.instagram.com/'))
    // {
    //   console.log("Pinterst value : " + event.target.value)
    // }
    // else
    // {
    //   if(event.target.value == "https://www.instagram.com")
    //   {
    //     formik.setFieldValue("instagram", "https://www.instagram.com/");
    //   }
    //   else
    //   {
    //     formik.setFieldValue("instagram", "https://www.instagram.com/" + event.target.value);
    //   }

    // }
  };

  const checkshopurlvalid = (event) => {
    if (event.target.value != "") {
      formik.setFieldValue("shop_url", event.target.value);
    } else {
      formik.setFieldValue("shop_url", event.target.value);
    }

    // if(event.target.value.includes('https://www.instagram.com/'))
    // {
    //   console.log("Pinterst value : " + event.target.value)
    // }
    // else
    // {
    //   if(event.target.value == "https://www.instagram.com")
    //   {
    //     formik.setFieldValue("instagram", "https://www.instagram.com/");
    //   }
    //   else
    //   {
    //     formik.setFieldValue("instagram", "https://www.instagram.com/" + event.target.value);
    //   }

    // }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const getShopList = async () => {
      await axios
        .get("/mylapay/transaction/shop/list")
        .then((res) => {
          if (res.data.data[0].iTemplate != "") {
            settemplateid(res.data.data[0].iTemplate);
            getThemelist(res.data.data[0].iTemplate);
            // setshopUrl(res.data.data[0].url_name);
            if (res.data.data[0].url_name) {
              history.push(
                `/payment-pages/edit?editItem=${res.data.data[0].url_name}&shopId=${res.data.data[0].id}`
              );
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getShopList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themegalleryimages, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (shopDetails) {
      if (shopDetails.faqs.length > 0) {
        let faq_values = [];

        shopDetails.faqs.map((value) => {
          faq_values.push({
            question: value["FAQ_Question"],
            answer: value["FAQ_Answer"],
          });

          // setFormValues([...formValues, faq_values]);
        });

        // console.log("Faq " + JSON.stringify(faq_values));
        setFormValues(faq_values);
      }

      if (shopDetails.terms != null && shopDetails.terms != "") {
        setTermsChecked(true);
      }

      if (shopDetails.aboutUs != null && shopDetails.aboutUs != "") {
        setChecked(true);
      }

      if (shopDetails.pinterest != null && shopDetails.pinterest != "") {
        formik.setFieldValue(
          "pinterest",
          shopDetails.pinterest.split("https://www.twitter.com/").pop()
        );
      }

      if (shopDetails.facebook != null && shopDetails.facebook != "") {
        formik.setFieldValue(
          "facebook",
          shopDetails.facebook.split("https://www.facebook.com/").pop()
        );
      }

      if (shopDetails.instagram != null && shopDetails.instagram != "") {
        formik.setFieldValue(
          "instagram",
          shopDetails.instagram.split("https://www.instagram.com/").pop()
        );
      }

      // if (shopDetails.iTemplate != "") {
      //   if (shopDetails.iTemplate == 1) {
      //     console.log("Working refund");
      //     setRefund(`Customer has the option to cancel <br /> the order placed vide cancel button available next to order detail in customer login.
      //     Order can be cancelled within 30 minutes from the time of placing order.
      //     Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order.
      //     The Refund amount will be credited back to the account from where the payment was made.
      //     Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
      //     Order once shipped will not be eligible for Cancellation.
      //     In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`);
      //     formik.setFieldValue("refund", refund);
      //   } else if (shopDetails.iTemplate == 2) {
      //     setRefund(`Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login
      //     Order can be cancelled before shipment of the Order.
      //     Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order.
      //     The Refund amount will be credited back to the account from where the payment was made.
      //     Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
      //     Order once shipped will not be eligible for Cancellation.
      //     In case post accepting order if shop runs out of Stock, shop can initiate a cancellation and refund for the order will be provided within 7 working days with an intimation to the customer. Refund amount will be equal to the order value plus tax and delivery charges collected.`);
      //     formik.setFieldValue("refund", refund);
      //   } else if (shopDetails.iTemplate == 3) {
      //     setRefund(`Customer has the option to cancel the order placed vide cancel button available next to order detail in customer login
      //     Order can be cancelled within 5 minutes from the time of order placed.
      //     Orders cancelled successfully will be Refunded within 7 working days from the date of cancellation of order.
      //     The Refund amount will be credited back to the account from where the payment was made.
      //     Refund amount will be equal to the order value plus tax and delivery charges collected less bank charges.
      //     Order once shipped will not be eligible for Cancellation.
      //     Shop once accepting order will ensure that placed orders are shipped, if there are change or unavailability of orders, the shop will intimate to customer through call to check for alternative.`);

      //     formik.setFieldValue("refund", refund);
      //   }
      // }

      if (shopDetails.privacypolicy != null) {
        setprivacypolicychecked(true);
      }

      if (shopDetails.iTheme) {
        // console.log("cat url : " + shopDetails.caturl)
        if (optionSelected == null) {
          mylapaygallery.map((value, index) => {
            if (value.iTemplate == shopDetails.iTheme) {
              setoptionSelected(index);

              // console.log("iTemplate working : " + index);

              axios
                .get(`mylapay/shop/templates/` + shopDetails.iTheme)
                .then(async (res) => {
                  if (res.data.status === 1) {
                    // setmylapaygallery(res.data.message)
                    setselectedthemelist(res.data.message);
                    setmylapaygallerybanner(res.data.message[0].banners);
                    if (res.data.message[0].categoryImages) {
                      setmylapaygallerycategorybanner(
                        res.data.message[0].categoryImages
                      );
                    }
                    console.log("shopDetails.iSub_Template 1 : " + shopDetails);

                    if (shopDetails.iSub_Template != null) {
                      res.data.message.map((tem_value, tem_index) => {
                        if (
                          tem_value.iSub_Template == shopDetails.iSub_Template
                        ) {
                          setthemeoptionSelected(tem_index);
                          if (tem_index == 0) {
                            setcaturl("grocery");
                            formik.setFieldValue("caturl", "grocery");
                          } else if (tem_index == 1) {
                            setcaturl("apparel");
                            formik.setFieldValue("caturl", "apparel");
                          } else if (tem_index == 2) {
                            setcaturl("restaurant");
                            formik.setFieldValue("caturl", "restaurant");
                          }

                          settemplateurl(tem_value.Sub_Template_Url);
                          axios
                            .get(
                              `mylapay/customer/shop/view?shop_url=demoshop&theme=${tem_value.Sub_Template_Url}&layout=${templateid}`
                            )
                            .then((res) => {
                              if (res.data.status === 1) {
                                if (res.data.data.length === 0) return;
                                console.log(
                                  "Shop data banner : " +
                                    res.data.data.shop_banner
                                );
                                setselectedthemeimages(
                                  res.data.data.shop_banner
                                );
                                setgalleryvalue("theme");
                              }
                            })
                            .catch((err) => console.log(err));
                        }
                      });
                    }
                  }
                });
            }
          });
        }
      }

      if (shopDetails.ownDomain != "" && shopDetails.ownDomain != null) {
        setdomainValue(2);
      } else {
        setdomainValue(1);
      }

      // setoptionSelected(1);
      editProduct();
    }
    // getData();
    getTemplate();
    // handleChangeChkterms();

    // if (termschecked) {
    //   formik.setFieldValue("terms", termsval);
    // }

    if (cuslovechecked) {
      formik.setFieldValue("cuslove", cuslove);
    }

    if (userDetails) {
      // let user_data = JSON.parse(userDetails)
      // console.log("User details use effect : " + user_data.contact_email)

      if (shopDetails == null) {
        formik.setFieldValue("contactEmail", userDetails.contact_email);
        formik.setFieldValue("contactNumber", userDetails.contact_no);
        let locationval =
          userDetails.Door_Number +
          ",\n" +
          userDetails.Street_Name +
          ",\n" +
          userDetails.Landmark +
          ",\n" +
          userDetails.City +
          ",\n" +
          userDetails.StateName +
          ",\n" +
          userDetails.pincode +
          ",\n";

        formik.setFieldValue("location", locationval);
      } else {
        formik.setFieldValue("contactEmail", shopDetails.contactEmail);
        formik.setFieldValue("contactNumber", shopDetails.contactNumber);
      }
    }

    // if (localStorage.getItem("category") == "Groceries and supermarkets") {
    //   setcaturl("grocery");
    //   // shopDetails.push({caturl: caturl})
    // }

    // let MCC_Code = localStorage.getItem("MCC_Code");
    // if (
    //   MCC_Code == 5137 ||
    //   MCC_Code == 5611 ||
    //   MCC_Code == 5651 ||
    //   MCC_Code == 5691 ||
    //   MCC_Code == 7296
    // ) {
    //   setcaturl("apparel");

    // }
    // else {
    //   setcaturl("grocery");
    // }
  }, [caturl, shopDetails, banner_image, refund, isAuthenticated]);

  // const handleDialog = (value) => {
  //   setDialogOpen(value);
  // };

  /* const getCategory = async () => {
    await axios
      .get("/mylapay/transaction/get/shop_catogory")
      .then((response) => {
        if (response.data.success === 1) {
          setShopCategories(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }; */

  // useEffect(() => {
  //getCategory();
  // }, [userDetails]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.stepCtaWrap}>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            style={{ color: "#fff" }}
            onClick={handlePreviewClick}
          >
            Preview
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disableElevation
            style={{ color: "#fff", marginLeft: "1em" }}
          >
            Save
          </Button>
        </div>
        {/* <Box
          sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'contents', height: 400 }}
        > */}

        {/* <Grid container spacing={2} style={{backgroundColor:"white"}} className="shopdetails">
        <Grid item xs={4}>
          <Tabs
            orientation="vertical"
            variant="visibleScrollbar"
            value={value}
            onChange={handleChangetabpanel}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider', display: 'contents',width:"100px", }}
          >
            <Tab label="Theme Section" {...a11yProps(0)} />
            <Tab label="Header Section" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
            <Tab label="Item Four" {...a11yProps(3)} />
            <Tab label="Item Five" {...a11yProps(4)} />
            <Tab label="Item Six" {...a11yProps(5)} />
            <Tab label="Item Seven" {...a11yProps(6)} />
          </Tabs>
        </Grid>
          
        
              <TabPanel value={value} index={0}>
                
                <Grid item xs={12}>
              
                <div className="gallery">
                  <ul style={{textAlign:"center", padding:"10px", margin:"5px", marginBottom:"10px"}}>
                  {mylapaygallery.map((product, index) => (
                    <li>
                      <label>

                          <Typography
                            variant="h3"
                            style={{
                              color: "green",
                              fontSize: "1.2rem",
                              fontFamily: "Prompt,sans-serif",
                              fontWeight: "400",
                              textAlign:"center"
                            }}
                          >
                            {product.Template_Name}
                          </Typography>
                      </label>
                      <input
                        type="checkbox"
                        value={product.id}
                        
                        checked={(optionSelected === index ? true : false)}
                      />
                      <label >
                        <img src={`${REACT_APP_SHOPAPI_URL}/uploads/${product.Template_Image}`} onClick={() => onToggletheme(index, product.iTemplate)} width="145px" heigth="75px"/>
                      </label>
                    </li>

                  ))}

                  </ul>
                </div>

                <Box alignItems="center" textAlign="center">
                </Box>
                </Grid>

                <Grid item xs={1}>

                </Grid>
                {selectedthemelist.length>0?

                  <Grid item xs={10}>

                    <div className="gallery" style={{border:"1px solid"}}>

                    <Box alignItems="center" textAlign="center" style={{marginTop:"15px"}}>

                      {optionSelected!=null ?
                        <Box  > <b>Suitable Templates for selected Theme </b> </Box>
                      :
                        null
                      }

                    </Box>

                      <ul style={{textAlign:"center", padding:"10px", margin:"5px", marginBottom:"10px"}}>
                      {selectedthemelist.map((product, index) => (
                        <li>
                          <label className="template_title">

                              <Typography
                                variant="h3"
                                style={{
                                  color: "green",
                                  fontSize: "1.2rem",
                                  fontFamily: "Prompt,sans-serif",
                                  fontWeight: "400",
                                  textAlign:"center"
                                }}
                              >
                                {product.Sub_Template_Name}
                              </Typography>
                          </label>
                          <input
                            type="checkbox"
                            value={product.id}
                            
                            checked={(themeoptionSelected === index ? true : false)}
                          />
                          <label >
                            <img className="template_thumbnail" src={`${REACT_APP_SHOPAPI_URL}/uploads/${product.Thumbnail_Image}`} onClick={() => onTogglethemetemeplate(index, product.iSub_Template)} width="145px" heigth="175px"/>
                          </label>
                          
                          <Button
                            variant="contained"
                            color="primary"
                            style={{  width: "140px" }}
                            onClick={() => handlethemePreviewClick(product.Sub_Template_Url)}
                            endIcon={<Visibility />}
                            disabled={loading}
                          >
                            View Theme
                          </Button>
                        </li>

                      ))}

                      </ul>
                    </div>
                  </Grid>

                  :
                  null
                }
            
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container>

                <Grid item xs={3}>
                  <Box mb={2} mt={2}>
                    <ImageUpload
                      setShopLogo={setShopLogo}
                      value={formik.values.shop_logo}
                      error={
                        formik.touched.shop_logo &&
                        Boolean(formik.errors.shop_logo)
                      }
                      helperText={
                        formik.touched.shop_logo && formik.errors.shop_logo
                      }
                    />
                  </Box>

                  <Box mb={2}></Box>
                </Grid>

                <Grid item xs={7}>
                  <Box mb={2} mt={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Name"
                      id="shop_name"
                      name="shop_name"
                      value={formik.values.shop_name}
                      onChange={handleChangeabout}
                      error={
                        formik.touched.shop_name &&
                        Boolean(formik.errors.shop_name)
                      }
                      helperText={
                        formik.touched.shop_name && formik.errors.shop_name
                      }
                    />
                  </Box>
                  
                </Grid>
                <Grid item xs={2}>
                </Grid>

                <Grid item xs={2}>
                  <div
                    style={{
                      color: formik.values.colorCode,
                      fontSize: "2.0em",
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    <span>&#9632;</span>
                  </div>
                </Grid>

                <Grid item xs={4}>
                  <Box mb={2} mr={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Color Code"
                      id="colorCode"
                      name="colorCode"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      value={formik.values.colorCode}
                      error={
                        formik.touched.colorCode &&
                        Boolean(formik.errors.colorCode)
                      }
                      helperText={
                        formik.touched.colorCode && formik.errors.colorCode
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={2}>
                  <Box mb={2} mt={2}>
                    <Button
                      onClick={handleClick}
                      variant="contained"
                      color="primary"
                    >
                      Pick Color
                    </Button>
                  </Box>

                  {statepicker.displayColorPicker ? (
                    <div style={popover}>
                      <div style={cover} onClick={handleClose} />
                      <ChromePicker
                        color={statecolor.background}
                        onChangeComplete={handleChangeComplete}
                      />
                    </div>
                  ) : null}
                </Grid>
            </Grid>
                
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
          <TabPanel value={value} index={3}>
            Item Four
          </TabPanel>
          <TabPanel value={value} index={4}>
            Item Five
          </TabPanel>
          <TabPanel value={value} index={5}>
            Item Six
          </TabPanel>
          <TabPanel value={value} index={6}>
            Item Seven
          </TabPanel>
          </Grid> */}

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

        <Dialog
          style={{ width: "103%", margin: "auto" }}
          fullWidth
          maxWidth="100%"
          open={dialogOpen}
          onClose={handleDialogClose}
        >
          <DialogTitle id="id" style={{}}>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>Shop Preview</Box>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "99px", width: "160px" }}
                  onClick={handlefullscreen}
                >
                  Full Screen
                </Button>
              </Box>

              <Box>
                <IconButton
                  onClick={() => {
                    handleDialog(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            <div
              style={{ width: "75%", height: "450px" }}
              dangerouslySetInnerHTML={{ __html: previewurl }}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          style={{ width: "100%", margin: "auto" }}
          fullWidth
          maxWidth="md"
          open={dialogOpengallery}
          onClose={handleDialogClosegallery}
        >
          <DialogTitle id="id" style={{}}>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>Mylapay Gallery</Box>

              <Box>
                <IconButton
                  onClick={() => {
                    handleDialoggallery(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            {/* <div
            style={{ width: "75%", height: "450px" }}
            dangerouslySetInnerHTML={{ __html: previewurl }}
          /> */}

            <div className="gallery">
              <ul>
                {mylapaygallerybanner.map((product, index) => (
                  <li>
                    <input
                      type="checkbox"
                      id={"myCheckbox" + index}
                      className={"myCheckbox" + index}
                      value={index}
                      onChange={onToggle}
                    />
                    <label for={"myCheckbox" + index}>
                      <img
                        src={`${REACT_APP_SHOPAPI_URL}/uploads/${product}`}
                        width="300px"
                        heigth="200px"
                      />
                    </label>
                  </li>
                ))}

                {/* <li>
                <input
                  type="checkbox"
                  id="myCheckbox2"
                  value="1"
                  onChange={onToggle}
                />
                <label for="myCheckbox2">
                  <img src="http://tech21info.com/admin/wp-content/uploads/2013/03/chrome-logo-200x200.png" />
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="myCheckbox3"
                  value="2"
                  onChange={onToggle}
                />
                <label for="myCheckbox3">
                  <img src="http://www.thebusinessofsports.com/wp-content/uploads/2010/10/facebook-icon-200x200.png" />
                </label>
              </li> */}
              </ul>
            </div>

            <Box display="flex" alignItems="right">
              <Box flexGrow={1}></Box>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "85px", width: "160px" }}
                  onClick={handleselectedgallery}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog
          style={{ width: "100%", margin: "auto" }}
          fullWidth
          maxWidth="md"
          open={dialogOpencategorygallery}
          onClose={handleDialogClosecategorygallery}
        >
          <DialogTitle id="id" style={{}}>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>Mylapay Category Gallery</Box>

              <Box>
                <IconButton
                  onClick={() => {
                    handleDialogcategorygallery(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            {/* <div
            style={{ width: "75%", height: "450px" }}
            dangerouslySetInnerHTML={{ __html: previewurl }}
          /> */}

            <div className="gallery">
              <ul>
                {mylapaygallerycategorybanner.map((product, index) => (
                  <li>
                    <input
                      type="checkbox"
                      // id={"myCheckbox" + index}
                      value={index}
                      // onChange={onTogglecategory}
                      checked={categoryoptionSelected === index ? true : false}
                    />
                    <label
                    // for={"myCheckbox" + index}
                    >
                      <img
                        src={`${REACT_APP_SHOPAPI_URL}/uploads/${product}`}
                        width="300px"
                        heigth="200px"
                        // onClick={onTogglecategory}
                        onClick={() => onTogglecategory(index)}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <Box display="flex" alignItems="right">
              <Box flexGrow={1}></Box>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "85px", width: "160px" }}
                  onClick={handleselectedcategorygallery}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog
          style={{ width: "100%" }}
          open={dialogOpentheme}
          onClose={handleDialogClosetheme}
        >
          <DialogTitle
            id="id"
            style={{ padding: "5px 10px", textAlign: "center" }}
          >
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>Themes</Box>

              <Box>
                <IconButton
                  onClick={() => {
                    handleDialogtheme(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent style={{ padding: "15px", paddingTop: "1px" }}>
            {/* <div
            style={{ width: "75%", height: "450px" }}
            dangerouslySetInnerHTML={{ __html: previewurl }}
          /> */}

            <div className="gallery">
              <ul
                style={{
                  textAlign: "center",
                  padding: "10px",
                  margin: "5px",
                  marginBottom: "10px",
                }}
              >
                {mylapaygallery.map((product, index) => (
                  <li>
                    <label>
                      <Typography
                        variant="h3"
                        style={{
                          // color: "#fff",
                          fontSize: "1.2rem",
                          fontFamily: "Prompt,sans-serif",
                          fontWeight: "400",
                          textAlign: "center",
                        }}
                      >
                        {product.themename}
                      </Typography>
                    </label>
                    <input
                      type="checkbox"
                      // id={"myCheckbox" + index}
                      value={product.id}
                      checked={optionSelected === index ? true : false}
                    />
                    <label>
                      <img
                        src={product.image_path}
                        // onClick={onToggletheme(index)}
                        onClick={() => onToggletheme(index)}
                        width="200px"
                        heigth="100px"
                      />
                    </label>

                    <Button
                      variant="contained"
                      color="primary"
                      style={{ width: "100px" }}
                      // onClick={handlethemePreviewClick}
                      onClick={() => handlethemePreviewClick(index)}
                      endIcon={<Visibility />}
                      disabled={loading}
                    >
                      Preview
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            {/* <Box display="flex">
            <Box flexGrow={1}></Box>

            <Box>
              <Button
                variant="contained"
                color="primary"
                style={{  width: "130px" }}
                onClick={() => {
                  handleDialogthemesubmit();
                }}
              >
                Apply Theme
              </Button>
            </Box>
          </Box> */}

            <Box display="flex" alignItems="right">
              {optionSelected != null ? (
                <Box flexGrow={1}>
                  <b>Note : </b> Selected theme is suitable for{" "}
                  {mylapaygallery[optionSelected].themename} Template
                </Box>
              ) : (
                <Box flexGrow={1}></Box>
              )}

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: "130px" }}
                  onClick={() => {
                    handleDialogthemesubmit();
                  }}
                >
                  Apply Theme
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* NEW ACCORDIAN START */}
        <>
          {/* <Box my={3} className={editStyles.stepWrap}>
          <div className={`${editStyles.stepCard} ${editStyles.active}`}>
            Configure Online Store
          </div>
          <div className={editStyles.stepCard}>Add your products</div>
          <div className={editStyles.stepCard}>Configure Shipment</div>
          <div className={editStyles.stepCard}>Configure Pricing</div>

          <div className={editStyles.stepCtaWrap}>
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              style={{ color: "#fff" }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              style={{ color: "#fff", marginLeft: "1em" }}
            >
              Save
            </Button>
          </div>
        </Box> */}

          <div className={styles.accWrap}>
            <div className={styles.accLinksWrap}>
              {linksTitle.map((item, i) => (
                // templateid != 1 &&
                <>
                  {caturl == "grocery" ? (
                    <>
                      {item != "Category Image" ? (
                        <div
                          key={i}
                          onClick={() => setActiveStep(i + 1)}
                          className={`${styles.accLink} ${
                            i === activeStep - 1 ? styles.active : ""
                          }`}
                        >
                          {item}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div
                      key={i}
                      onClick={() => setActiveStep(i + 1)}
                      className={`${styles.accLink} ${
                        i === activeStep - 1 ? styles.active : ""
                      }`}
                    >
                      {item}
                    </div>
                  )}
                </>
              ))}
            </div>
            <div className={styles.accContentWrap}>
              <div
                className={`${styles.accContent} ${
                  activeStep === 1 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Add website URL to your shop. You can choose to add your own
                  URL domain or use Mylapay’s virtual URL domain for free!
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <FormControl component="fieldset">
                      {/* <FormLabel component="legend">Domain</FormLabel> */}
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel
                          value="2"
                          checked={domainValue === 2}
                          onChange={handleChangedomain}
                          control={<Radio />}
                          label="Your Own Domain"
                        />
                        <FormControlLabel
                          value="1"
                          checked={domainValue === 1}
                          onChange={handleChangedomain}
                          control={<Radio />}
                          label="Mylapay Virtual Domain
                        "
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {domainValue == 1 ? (
                    <>
                      <Grid item xs={3} style={{ textAlign: "center" }}></Grid>

                      <Grid item xs={6} style={{ textAlign: "center" }}>
                        <Box mb={2} mt={2}>
                          <TextField
                            label="Mylapay domain URL"
                            variant="outlined"
                            fullWidth
                            id="standard-start-adornment"
                            sx={{ m: 1, width: "25ch" }}
                            value={formik.values.shop_url}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  https://shop.mylapay.com/
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => {
                              formik.setFieldTouched("shop_url");
                              formik.handleChange(e);
                              checkshopurlvalid(e);
                            }}
                            error={
                              formik.touched.shop_url &&
                              Boolean(formik.errors.shop_url)
                            }
                            helperText={
                              formik.touched.shop_url && formik.errors.shop_url
                            }
                          />
                        </Box>
                      </Grid>
                    </>
                  ) : domainValue == 2 ? (
                    <>
                      <Grid item xs={3} style={{ textAlign: "center" }}></Grid>

                      <Grid item xs={6}>
                        <Box mb={2} mt={2}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="Own Domain URL"
                            id="ownDomain"
                            name="ownDomain"
                            value={formik.values.ownDomain}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                              formik.setFieldTouched("ownDomain");
                              formik.handleChange(e);
                            }}
                            error={
                              formik.touched.ownDomain &&
                              Boolean(formik.errors.ownDomain)
                            }
                            helperText={
                              formik.touched.ownDomain &&
                              formik.errors.ownDomain
                            }
                          />
                        </Box>
                      </Grid>
                    </>
                  ) : null}

                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      style={{
                        color: "green",
                        fontSize: "1.2rem",
                        fontFamily: "Prompt,sans-serif",
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    >
                      Want to buy new domain?
                    </Typography>
                    <FormControl component="fieldset">
                      {/* <FormLabel component="legend">Domain</FormLabel> */}
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel
                          value="2"
                          checked={newDomainValue === 2}
                          onChange={handleChangeNewdomain}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="1"
                          checked={newDomainValue === 1}
                          onChange={handleChangeNewdomain}
                          control={<Radio />}
                          label="No
                        "
                        />
                      </RadioGroup>
                    </FormControl>
                    {
                      newDomainValue === 2 ? (
                        <Box mb={2} mt={2}>
                          <TextField
                            variant="outlined"
                            label="Domain Search"
                            id="domain_name_search"
                            name="domain_name_search"
                            value={formik.values.domain_name_search}
                            onChange={handleChangeDomainSearch}
                            error={
                              formik.touched.domain_name_search &&
                              Boolean(formik.errors.domain_name_search)
                            }
                            helperText={
                              formik.touched.domain_name_search && formik.errors.domain_name_search
                            }
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: "45px", width: "90px",backgroundColor: "#2caee4",height: "40px",marginTop: "5px" }}
                            onClick={handleDomainSearchSubmit}
                          >
                            Search
                          </Button>
                        </Box>    
                      ): null
                    }
                    
                      
                  </Grid>

                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <ul>
                      { 
                        domainList.map((item,index) =>
                          <li key={index} style={{listStyle: "none",height: "75px",borderBottom: "1px solid #e3dfdf",paddingTop: "25px"}}>
                            <span style={{float: "left",fontSize: "22px",fontWeight: "600"}}>{item.domain}</span>
                            <div style={{float: "right",display: "flex"}}>
                              <span style={{marginRight: "20px",color: "#2caee4",fontSize: "20px"}}> ₹ {(item.price)}</span>
                              <span><AddShoppingCart color="inherit" /></span>
                            </div>  
                          </li>
                        )
                      }
                    </ul>
                  </Grid>  

                </Grid>
              </div>
              <div
                className={`${styles.accContent} ${
                  activeStep === 3 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Select your online store web template appropriate to your
                  business category from the theme section and choose
                  pre-defined themes suitable for you. the banner images and
                  category section images can be maintained as is or you can
                  upload your own images if you wish.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {/* <div className="gallery">
                      <ul
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          margin: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        {mylapaygallery.map((product, index) => (
                          <li>
                            <label>
                              <Typography
                                variant="h3"
                                style={{
                                  color: "green",
                                  fontSize: "1.2rem",
                                  fontFamily: "Prompt,sans-serif",
                                  fontWeight: "400",
                                  textAlign: "center",
                                }}
                              >
                                {product.Template_Name}
                              </Typography>
                            </label>
                            <input
                              type="checkbox"
                              value={product.id}
                              checked={optionSelected === index ? true : false}
                            />
                            <label>
                              <img
                                src={`${REACT_APP_SHOPAPI_URL}/uploads/${product.Template_Image}`}
                                onClick={() =>
                                  onToggletheme(index, product.iTemplate)
                                }
                                width="145px"
                                heigth="75px"
                              />
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div> */}

                    <Box alignItems="center" textAlign="center"></Box>

                    <Grid item xs={1}></Grid>
                    {selectedthemelist.length > 0 ? (
                      <Grid item xs={12} md={12}>
                        <div className="gallery">
                          {/* <Box
                            alignItems="center"
                            textAlign="center"
                            style={{ marginTop: "15px" }}
                          >
                            {optionSelected != null ? (
                              <Box>
                                {" "}
                                <b>Suitable Templates for selected Theme </b>{" "}
                              </Box>
                            ) : null}
                          </Box> */}

                          <ul style={{ padding: "0" }}>
                            {selectedthemelist.map((product, index) => (
                              <li
                                className="card"
                                style={{ textAlign: "center", width: "250px" }}
                              >
                                <label className="template_title">
                                  <Typography
                                    variant="h3"
                                    style={{
                                      color: "green",
                                      fontSize: "0.9em",
                                      fontFamily: "Prompt,sans-serif",
                                      fontWeight: "400",
                                      textAlign: "center",
                                    }}
                                  >
                                    {product.Sub_Template_Name}
                                  </Typography>
                                </label>
                                <input
                                  type="checkbox"
                                  value={product.id}
                                  checked={
                                    themeoptionSelected === index ? true : false
                                  }
                                />

                                <label style={{ height: "auto" }}>
                                  <div className="parent">
                                    <img
                                      className="imgclass"
                                      src={`${REACT_APP_SHOPAPI_URL}/uploads/${product.Thumbnail_Image}`}
                                      // src="../../images/theme_grocery.png"
                                      onClick={() =>
                                        onTogglethemetemeplate(
                                          index,
                                          product.iSub_Template,
                                          product.Sub_Template_Url
                                        )
                                      }
                                      // width="145px"
                                      // heigth="250px"
                                      style={{ height: "175px" }}
                                    />
                                  </div>
                                </label>

                                <div className="cardText">
                                  <button
                                    style={{ width: "250px" }}
                                    type="button"
                                    onClick={
                                      (e) =>
                                        handlethemePreviewClick(
                                          product.Sub_Template_Url,
                                          index
                                        )
                                      // e.target.style.background = 'red'
                                    }
                                    className="addCart"
                                  >
                                    View Theme {index + 1}
                                  </button>
                                </div>

                                {/* <Button
                                  variant="contained"
                                  color="primary"
                                  style={{ width: "120px", marginTop:"10px", fontSize:"0.6em" }}
                                  onClick={() =>
                                    handlethemePreviewClick(
                                      product.Sub_Template_Url,
                                      index
                                    )
                                  }
                                  endIcon={<Visibility />}
                                  disabled={loading}
                                >
                                  View Theme {index + 1}
                                </Button> */}
                              </li>
                            ))}
                          </ul>

                          {/* <ul
                            style={{
                              textAlign: "center",
                              // padding: "10px",
                              // margin: "5px",
                              marginBottom: "10px",
                            }}
                          >
                            <li>
                              
                              <>

                              <iframe src="https://shop.mylapay.com/groceryshoppingmart/grocery" title="W3Schools Free Online Web Tutorials" width="360" height="600" className="iframethemes">
                                </iframe>

                          
                              </>

                            </li>

                            <li>
                              
                              <>

                              <iframe src="https://shop.mylapay.com/fashionstore/apparel" title="W3Schools Free Online Web Tutorials" width="360" height="600" className="iframethemes">
                                </iframe>
                              </>

                            </li>

                            <li>
                              
                              <>

                              <iframe src="https://shop.mylapay.com/familydhaba/restaurant" title="W3Schools Free Online Web Tutorials" width="360" height="600" className="iframethemes">
                                </iframe>
                              </>

                            </li>
                            
                            </ul> */}
                        </div>
                      </Grid>
                    ) : (
                      <Typography
                        variant="h3"
                        style={{
                          color: "green",
                          fontSize: "1.2rem",
                          fontFamily: "Prompt,sans-serif",
                          fontWeight: "400",
                          textAlign: "center",
                        }}
                      >
                        Kindly contact administrator
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {galleryvalue != "" ? (
                  <>
                    <div
                      style={{ border: "1px solid", borderColor: "#c5c7c5" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} style={{ marginTop: "15px" }}>
                          <div className={styles.accToolTip}>
                            Select banner images suitable for your business from
                            Mylapay gallery or you can upload your own banner
                            images as you wish. Mylapay allow you to have up to
                            5 banner images as a slider view in your website.
                          </div>
                        </Grid>

                        <Grid item xs={2} spacing={2}></Grid>
                        <Grid item xs={10}>
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              aria-label="gender"
                              name="row-radio-buttons-group"
                            >
                              <FormControlLabel
                                value="theme"
                                onChange={handleChangegallery}
                                checked={galleryvalue === "theme"}
                                control={<Radio />}
                                label="From Themes"
                              />
                              <FormControlLabel
                                value="gallery"
                                onChange={handleChangegallery}
                                checked={galleryvalue === "gallery"}
                                control={<Radio />}
                                label="From Mylapay Gallery"
                              />
                              <FormControlLabel
                                value="custom"
                                onChange={handleChangegallery}
                                checked={galleryvalue === "custom"}
                                control={<Radio />}
                                label="Custom Images"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={1} spacing={2}></Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        {galleryvalue == "custom" ? (
                          <>
                            <Grid item xs={2} spacing={2}></Grid>
                            <Grid item xs={6} spacing={2}>
                              <Box mb={2} md={2}>
                                <BannerFileUpload
                                  id="bannerImage"
                                  name="bannerImage"
                                  value={formik.values.bannerImage}
                                  setfile={setFile}
                                  error={
                                    formik.touched.bannerImage &&
                                    Boolean(formik.errors.bannerImage)
                                  }
                                  helperText={
                                    formik.touched.bannerImage &&
                                    formik.errors.bannerImage
                                  }
                                  style={{ marginBottom: "1em" }}
                                />
                              </Box>
                            </Grid>
                          </>
                        ) : null}

                        {galleryvalue == "gallery" ? (
                          <Grid item xs={5}>
                            <Box mb={2}>
                              <Button
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: "99px", width: "200px" }}
                                onClick={handlegalleryClick}
                              >
                                View Gallery
                              </Button>
                            </Box>
                          </Grid>
                        ) : null}

                        {galleryvalue == "theme" ? (
                          <Grid container spacing={2} alignItems="center">
                            <div className="gallery">
                              <ul>
                                {selectedthemeimages.map((product, index) => (
                                  <li>
                                    <input
                                      type="checkbox"
                                      id={"myCheckbox" + index}
                                      value={index}
                                      onChange={onTogglethemegallery}
                                    />
                                    <label htmlFor={"myCheckbox" + index}>
                                      <img
                                        src={`${REACT_APP_SHOPAPI_URL}/uploads${product.Banner_Image}`}
                                        width="300px"
                                        heigth="200px"
                                      />
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {selectedthemeimages.length > 0 ? (
                              <Grid item xs={12}>
                                <Box display="flex" alignItems="right">
                                  <Box flexGrow={1}></Box>

                                  <Box>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      style={{
                                        marginRight: "20px",
                                        width: "100px",
                                        fontSize: "0.8em",
                                      }}
                                      onClick={handleselectedthemegallery}
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                </Box>
                              </Grid>
                            ) : null}
                          </Grid>
                        ) : null}

                        <Grid item xs={3}></Grid>
                      </Grid>
                    </div>
                    <Grid container spacing={2}>
                      {imageArray.length > 0 &&
                        imageArray.map((item, index) => {
                          return (
                            <div key={index}>
                              <Grid item xs={12}>
                                <Box mb={4} mt={2}>
                                  <img
                                    width="140"
                                    height="100"
                                    style={{
                                      float: "left",
                                      border: "1px solid rgba(0, 0, 0, 0.23)",
                                      borderRadius: "4px",
                                      marginRight: "6px",
                                    }}
                                    src={URL.createObjectURL(item)}
                                    alt="Image"
                                  />
                                </Box>

                                <Box mb={4} textAlign="center">
                                  <IconButton
                                    color="primary"
                                    onClick={() => deleteImageFromArray(item)}
                                    component="span"
                                  >
                                    <Cancel />
                                  </IconButton>
                                </Box>
                              </Grid>
                            </div>
                          );
                        })}
                    </Grid>
                  </>
                ) : null}
              </div>
              <div
                className={`${styles.accContent} ${
                  activeStep === 2 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Upload you shop logo image, fill shop name and choose the
                  color you wish to have for your web site
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={2}></Grid>

                  <Grid item xs={3}>
                    <Box mb={2} mt={2}>
                      <ImageUpload
                        setShopLogo={setShopLogo}
                        value={formik.values.shop_logo}
                        error={
                          formik.touched.shop_logo &&
                          Boolean(formik.errors.shop_logo)
                        }
                        helperText={
                          formik.touched.shop_logo && formik.errors.shop_logo
                        }
                      />
                    </Box>

                    <Box mb={2}></Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box mb={2} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Name"
                        id="shop_name"
                        name="shop_name"
                        value={formik.values.shop_name}
                        onChange={handleChangeabout}
                        error={
                          formik.touched.shop_name &&
                          Boolean(formik.errors.shop_name)
                        }
                        helperText={
                          formik.touched.shop_name && formik.errors.shop_name
                        }
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        <Box mb={2} mt={2}>
                          {/* <TextField
                            variant="outlined"
                            fullWidth
                            label="Color Code"
                            id="colorCode"
                            name="colorCode"
                            disabled
                            onClick={handleClick}
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.colorCode}
                            error={
                              formik.touched.colorCode &&
                              Boolean(formik.errors.colorCode)
                            }
                            helperText={
                              formik.touched.colorCode &&
                              formik.errors.colorCode
                            }
                          /> */}

                          <Button
                            onClick={handleClick}
                            variant="contained"
                            color="primary"
                            style={{ width: "290px", height: "56px" }}
                          >
                            Pick Color
                          </Button>
                        </Box>

                        {statepicker.displayColorPicker ? (
                          <div style={popover}>
                            <div style={cover} onClick={handleClose} />
                            <ChromePicker
                              color={statecolor.background}
                              onChangeComplete={handleChangeComplete}
                            />
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item xs={2}>
                        <Box mb={2}>
                          <div
                            style={{
                              color: formik.values.colorCode,
                              fontSize: "5.0em",
                              textAlign: "center",
                              marginTop: "-14px",
                              marginLeft: "-16px",
                            }}
                          >
                            <span>&#9632;</span>
                          </div>
                        </Box>
                      </Grid>

                      {/* <Grid item xs={4}>
                        <Box mb={2} mt={2}>
                          <Button
                              onClick={handleClick}
                              variant="contained"
                              color="primary"
                            >
                              Pick Color
                            </Button>
                          </Box>
                          
                      </Grid> */}
                    </Grid>
                  </Grid>
                  <Grid item xs={2}></Grid>

                  <Grid item xs={9}>
                    <Box mb={2} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Tagline"
                        multiline
                        rows={3}
                        id="tagline"
                        name="tagline"
                        value={formik.values.tagline}
                        onChange={(e) => {
                          formik.setFieldTouched("tagline");
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.tagline &&
                          Boolean(formik.errors.tagline)
                        }
                        helperText={
                          formik.touched.tagline && formik.errors.tagline
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>

              <div
                className={`${styles.accContent} ${
                  activeStep === 4 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Select Category banner images suitable for your business from
                  Mylapay gallery or you can upload your own category banner
                  images as you wish.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={6} spacing={2}>
                    <Box mb={2}>
                      <BannerFileUpload
                        id="categorybannerImage"
                        name="categorybannerImage"
                        value={formik.values.categorybannerImage}
                        setfile={setCategoryFile}
                        error={
                          formik.touched.categorybannerImage &&
                          Boolean(formik.errors.categorybannerImage)
                        }
                        helperText={
                          formik.touched.categorybannerImage &&
                          formik.errors.categorybannerImage
                        }
                        style={{ marginBottom: "1em" }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={5}>
                    <Box mb={2} mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "99px", width: "160px" }}
                        onClick={handleCategorygalleryClick}
                      >
                        Mylapay Gallery
                      </Button>
                    </Box>
                  </Grid>

                  <Grid container spacing={2}>
                    {/* {categoryimageArray.length > 0 &&
                      categoryimageArray.map((item, index) => {
                        return (
                          <div key={index}>
                            <Grid item xs={12}>
                              <Box mb={4} mt={2}>
                                <img
                                  width="150"
                                  height="100"
                                  style={{
                                    float: "left",
                                    border: "1px solid rgba(0, 0, 0, 0.23)",
                                    borderRadius: "4px",
                                    marginRight: "6px",
                                  }}
                                  src={URL.createObjectURL(item)}
                                  alt="Image"
                                />
                              </Box>

                              <Box mb={4} textAlign="center">

                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    deletecategoryImageFromArray(item)
                                  }
                                  component="span"
                                >
                                  <Cancel />
                                </IconButton>
                              </Box>
                            </Grid>
                          </div>
                        );
                      })} */}

                    {categoryimageArray != "" ? (
                      <div>
                        <Grid item xs={12}>
                          <Box mb={4} mt={2}>
                            <img
                              width="150"
                              height="100"
                              style={{
                                float: "left",
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                borderRadius: "4px",
                                marginRight: "6px",
                              }}
                              src={URL.createObjectURL(categoryimageArray)}
                              alt="Image"
                            />
                          </Box>

                          <Box mb={4} textAlign="center">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                deletecategoryImageFromArray(categoryimageArray)
                              }
                              component="span"
                            >
                              <Cancel />
                            </IconButton>
                          </Box>
                        </Grid>
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
              </div>
              <div
                className={`${styles.accContent} ${
                  activeStep === 5 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Tell your customer about your shop. Mylapay provides a
                  predefined content which can be edited as you wish!
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleChangeChk}
                      />
                      Choose Pre-defined content
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mb={1} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="About Us"
                        multiline
                        rows={15}
                        id="aboutus"
                        name="aboutus"
                        value={formik.values.aboutUs}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChangeaboutfield}
                        error={
                          formik.touched.aboutUs &&
                          Boolean(formik.errors.aboutUs)
                        }
                        helperText={
                          formik.touched.aboutUs && formik.errors.aboutUs
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>
              <div
                className={`${styles.accContent} ${
                  activeStep === 6 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Narrate a short story on why customer love your shop, products
                  and services to attract your customers. Mylapay provides a
                  predefined content which can be edited as you wish.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>
                      <input
                        type="checkbox"
                        checked={cuslovechecked}
                        defaultChecked={cuslovechecked}
                        onChange={handleChangeChkcus_love}
                      />
                      Choose Pre-defined content
                    </label>
                  </Grid>

                  <Grid item xs={12}>
                    <Box mb={1} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Why customers love us"
                        multiline
                        rows={15}
                        id="cuslove"
                        name="cuslove"
                        value={formik.values.cuslove}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChangecuslove}
                        error={
                          formik.touched.cuslove &&
                          Boolean(formik.errors.cuslove)
                        }
                        helperText={
                          formik.touched.cuslove && formik.errors.cuslove
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>
              <div
                className={`${styles.accContent} ${
                  activeStep === 7 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Your shop address, email id and phone number is auto updated
                  from your profile information which you can edit.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={3}></Grid>
                  <Grid item xs={6}>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Shop Location"
                        id="location"
                        name="location"
                        multiline
                        rows={6}
                        disabled
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.location}
                        onChange={(e) => {
                          formik.setFieldTouched("location");
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.location &&
                          Boolean(formik.errors.location)
                        }
                        helperText={
                          formik.touched.location && formik.errors.location
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={3}></Grid>
                  <Grid item xs={3}></Grid>

                  <Grid item xs={6}>
                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Contact Email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formik.values.contactEmail}
                        onChange={(e) => {
                          formik.setFieldTouched("contactEmail");
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.contactEmail &&
                          Boolean(formik.errors.contactEmail)
                        }
                        helperText={
                          formik.touched.contactEmail &&
                          formik.errors.contactEmail
                        }
                      />
                    </Box>

                    <Box mb={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Contact Number"
                        id="contactNumber"
                        name="contactNumber"
                        value={formik.values.contactNumber}
                        onChange={(e) => {
                          formik.setFieldTouched("contactNumber");
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.contactNumber &&
                          Boolean(formik.errors.contactNumber)
                        }
                        helperText={
                          formik.touched.contactNumber &&
                          formik.errors.contactNumber
                        }
                      />
                    </Box>
                    <Box mb={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        // style={{marginLeft:"99px", width:"160px"}}
                        onClick={handleScheduleBusinessHours}
                        endIcon={<AccessTime />}
                      >
                        Schedule Business Hours
                      </Button>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={3}>
                    
                  </Grid> */}

                  <Grid item xs={3}></Grid>
                </Grid>
              </div>
              <div
                className={`${styles.accContent} ${
                  activeStep === 8 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Add question and answer statement which you feel that your
                  customers would frequently ask for better understanding of
                  your shop, product and services
                </div>

                <Grid container spacing={2}>
                  {Object.values(formValues).map((element, index) => (
                    <>
                      <Grid item xs={10}>
                        <Box mb={2}>
                          <div className="form-inline" key={index}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              label={"Question " + (index + 1)}
                              id={"Question " + (index + 1)}
                              name="question"
                              value={element.question}
                              onChange={(e) => handleChangequs(index, e)}
                            />
                          </div>
                        </Box>

                        <Box mb={2}>
                          <div className="form-inline" key={index}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              label={"Answer " + (index + 1)}
                              id="answer"
                              name="answer"
                              value={element.answer || ""}
                              onChange={(e) => handleChangequs(index, e)}
                            />
                          </div>
                        </Box>
                      </Grid>

                      <Grid item xs={1}>
                        {index ? (
                          // <button type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</button>

                          <IconButton
                            style={{ color: "#f44336" }}
                            onClick={() => removeFormFields(index)}
                            component="span"
                          >
                            <Cancel />
                          </IconButton>
                        ) : null}
                      </Grid>

                      <Grid item xs={1}>
                        {formValues.length - 1 === index && (
                          <IconButton
                            color="primary"
                            onClick={addFormFields}
                            component="span"
                          >
                            <ControlPoint />
                          </IconButton>
                        )}
                      </Grid>
                    </>
                  ))}
                </Grid>
              </div>

              <div
                className={`${styles.accContent} ${
                  activeStep === 9 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Narrate your shop’s / business terms & condition to your
                  customers with respect to your product and services. You can
                  use predefined content available in the section that may suit
                  you or you can edit or write the terms & condition on your
                  own.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>
                      <input
                        type="checkbox"
                        checked={termschecked}
                        // defaultChecked={termschecked}
                        onChange={handleChangeChkterms}
                      />
                      Choose Pre-defined content
                    </label>
                  </Grid>

                  <Grid item xs={12}>
                    <Box mb={1} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Terms & Condition"
                        multiline
                        rows={35}
                        id="terms"
                        name="terms"
                        value={formik.values.terms}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChangeterms}
                        error={
                          formik.touched.terms && Boolean(formik.errors.terms)
                        }
                        helperText={formik.touched.terms && formik.errors.terms}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>

              <div
                className={`${styles.accContent} ${
                  activeStep === 10 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Mylapay provides a standard content on Privecy policy on your
                  website to publish.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>
                      <input
                        type="checkbox"
                        checked={privacypolicychecked}
                        // defaultChecked={termschecked}
                        onChange={handleChangeChkprivacypolicy}
                      />
                      Predefined Privacy policy template
                    </label>
                  </Grid>

                  <Grid item xs={12}>
                    <Box mb={1} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Privacy policy"
                        multiline
                        rows={35}
                        id="privacypolicy"
                        name="privacypolicy"
                        disabled
                        value={formik.values.privacypolicy}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChangeprivacypolicy}
                        error={
                          formik.touched.privacypolicy &&
                          Boolean(formik.errors.privacypolicy)
                        }
                        helperText={
                          formik.touched.privacypolicy &&
                          formik.errors.privacypolicy
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>

              <div
                className={`${styles.accContent} ${
                  activeStep === 11 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Mylapay provides a standard content on return policy on your
                  website to publish. Select the number of days in the drop-down
                  menu to indicate your customers that your shop can allow the
                  maximum days to return of products or services.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Box mb={1} mt={2}>
                      Select no. of days allowed for customer to return the
                      products
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <Box mb={1} mt={2} className="returndays">
                      <SelectSearch
                        value={formik.values.returndays}
                        onChange={handleChange}
                        style={{ width: "200px" }}
                        options={[
                          { value: 0, name: "Select Days" },
                          { value: 1, name: "1 Day" },
                          { value: 2, name: "2 Days" },
                          { value: 3, name: "3 Days" },
                          { value: 4, name: "4 Days" },
                          { value: 5, name: "5 Days" },
                          { value: 6, name: "6 Days" },
                          { value: 7, name: "7 Days" },
                          { value: 8, name: "8 Days" },
                          { value: 9, name: "9 Days" },
                          { value: 10, name: "10 Days" },
                          { value: 11, name: "11 Days" },
                          { value: 12, name: "12 Days" },
                          { value: 13, name: "13 Days" },
                          { value: 14, name: "14 Days" },
                          { value: 15, name: "15 Days" },
                        ]}
                        placeholder="Choose Return Days"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box mb={1} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Return Policy"
                        multiline
                        disabled
                        rows={20}
                        id="return"
                        name="return"
                        value={formik.values.return}
                        InputLabelProps={{ shrink: true }}
                        // onChange={handleChangeaboutfield}
                        onChange={(e) => {
                          formik.setFieldTouched("return");
                        }}
                        error={
                          formik.touched.return && Boolean(formik.errors.return)
                        }
                        helperText={
                          formik.touched.return && formik.errors.return
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>

              <div
                className={`${styles.accContent} ${
                  activeStep === 12 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Mylapay narrates a standard class of policy applicable for
                  all.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box mb={1} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Refund & cancellation Policy"
                        multiline
                        rows={20}
                        id="refund"
                        name="refund"
                        disabled
                        value={formik.values.refund}
                        InputLabelProps={{ shrink: true }}
                        // onChange={handleChangeaboutfield}
                        onChange={(e) => {
                          formik.setFieldTouched("refund");
                        }}
                        error={
                          formik.touched.refund && Boolean(formik.errors.refund)
                        }
                        helperText={
                          formik.touched.refund && formik.errors.refund
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>

              <div
                className={`${styles.accContent} ${
                  activeStep === 13 ? styles.accActive : ""
                }`}
              >
                <div className={styles.accToolTip}>
                  Add your social media account page links for customer to
                  connect or view your shop in Facebook, Instagram and
                  Pinterest.
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box mb={2} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Copyright Name"
                        id="copyright"
                        name="copyright"
                        value={formik.values.copyright}
                        onChange={(e) => {
                          formik.setFieldTouched("copyright");
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.copyright &&
                          Boolean(formik.errors.copyright)
                        }
                        helperText={
                          formik.touched.copyright && formik.errors.copyright
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box mb={2} mt={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="Copyright Year"
                        id="copyyear"
                        name="copyyear"
                        value={formik.values.copyyear}
                        onChange={(e) => {
                          formik.setFieldTouched("copyyear");
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.copyyear &&
                          Boolean(formik.errors.copyyear)
                        }
                        helperText={
                          formik.touched.copyyear && formik.errors.copyyear
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box mb={2} mt={2}>
                      <TextField
                        label="Facebook Link"
                        fullWidth
                        id="standard-start-adornment"
                        sx={{ m: 1, width: "25ch" }}
                        value={formik.values.facebook}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              https://www.facebook.com/
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          formik.setFieldTouched("facebook");
                          formik.handleChange(e);
                          checkvalidurlfacebook(e);
                        }}
                        error={
                          formik.touched.facebook &&
                          Boolean(formik.errors.facebook)
                        }
                        helperText={
                          formik.touched.facebook && formik.errors.facebook
                        }
                        variant="outlined"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box mb={2} mt={2}>
                      <TextField
                        label="Instagram Link"
                        fullWidth
                        id="standard-start-adornment"
                        sx={{ m: 1, width: "25ch" }}
                        value={formik.values.instagram}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              https://www.instagram.com/
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          formik.setFieldTouched("instagram");
                          formik.handleChange(e);
                          checkvalidurlinstagram(e);
                        }}
                        error={
                          formik.touched.instagram &&
                          Boolean(formik.errors.instagram)
                        }
                        helperText={
                          formik.touched.instagram && formik.errors.instagram
                        }
                        variant="outlined"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box mb={2} mt={2}>
                      <TextField
                        label="Twitter Link"
                        fullWidth
                        id="standard-start-adornment"
                        sx={{ m: 1, width: "25ch" }}
                        value={formik.values.pinterest}
                        InputProps={{
                          startAdornment: (
                            // <InputAdornment position="start">
                            //   https://in.pinterest.com/
                            // </InputAdornment>

                            <InputAdornment position="start">
                              https://www.twitter.com/
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          formik.setFieldTouched("pinterest");
                          formik.handleChange(e);

                          checkvalidurlpinterest(e);
                        }}
                        error={
                          formik.touched.pinterest &&
                          Boolean(formik.errors.pinterest)
                        }
                        helperText={
                          formik.touched.pinterest && formik.errors.pinterest
                        }
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
          <Box mt={2} display="flex">
            {/* <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            onClick={nextstep}
            style={{ marginLeft: "auto" }}
          >
            Next
          </Button> */}

            {/* <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: "130px" }}
              endIcon={<ArrowForward />}
              style={{ marginLeft: "auto" }}
            >
              Save & Continue
            </Button> */}
          </Box>
        </>
        {/* NEW ACCORDIAN END */}
      </form>

      <Dialog
        style={{ width: "800px", margin: "auto" }}
        open={dialogOpenSchedule}
        onClose={handleDialogScheduleClose}
      >
        <DialogTitle>Add A Business HOURS</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div style={{ fontWeight: "500" }}>Day</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <p style={{ fontWeight: "500" }}>Open Time</p>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <p style={{ fontWeight: "500" }}>Close Time</p>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <p style={{ fontWeight: "500" }}>Open / Close</p>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div>Sunday</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="From Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedFromTimeSunday}
                  onChange={(date) => handleFromTimeChange(date, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="To Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedToTimeSunday}
                  onChange={(date) => handleToTimeChange(date, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <FormGroup>
                  <FormControlLabel
                    style={{ marginLeft: "60px" }}
                    control={
                      <Switch
                        checked={sundayOpen ? true : false}
                        onChange={(event) =>
                          handleChangeShopOpenClose(event, 0)
                        }
                      />
                    }
                    label=""
                  />
                </FormGroup>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div>Monday</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="From Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedFromTimeMonday}
                  onChange={(date) => handleFromTimeChange(date, 1)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="To Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedToTimeMonday}
                  onChange={(date) => handleToTimeChange(date, 1)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <FormGroup>
                  <FormControlLabel
                    style={{ marginLeft: "60px" }}
                    control={
                      <Switch
                        checked={mondayOpen ? true : false}
                        onChange={(event) =>
                          handleChangeShopOpenClose(event, 1)
                        }
                      />
                    }
                    label=""
                  />
                </FormGroup>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div>Tuesday</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="From Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedFromTimeTuesday}
                  onChange={(date) => handleFromTimeChange(date, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="To Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedToTimeTuesday}
                  onChange={(date) => handleToTimeChange(date, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <FormGroup>
                  <FormControlLabel
                    style={{ marginLeft: "60px" }}
                    control={
                      <Switch
                        checked={tuesdayOpen ? true : false}
                        onChange={(event) =>
                          handleChangeShopOpenClose(event, 2)
                        }
                      />
                    }
                    label=""
                  />
                </FormGroup>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div>Wednesday</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="From Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedFromTimeWednesday}
                  onChange={(date) => handleFromTimeChange(date, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="To Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedToTimeWednesday}
                  onChange={(date) => handleToTimeChange(date, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <FormGroup>
                  <FormControlLabel
                    style={{ marginLeft: "60px" }}
                    control={
                      <Switch
                        checked={wednesdayOpen ? true : false}
                        onChange={(event) =>
                          handleChangeShopOpenClose(event, 3)
                        }
                      />
                    }
                    label=""
                  />
                </FormGroup>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div>Thursday</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="From Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedFromTimeThursday}
                  onChange={(date) => handleFromTimeChange(date, 4)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="To Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedToTimeThursday}
                  onChange={(date) => handleToTimeChange(date, 4)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <FormGroup>
                  <FormControlLabel
                    style={{ marginLeft: "60px" }}
                    control={
                      <Switch
                        checked={thursdayOpen ? true : false}
                        onChange={(event) =>
                          handleChangeShopOpenClose(event, 4)
                        }
                      />
                    }
                    label=""
                  />
                </FormGroup>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div>Friday</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="From Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedFromTimeFriday}
                  onChange={(date) => handleFromTimeChange(date, 5)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="To Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedToTimeFriday}
                  onChange={(date) => handleToTimeChange(date, 5)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <FormGroup>
                  <FormControlLabel
                    style={{ marginLeft: "60px" }}
                    control={
                      <Switch
                        checked={fridayOpen ? true : false}
                        onChange={(event) =>
                          handleChangeShopOpenClose(event, 5)
                        }
                      />
                    }
                    label=""
                  />
                </FormGroup>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <div>Saturday</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="From Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedFromTimeSaturday}
                  onChange={(date) => handleFromTimeChange(date, 6)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <KeyboardTimePicker
                  label="To Time"
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={selectedToTimeSaturday}
                  onChange={(date) => handleToTimeChange(date, 6)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box mb={1} mt={2}>
                <FormGroup>
                  <FormControlLabel
                    style={{ marginLeft: "60px" }}
                    control={
                      <Switch
                        checked={saturdayOpen ? true : false}
                        onChange={(event) =>
                          handleChangeShopOpenClose(event, 6)
                        }
                      />
                    }
                    label=""
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
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
