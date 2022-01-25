import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import InvoiceTemplate from "../../components/invoice-pages/InvoiceTemplate";
import ReactToPrint from "react-to-print";
import { Print, PictureAsPdf } from "@material-ui/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import * as QueryString from "query-string";
import ReactToPdf from "react-to-pdf";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
// import { jsPDF } from "jspdf";
import { jsPDF } from "jspdf";

export default function GenerateInvoice(props) {
  const componentRef = useRef();
  const [pageData, setPageData] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [taxes, setTaxes] = useState(0);
  const [shipingMode, setShipingMode] = useState(null);
  const [showInvoice, setShowInvoice] = useState(props.showInvoice);
  const [merchantConvieniencePercent, setMerchantConvieniencePercent] =
    useState(0);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log(props);
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let iUser = userDetails.iUser;
  //console.log(iUser);
  // const params = QueryString.parse(props.location.search);
  // console.log(params.iOrder);
  //let iOrder = parseInt(params.iOrder);
  const ref = React.createRef();

  useEffect(() => {
    const getMerchantConveniencePercent = async () => {
      await axios
        .post("/mylapay/shop/convenience-percent", {
          iMerchant: iUser,
        })
        .then((response) => {
          if (response.data.success) {
            //console.log(response.data);

            let merchant_convenience_percent = response.data.data[0]
              .convenience_fee_percent
              ? response.data.data[0].convenience_fee_percent
              : 0;
            setMerchantConvieniencePercent(merchant_convenience_percent);
            // let step1 = ((orderTotal + deliveryCharges) * (merchant_convenience_percent/100));
            // console.log(step1);
            // let step2 = step1 * (2/100);
            // let step3 = ((step1 + step2) * (18/100));
            // let package_convenience_fee = step1 + step2 + step3;
            // setPackageConvenienceFee(package_convenience_fee);
          } else {
            toast.error("something went wrong");
          }
        })
        .catch((error) => {
          toast.error("something went wrong");
          console.log(error);
        });
    };
    getMerchantConveniencePercent();
  }, []);

  const jsPDFExport = () => {
    //console.log("jsPDF");
    const input = document.getElementById("pdfTest");
    const pdf = new jsPDF({ unit: "px", format: "letter", userUnit: "px" });

    pdf
      .html(input, { html2canvas: { scale: 0.555 }, margin: [10, 10, 10, 10] })
      .then(() => {
        pdf.save(`${props.pageData.orderId}`);
        // window.open(pdf.output("bloburl"), "_blank");
      });
  };

  // useEffect(() => {
  //   const getData = async () => {
  //     await axios
  //       .get(`/mylapay/orders/get/${iOrder}`)
  //       .then((response) => {

  //         if (response.data && response.data.message.length > 0) {
  //           //setPageData(response.data.message[0]);
  //           console.log(response.data.message);
  //           getCustomerAddress(response.data.message[0].email,response.data.message[0].phone,response.data.message[0].shopId,response.data.message[0]);
  //           //generateQrImage(response.data.data[0]);
  //         }
  //       })
  //       .catch((error) => {
  //         if (!isAuthenticated) return;
  //         toast(`❌ Something went wrong. Please try again.`);
  //         console.log(error);
  //       });
  //   };

  //   const getCustomerAddress = async (email,phone,shopId,pageDataTemp) => {
  //     await axios
  //       .post("/mylapay/customer/address",{
  //         email: email,
  //         phone: phone
  //       })
  //       .then((response) => {
  //         console.log(response);
  //         if (response.data.success) {
  //           let customerAddressTemp = `${response.data.data[0].Building_No},${response.data.data[0].Street_Name},${response.data.data[0].Landmark}`;
  //           // setCustomerAddress(customerAddress);
  //           let customerAddress = {
  //             address: customerAddressTemp,
  //             city: `${response.data.data[0].City} -${response.data.data[0].Pincode}`
  //           }
  //           console.log(customerAddress);
  //           getDeliveryCharges(shopId,customerAddress,pageDataTemp);
  //         } else {
  //           toast(`❌  Error while fetching Customer Address.`);
  //         }
  //       })
  //       .catch((error) => {
  //         toast("❌ Something went wrong, Please try again");
  //       });
  //   };

  //   const getDeliveryCharges = async (shopId,customerAddress,pageDataTemp) => {
  //     await axios
  //       .post("/mylapay/orders/delivery-charges",{
  //         iShop: shopId,
  //         iOrder: iOrder
  //       })
  //       .then((response) => {
  //         console.log(response);
  //         if (response.data.success) {
  //           let deliveryCharges = response.data.data;
  //           setDeliveryCharges(deliveryCharges);
  //           setCustomerAddress(customerAddress);
  //           setShipingMode(response.data.shipingMode);
  //           setPageData(pageDataTemp);
  //           setTaxes(0); // Need to change in future product GST Based
  //           console.log(deliveryCharges);

  //         } else {
  //           toast(`❌  Error while fetching Delivery Charges.`);
  //         }
  //       })
  //       .catch((error) => {
  //         toast("❌ Something went wrong, Please try again");
  //       });
  //   };

  //   getData();

  // }, [isAuthenticated]);

  const options = {
    orientation: "portrait",
  };

  return (
    <Container>
      {!props.pageData ? (
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
          {/*<ReactToPdf
            targetRef={componentRef}
            filename={`Invoice_${iOrder}.pdf`}
            scale={0.635} x={0.5} y={0.5}
          >
            {({ toPdf }) => (
              <Box
                style={{ display: "flex", justifyContent: "flex-end" }}
                mb={2}
              >
                <Button
                  onClick={toPdf}
                  variant="contained"
                  color="primary"
                  startIcon={<PictureAsPdf />}
                >
                  Export to PDF
                </Button>
              </Box>
            )}
          </ReactToPdf> */}
          {merchantConvieniencePercent ? (
            <Dialog
              open={props.showInvoice}
              onClose={!props.showInvoice}
              maxWidth="800px"
              scroll="paper"
            >
              <DialogTitle>
                <span>Order Invoice</span>
                <span style={{ float: "right" }}>
                  <Button
                    style={{ marginRight: "10px" }}
                    onClick={jsPDFExport}
                    variant="contained"
                    color="primary"
                    startIcon={<PictureAsPdf />}
                  >
                    Export to PDF
                  </Button>
                  {/* <ReactToPdf
                      targetRef={ref}
                      filename={`Invoice_${"iOrder"}.pdf`}
                      options={options} scale={1} x={0.5} y={0.5}
                    >
                      {({ toPdf }) => (
                        <Box
                          style={{ display: "inline-block",marginRight: "50px" }}
                          mb={2}
                        >
                          <Button
                            onClick={toPdf}
                            variant="contained"
                            color="primary"
                            startIcon={<PictureAsPdf />}
                          >
                            Export to PDF
                          </Button>
                        </Box>
                      )}
                    </ReactToPdf> */}

                  <Box style={{ display: "inline-block" }}>
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<Print />}
                        >
                          Click to Print Invoice
                        </Button>
                      )}
                      content={() => componentRef.current}
                      pageStyle={`
                          @page {
                            size: 210mm 297mm;
                            margin: 10;
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
                </span>
              </DialogTitle>
              <DialogContent dividers>
                <DialogContentText>
                  <div id="pdfTest">
                    <InvoiceTemplate
                      ref={componentRef}
                      pageData={props.pageData}
                      customerAddress={props.customerAddress}
                      shopAddress={props.shopAddress}
                      deliveryCharges={props.deliveryCharges}
                      shipingMode={props.shipingMode}
                      taxes={props.taxes}
                      merchantConvieniencePercent={merchantConvieniencePercent}
                      refCustom={ref}
                    />
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => props.invoiceOpen(false)}
                  color="primary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          ) : null}
        </>
      )}
    </Container>
  );
}

// @page {
//   size: 210mm 297mm;
//   margin: 20;
// }
