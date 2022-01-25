import { Box, Container, Step, StepLabel, Stepper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import WebPageDetails from "../../components/payment-web-pages/WebPageDetails";
import WebPageLinks from "../../components/payment-web-pages/WebPageLinks";
import queryString from "query-string";
import {
  setPaymentPageDetails,
  setWebPageDetails,
} from "../../redux/paymentWebPageSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "./css/Edit.module.css";

export default function PaymentWebPageEdit() {
  const [activeStep, setActiveStep] = useState(0);
  const { search } = useLocation();
  const { editItem } = queryString.parse(search);
  const [webPageId, setWebPageId] = useState(null);
  const [onlineStoreId, setOnlinseStoreId] = useState(0);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { REACT_APP_API_URL } = process.env;
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const dispatch = useDispatch();

  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
  };
  useEffect(() => {
    if (!isAuthenticated) return;
    const getShopList = async () => {
      await axios
        .get("/mylapay/transaction/shop/list")
        .then((res) => {
          if (res.data.data[0].id) {
            setOnlinseStoreId(res.data.data[0].id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getShopList();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!editItem) return;

    const getData = async () => {
      await axios
        // .get(`/mylapay/customer/payment_page?webpageUrl=${editItem}`)

        // let postval = {
        //   "pageType" : 2,
        //   "shopID" : editItem,
        // }

        // .post("/mylapay/shop/shop_details", postval, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // })
        // .then((res) => {

        // })
        // .catch((err) => {
        //   console.log(err);
        //   Swal.fire({
        //     icon: "error",
        //     title: "Oops...",
        //     text: "Something went wrong!",
        //   });
        // });

        .get(
          `mylapay/shop/shop_details?iShop=${editItem}&pageType=2&onlineStoreId=${onlineStoreId}`
        )
        .then(async (res) => {
          if (res.data.status === 1) {
            if (res.data.data.length === 0) return;

            let logoFile = await createFileFromUrl(
              `${REACT_APP_SHOPAPI_URL}/uploads${res.data.data[0].shop_logo}`,
              "logo"
            );
            const shopDetails = {
              shop_name: res.data.data[0].shop_name,
              shop_logo: logoFile,
              shop_url: res.data.data[0].url_name,
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
            };
            dispatch(setWebPageDetails(shopDetails));
            setWebPageId(res.data.data[0].iShop);

            
            if(res.data.data[0].productDetails != undefined)
            {
              const prodDetails = await Promise.all(
                res.data.data[0].productDetails.map(async (item) => {
                  let imageFile = await createFileFromUrl(
                    `${REACT_APP_SHOPAPI_URL}/uploads${item.productImage}`,
                    item.imageName
                  );
                  delete item.id;
                  return {
                    ...item,
                    productImage: imageFile,
                  };
                })
              );
              dispatch(setPaymentPageDetails(prodDetails));
            }
            
            if(localStorage.getItem("addpaymentpage")==1)
            {
              stepChange(1)
            }
          }
        })
        .catch((err) => console.log(err));
    };
    getData();
  }, [editItem, REACT_APP_API_URL, isAuthenticated, onlineStoreId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setWebPageDetails(null));
      dispatch(setPaymentPageDetails(null));
    };
  }, [dispatch]);

  const stepChange = (n) => {
    setActiveStep(n);
  };

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return <WebPageDetails webPageId={webPageId} stepChange={stepChange} />;
      case 1:
        return <WebPageLinks webPageId={webPageId} stepChange={stepChange} />;

      default:
        return <WebPageDetails webPageId={webPageId} stepChange={stepChange} />;
    }
  };

  const stepTitles = ["Configure Payment Page", "Add your Payment Pages"];

  return (
    // <Container className="full-height">
    //   <Box mb={3}>
    //     <Stepper
    //       style={{ background: "transparent" }}
    //       activeStep={activeStep}
    //       alternativeLabel
    //     >
    //       <Step>
    //         <StepLabel>Web Page Details</StepLabel>
    //       </Step>
    //       <Step>
    //         <StepLabel>Payment Pages</StepLabel>
    //       </Step>
    //     </Stepper>
    //   </Box>

    //   {stepContent()}

    //   <Box pb={5}></Box>
    // </Container>

    <Container className="full-height">
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
  );
}
