import { Box, Button, CircularProgress, Container } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import PrintQrTemplate from "../../components/payment-pages/PrintQrTemplate";
import PrintQrShopTemplate from "../../components/payment-pages/PrintQrShopTemplate";
import ReactToPrint from "react-to-print";
import { Print } from "@material-ui/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import queryString from "query-string";
import { useLocation } from "react-router";

export default function GenerateQr() {
  const componentRef = useRef();
  const [pageData, setPageData] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { search } = useLocation();
  const { Qr, id } = queryString.parse(search);

  useEffect(() => {
    getData();
  }, [isAuthenticated]);

  const generateShopImage = async () => {
    await axios
      .post("/mylapay/qrcode/shop_qr", {
        iShop: id,
      })
      .then((response) => {
        if (response.data.success) {
          setQrImageUrl(response.data.data);
        } else {
          toast(`❌  Error while generating QR code.`);
        }
      })
      .catch((error) => {
        toast("❌ Something went wrong, Please try again");
      });
  };
  const getData = async () => {
    await axios
      .get("/mylapay/shop/get/qr_details")
      .then((response) => {
        if (response.data.success && response.data.data.length > 0) {
          setPageData(response.data.data[0]);
          Qr === "shopQr"
            ? generateShopImage()
            : generateQrImage(response.data.data[0], Qr);
        }
      })
      .catch((error) => {
        if (!isAuthenticated) return;
        toast(`❌ Something went wrong. Please try again.`);
        console.log(error);
      });
  };
  const generateQrImage = async (payload) => {
    await axios
      .post("/mylapay/qrcode/generate", {
        payee_VPA: payload.merVirtualAdd,
        payee_name: payload.payee_name,
        payee_mcc_code: payload.iMCC,
      })
      .then((response) => {
        if (response.data.success) {
          setQrImageUrl(response.data.data);
        } else {
          toast(`❌  Error while generating QR code.`);
        }
      })
      .catch((error) => {
        toast("❌ Something went wrong, Please try again");
      });
  };

  return (
    <Container>
      {!pageData ? (
        <Box
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            style={{ width: "450px", margin: "1em auto", textAlign: "right" }}
          >
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" color="primary" endIcon={<Print />}>
                  Click to Print QR
                </Button>
              )}
              content={() => componentRef.current}
              pageStyle={`
          @page {
            size: 105mm 148mm;
            margin: 0;
          }
        
          @media all {
            .pagebreak {
              display: none;
            }
          }
        
          @media print {
            .pagebreak {
              page-break-before: always;
            }
          }
        `}
            />
          </Box>

          {Qr === "shopQr"?
            <PrintQrShopTemplate
              ref={componentRef}
              pageData={pageData}
              qrImageUrl={qrImageUrl}
            />
          :
            <PrintQrTemplate
              ref={componentRef}
              pageData={pageData}
              qrImageUrl={qrImageUrl}
            />
          }
          
          


        </>
      )}
    </Container>
  );
}
