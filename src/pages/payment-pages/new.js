import { Box, Container, Step, StepLabel, Stepper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import PaymentDetails from "../../components/payment-pages/PaymentDetails";
import ProductDetails from "../../components/payment-pages/ProductDetails";
import ShopDetails from "../../components/payment-pages/ShopDetails";
import ShipmentDetails from "../../components/payment-pages/ShipmentDetails";
import ChargesDetails from "../../components/payment-pages/ChargesDetails";
import { setShopDetails } from "../../redux/paymentPageSlice";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import axios from "axios";
import styles from "./css/Edit.module.css";
import { useDispatch, useSelector } from "react-redux";

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
export default function PaymentPageNew() {
  const [activeStep, setActiveStep] = useState(0);
  const { search } = useLocation();
  const { editItem } = queryString.parse(search);
  const { REACT_APP_API_URL } = process.env;
  const { REACT_APP_SHOPAPI_URL } = process.env;

  const iShop = useSelector((state) => state.paymentPage.iShop);
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
  useEffect(() => {
    // if (!editItem) return;
    const getData = async () => {
      setoverlay_on(true);
      setprogress_on_fullpage(true);

      await axios
        // .get(`mylapay/customer/shop/view?shop_url=${editItem}`)
        .get(`mylapay/shop/shop_details?pageType=1`)
        .then(async (res) => {
          if (res.data.status === 1) {
            // if (res.data.data.length === 0) return;
            if (res.data.data.length > 0) {
              console.log(res.data.data);
              let logoFile = await createFileFromUrl(
                `${REACT_APP_SHOPAPI_URL}/uploads${res.data.data[0].shop_logo}`,
                "logo"
              );
              const shopDetails = {
                // shop_name: res.data.data[0].shop_name,
                shop_logo: logoFile,
                // shop_url: res.data.data[0].url_name,
                aboutUs: res.data.data[0].About_Us,
                contactEmail: res.data.data[0].Shop_Contact_email,
                contactNumber: res.data.data[0].Shop_Contact_no,
                location: res.data.data[0].location,
                colorCode: res.data.data[0].Color_Code,
                refund: res.data.data[0].refund,
                faqs: res.data.data[0].FAQs,
                return: res.data.data[0].return,
                copyright: res.data.data[0].copyright,
                copyyear: res.data.data[0].copyyear,
                instagram: res.data.data[0].instagram,
                facebook: res.data.data[0].facebook,
                pinterest: res.data.data[0].pinterest,
                returndays: res.data.data[0].returndays,
                terms: res.data.data[0].terms,
                privacypolicy: res.data.data[0].Privacy_Policy,
                returndays: res.data.data[0].returndays,
                // description: res.data.data[0].description,
                // category: res.data.data[0].category,
                // shop_url: res.data.data[0].url_name,
              };
              // console.log(shopDetails);
              dispatch(setShopDetails(shopDetails));
              setoverlay_on(false);
              setprogress_on_fullpage(false);
            } else {
              setoverlay_on(false);
              setprogress_on_fullpage(false);
            }

            // const productDetails =
          } else {
            setoverlay_on(false);
            setprogress_on_fullpage(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getData();
  }, [REACT_APP_API_URL]);

  const stepChange = (n) => {
    setActiveStep(n);
  };

  const stepContent = () => {
    if (iShop != undefined) {
      switch (activeStep) {
        case 0:
          return <ShopDetails shopID={iShop} stepChange={stepChange} />;
        case 1:
          return <ProductDetails shopID={iShop} stepChange={stepChange} />;
        // case 2:
        //   return <PaymentDetails stepChange={stepChange} />;
        // case 2:
        //   return <ShipmentDetails stepChange={stepChange} />;

        case 2:
          return <ChargesDetails shopID={iShop} stepChange={stepChange} />;

        default:
          return <ShopDetails stepChange={stepChange} />;
      }
    } else {
      switch (activeStep) {
        case 0:
          return <ShopDetails stepChange={stepChange} />;
        case 1:
          return <ProductDetails stepChange={stepChange} />;
        // case 2:
        //   return <PaymentDetails stepChange={stepChange} />;
        // case 2:
        //   return <ShipmentDetails stepChange={stepChange} />;

        case 2:
          return <ChargesDetails stepChange={stepChange} />;

        default:
          return <ShopDetails stepChange={stepChange} />;
      }
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
