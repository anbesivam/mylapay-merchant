import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import PaymentDetails from "../../components/payment-pages/PaymentDetails";
import ProductDetails from "../../components/payment-pages/ProductDetails";
import ShopDetails from "../../components/payment-pages/ShopDetails";
import ShipmentDetails from "../../components/payment-pages/ShipmentDetails";
import ChargesDetails from "../../components/payment-pages/ChargesDetails";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import axios from "axios";
import {
  setPaymentDetails,
  setProductDetails,
  setShopDetails,
  setShipmentDetails,
  setiShop,
  setAddressType,
} from "../../redux/paymentPageSlice";
import { useDispatch } from "react-redux";
import { Paper } from "@material-ui/core";
import styles from "./css/Edit.module.css";
import StepOne from "../../components/payment-pages/StepOne";

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

export default function PaymentPageEdit() {
  const [activeStep, setActiveStep] = useState(0);
  const { search } = useLocation();
  const { editItem, shopId } = queryString.parse(search);

  //const [shopId, setShopId] = useState(null);
  const iMid = localStorage.getItem("imid");
  const { REACT_APP_API_URL } = process.env;
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const dispatch = useDispatch();

  const classesFacebook = useStylesFacebook();

  const [progress_on, setprogress_on] = useState(false);
  const [overlay_on, setoverlay_on] = useState(false);
  const [progress_on_fullpage, setprogress_on_fullpage] = useState(false);

  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
  };
  const getData = async () => {
    await axios
      .get(`mylapay/customer/shop/view?shop_url=${editItem}&imid=${iMid}`)
      .then(async (res) => {
        if (res.data.status === 1) {
          if (res.data.data.length === 0) return;
          //(res.data.data.shopID);
          dispatch(setiShop(res.data.data.shopID));
          dispatch(setAddressType(res.data.data.Address_Type));
          let logoFile = await createFileFromUrl(
            `${REACT_APP_SHOPAPI_URL}/uploads${res.data.data.shop_logo}`,
            "logo"
          );

          let bannerfile = await createFileFromUrl(
            `${REACT_APP_SHOPAPI_URL}/uploads${res.data.data.Banner_Image}`,
            "logo"
          );

          let cat_url = "";

          if (res.data.data.caturl == null) {
            if (
              localStorage.getItem("category") == "Groceries and supermarkets"
            ) {
              cat_url = "grocery";
            }
          } else {
            cat_url = "grocery";
          }

          const shopDetails = {
            shop_name: res.data.data.shop_name,
            shop_logo: logoFile,
            tagline: res.data.data.description,
            shop_url: res.data.data.url_name,
            ownDomain: res.data.data.Own_Domain,
            bannerImage: res.data.data.shop_banner,
            categorybannerImage: res.data.data.Category_Image,
            aboutUs: res.data.data.About_Us,
            colorCode: res.data.data.Color_Code,
            faqs: res.data.data.faq,
            caturl: res.data.data.caturl,
            contactEmail: res.data.data.Shop_Contact_email,
            contactNumber: res.data.data.Shop_Contact_no,
            location: res.data.data.location,
            terms: res.data.data.terms,
            privacypolicy: res.data.data.Privacy_Policy,
            refund: res.data.data.refund,
            return: res.data.data.return,
            copyright: res.data.data.copyright,
            copyyear: res.data.data.copyyear,
            instagram: res.data.data.instagram,
            facebook: res.data.data.facebook,
            pinterest: res.data.data.pinterest,
            returndays: res.data.data.returndays,
            iTemplate: res.data.data.iTemplate,
            iTheme: res.data.data.iTheme,
            iSub_Template: res.data.data.iSub_Template,
            Template_Name: res.data.data.Template_Name,
          };
          await axios
            .get(
              `mylapay/shop/shop_details?pageType=1&iShop=${shopId}&onlineStoreId=${shopId}`
            )
            .then(async (response) => {
              if (response.data.status === 1) {
                shopDetails.location = response.data.data.location;
              }
            })
            .catch((err) => console.log(err));
          dispatch(setShopDetails(shopDetails));
          console.log(shopDetails);
          const shipDetails = {
            shipmentOptions: JSON.parse(res.data.data.iShipment_Opt),
            mercDeliveryCharge: res.data.data.Delivery_Charge,
          };
          //dispatch(setShipmentDetails(shipDetails));

          const prodDetails = await Promise.all(
            res.data.data.products.map(async (item) => {
              let imageFile = await createFileFromUrl(
                `${REACT_APP_SHOPAPI_URL}/uploads${item.product_image}`,
                item.file_name
              );
              // delete item.id;
              return {
                ...item,
                product_image: imageFile,
              };
            })
          );
          dispatch(setProductDetails(prodDetails));

          dispatch(setPaymentDetails(res.data.data.page_info));
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!editItem) return;

    const getData = async () => {
      setoverlay_on(true);
      setprogress_on_fullpage(true);

      await axios
        .get(`mylapay/customer/shop/view?shop_url=${editItem}&imid=${iMid}`)
        .then(async (res) => {
          if (res.data.status === 1) {
            if (res.data.data.length === 0) return;
            //setShopId(res.data.data.shopID);
            dispatch(setiShop(res.data.data.shopID));
            dispatch(setAddressType(res.data.data.Address_Type));
            if (localStorage.getItem("addprodcut") == 1) {
              stepChange(1);
            }

            let logoFile = await createFileFromUrl(
              `${REACT_APP_SHOPAPI_URL}/uploads${res.data.data.shop_logo}`,
              "logo"
            );

            let bannerfile = await createFileFromUrl(
              `${REACT_APP_SHOPAPI_URL}/uploads${res.data.data.Banner_Image}`,
              "logo"
            );

            let cat_url = "";

            if (res.data.data.caturl == null) {
              if (
                localStorage.getItem("category") == "Groceries and supermarkets"
              ) {
                cat_url = "grocery";
              }
            } else {
              cat_url = "grocery";
            }
            const shopDetails = {
              shop_name: res.data.data.shop_name,
              shop_logo: logoFile,
              tagline: res.data.data.description,
              shop_url: res.data.data.url_name,
              ownDomain: res.data.data.Own_Domain,
              bannerImage: res.data.data.shop_banner,
              categorybannerImage: res.data.data.Category_Image,
              aboutUs: res.data.data.About_Us,
              colorCode: res.data.data.Color_Code,
              faqs: res.data.data.faq,
              caturl: res.data.data.caturl,
              contactEmail: res.data.data.Shop_Contact_email,
              contactNumber: res.data.data.Shop_Contact_no,
              //location: res.data.data.location,
              terms: res.data.data.terms,
              privacypolicy: res.data.data.Privacy_Policy,
              refund: res.data.data.refund,
              return: res.data.data.return,
              copyright: res.data.data.copyright,
              copyyear: res.data.data.copyyear,
              instagram: res.data.data.instagram,
              facebook: res.data.data.facebook,
              pinterest: res.data.data.pinterest,
              returndays: res.data.data.returndays,
              iTemplate: res.data.data.iTemplate,
              iTheme: res.data.data.iTheme,
              iSub_Template: res.data.data.iSub_Template,
              Template_Name: res.data.data.Template_Name,
            };

            await axios
              .get(
                `mylapay/shop/shop_details?pageType=1&iShop=${shopId}&onlineStoreId=${shopId}`
              )
              .then(async (response) => {
                if (response.data.status === 1) {
                  shopDetails.location = response.data.data[0].location;
                }
              })
              .catch((err) => console.log(err));

            dispatch(setShopDetails(shopDetails));
            console.log("shopDetails-------", shopDetails);
            const shipDetails = {
              shipmentOptions: JSON.parse(res.data.data.iShipment_Opt),
              mercDeliveryCharge: res.data.data.Delivery_Charge,
            };
            //dispatch(setShipmentDetails(shipDetails));

            const prodDetails = await Promise.all(
              res.data.data.products.map(async (item) => {
                let imageFile = await createFileFromUrl(
                  `${REACT_APP_SHOPAPI_URL}/uploads${item.product_image}`,
                  item.file_name
                );
                // delete item.id;
                return {
                  ...item,
                  product_image: imageFile,
                };
              })
            );
            dispatch(setProductDetails(prodDetails));

            dispatch(setPaymentDetails(res.data.data.page_info));

            setoverlay_on(false);
            setprogress_on_fullpage(false);
          }
        })
        .catch((err) => console.log(err));
    };
    getData();
  }, [editItem, REACT_APP_API_URL, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setShopDetails(null));
      dispatch(setProductDetails(null));
      dispatch(setPaymentDetails(null));
      dispatch(setShipmentDetails(null));
      dispatch(setiShop(null));
    };
  }, [dispatch]);

  const stepChange = (n) => {
    setActiveStep(n);
  };

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ShopDetails
            shopID={shopId}
            stepChange={stepChange}
            geShopData={getData}
          />
        );
      case 1:
        return <ProductDetails shopID={shopId} stepChange={stepChange} />;
      // case 2:
      //   return <PaymentDetails shopID={shopId} stepChange={stepChange} />;
      // case 2:
      //   return <ShipmentDetails shopID={shopId} stepChange={stepChange} />;

      case 2:
        return <ChargesDetails shopID={shopId} stepChange={stepChange} />;

      default:
        return <ShopDetails stepChange={stepChange} />;
    }
  };

  const stepTitles = [
    "Configure Online Store",
    "Add your products",
    "Shipment & Pricing",
  ];

  return (
    <>
      <Container className="full-height">
        {/* <Box mb={3}>
        <Stepper
          style={{ background: "transparent" }}
          activeStep={activeStep}
          alternativeLabel
        >
          <Step>
            <StepLabel>Configure Online Store</StepLabel>
          </Step>
          <Step>
            <StepLabel>Product Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Shipment Details</StepLabel>
          </Step>

          <Step>
            <StepLabel>Pricing</StepLabel>
          </Step>
        </Stepper>
      </Box> */}

        <Box my={3} className={styles.stepWrap}>
          {stepTitles.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              className={`${styles.stepCard} ${
                i === activeStep ? styles.active : ""
              }`}
            >
              {item}
            </div>
          ))}
        </Box>

        {stepContent()}

        <Box pb={5}></Box>

        {/* <StepOne /> */}
      </Container>

      <div
        className={`overlay ${overlay_on ? "overlay_on" : "overlay_off"}`}
      ></div>

      <div
        className={`profitability_progress ${
          progress_on_fullpage ? "progress_on" : "progress_off"
        }`}
      >
        <CircularProgress
          variant="indeterminate"
          disableShrink
          className={classesFacebook.top}
          classes={{
            circle: classesFacebook.circle,
          }}
          size={40}
          thickness={4}
        />
      </div>
    </>
  );
}
