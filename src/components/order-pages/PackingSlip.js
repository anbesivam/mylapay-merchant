import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
} from "@material-ui/core";
import React, { useState, useRef, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { jsPDF } from "jspdf";
import ReactToPrint from "react-to-print";
import { Print, PictureAsPdf } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
export default function PackingSlip({
  packingSlipDialog,
  setPackingSlipDialog,
  packingSlipData,
  orderTotal,
  orderData,
}) {
  const componentRef = useRef();
  const [itemTotal, setItemTotal] = useState(0);
  const jsPDFExport = () => {
    //console.log("jsPDF");
    const input = document.getElementById("pdfTest");
    const pdf = new jsPDF({ unit: "px", format: "letter", userUnit: "px" });

    pdf
      .html(input, { html2canvas: { scale: 0.555 }, margin: [10, 10, 10, 10] })
      .then(() => {
        pdf.save(`${packingSlipData.wbn}`);
        // window.open(pdf.output("bloburl"), "_blank");
      });
  };
  const handleDialog = () => {
    setPackingSlipDialog(false);
  };
  // console.log(orderData);
  useEffect(() => {
    let total_temp = 0.0;
    orderData.map((item) => {
      total_temp = Number(total_temp) + Number(item.price * item.quantity);
    });
    setItemTotal(total_temp);
  }, [orderData]);
  return (
    <>
      <Dialog
        style={{ width: "100%", margin: "auto" }}
        fullWidth
        maxWidth="md"
        open={packingSlipDialog}
        onClose={handleDialog}
      >
        <DialogTitle id="id">
          <span>Packing Slip</span>
          <span style={{ float: "right" }}>
            {/* <Button
              style={{ marginRight: "10px" }}
              onClick={jsPDFExport}
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
            >
              Export to PDF
            </Button> */}

            <Box style={{ display: "inline-block", marginRight: "20px" }}>
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
            <IconButton
              onClick={() => {
                handleDialog(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </span>
        </DialogTitle>

        <DialogContent>
          <div id="pdfTest" ref={componentRef}>
            <Grid container>
              <Grid item xs={3}></Grid>

              <Grid item xs={6}>
                <Grid style={{ display: "flex" }}>
                  <Grid
                    item
                    xs={6}
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      <img
                        className="invoice_logo"
                        src={packingSlipData.delhivery_logo}
                        alt="Mylapay Logo"
                      />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      fontSize: "2em",
                      fontWeight: "bold",
                    }}
                  >
                    <div style={{ marginTop: "5px" }}>
                      <span>
                        <strong>Delhivery</strong>
                      </span>
                    </div>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{
                    textAlign: "center",
                    border: "1px solid black",
                  }}
                >
                  <div>
                    <img
                      style={{
                        marginTop: "5px",
                        width: "250px",
                        height: "80px",
                      }}
                      className="barcode_img"
                      src={
                        "data:image/png;base64,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"
                      }
                      alt="Mylapay Logo"
                      width="100"
                      height="40"
                    />
                  </div>
                  <Grid container style={{ fontSize: "12px" }}>
                    <Grid
                      item
                      xs={6}
                      style={{ display: "flex", justifyContent: "start" }}
                    >
                      <strong>{packingSlipData.pin}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      style={{ display: "flex", justifyContent: "end" }}
                    >
                      <strong>{packingSlipData.sort_code}</strong>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", fontSize: "12px" }}
                >
                  <Grid item xs={8} style={{ borderLeft: "1px solid black" }}>
                    <div>
                      <>
                        <span>
                          <strong>Shipping Address:</strong>
                        </span>
                        <br />
                        <span>
                          <strong>{packingSlipData.name.toUpperCase()}</strong>
                        </span>
                        <br />
                        <span>{packingSlipData.address}</span>
                        <br />
                        <span>{packingSlipData.destination_city}</span>
                        <br />
                        <span>
                          {packingSlipData.st}-{packingSlipData.pin}
                        </span>
                        <br />
                      </>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{
                      borderLeft: "1px solid black",
                      borderRight: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <>
                        <p style={{ fontWeight: "bold" }}>
                          {packingSlipData.pt}
                        </p>
                        <p style={{ fontWeight: "bold" }}>{orderTotal}</p>
                        <p style={{ fontWeight: "bold" }}>{"Express"}</p>
                      </>
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    fontSize: "12px",
                    border: "1px solid black",
                  }}
                >
                  <Grid item xs={8}>
                    <div>
                      <>
                        <span>
                          <strong>
                            Seller: {packingSlipData.snm.toUpperCase()}
                          </strong>
                        </span>
                        <br />
                        <span>Address: {packingSlipData.sadd}</span>
                        <br />
                        <span>
                          {packingSlipData.origin_city}-{packingSlipData.rpin}
                        </span>
                      </>
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", borderBottom: "1px solid black" }}
                >
                  <Grid
                    item
                    xs={8}
                    style={{
                      borderLeft: "1px solid black",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    <div>
                      <>
                        <p>Product</p>
                      </>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{
                      borderLeft: "1px solid black",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    <div>
                      <>
                        <p style={{}}>Price </p>
                      </>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{
                      borderLeft: "1px solid black",
                      borderRight: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <>
                        <p style={{ fontWeight: "bold" }}>Total </p>
                      </>
                    </div>
                  </Grid>
                </Grid>

                {orderData.map((item) => {
                  return (
                    <>
                      <Grid item xs={12} style={{ display: "flex" }}>
                        <Grid
                          item
                          xs={8}
                          style={{
                            borderLeft: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          <div>
                            <>
                              <span>{item.item}</span>
                            </>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            borderLeft: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          <div>
                            <>
                              <span>{item.price} </span>
                            </>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          <div>
                            <>
                              <span>{item.itemTotal_amount} </span>
                            </>
                          </div>
                        </Grid>
                      </Grid>
                    </>
                  );
                })}
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", border: "1px solid black" }}
                >
                  <Grid
                    item
                    xs={10}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    <div>
                      <>
                        <p>Total</p>
                      </>
                    </div>
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    style={{
                      borderLeft: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <>
                        <p style={{ fontWeight: "bold" }}>
                          {itemTotal.toFixed(2)}
                        </p>
                      </>
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    textAlign: "center",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <div style={{ height: "95px" }}>
                    <img
                      style={{
                        marginTop: "5px",
                        width: "250px",
                        height: "80px",
                      }}
                      className="barcode_img"
                      src={
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAAA7CAIAAADq9M9PAAAERklEQVR4nO2dP0h6bRTHH39JOghS9M8bBAUZLdFaRn8GCWspiAgqKtoiiJCmqCEoKkgIarCWwiGoSaIIidIhWi5GgX/ApDLSISo0tTDk+Q2+yH197u0tCew9nM90Pfec73OuH0InIzQr9Hq9Xq9PXaQrGQ3CzoyX6QbhXb0AYYPouaIJbEPG3YxYqcXYI0QXYG99sgO7s1Sg6FtEs0JGKSXfRyaTEUIopTLZPwnpi3RDup6qCF+mB4V309cZDRmxwqiMBLZBGChcTDjLLsYeIRxn00QfWerxpc4V5rNvUXaa/mQxg/xfQLuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQQbuQkWc3ZrPZpC6+VRfeFe2UGv96g+jmn5z++RFfOe5bD/XdB/wWWf62+o/g8Xi2traCwaDFYkkXA4GAyWSSyWS9vb0NDQ2poslkqq2tNRgMolNOp3NjY0OlUhFCJicny8vL2Ryfz7e6uqpQKDiOMxqNqcG1tbXr6+vi4uLp6WnR5PPzc6vVGovFDAZDR0eHaIXNEd0nN2T3g/s/QigUSiaTRqMxXQmHw0NDQ5FIRNh2eno6Pz9vNpulpmw229HRkXCEzdnZ2Xl8fKSUbm5u8jxPKfX7/UtLS5TS7e3ts7Mz0eS3t7fUxfj4uFSFzWH3yRW5/NwtKyv78+dfC+zu7g4PD9tsNr/fn6pEIpHj4+Oenp5Ppgghdrt9bm7u8PBQKqevr6+oqIgQEo/HU39VPM+3tbURQlpbW3meF01WKpWJROLk5ESpVEpV2Bx2n1zxu75V3dzc2O12jUazsrKSEjMzM9PZ2enz+YLBYDgcFp2qq6szGAwTExMul+vg4EA0J4XFYlGpVDU1NYSQRCIhl8sJIfn5+clkUmqlWCx2cXERjUbf399FK2wOu0+u+F12Kyoq+vv7GxsbR0ZGnE4nIUSn03m93qurq9vb2+fnZ9Gp0tLS5uZmtVo9ODjocrlEcz4+PmZnZzmO6+7ufnp6IoRotVqPx0MI8Xq9VVVVUisVFBQYjUadTud2u0UrbA67T67I5bcqh8Oxv7/vcDhaWlqampq6urqi0ejU1JRWq728vDSZTIWFhYQQv9+/sLBwf3+/vLxcX1/PTlmtVp7n1Wr11dXV4uIix3FszsDAwOvra3V1dSAQGB0dbW9vp5SOjY1VVla63W6z2axQKNjkvb09j8cjl8vv7u7W19flcjlbYXPYfXL1DufSriiU0oeHB41Gk5eX9/WpeDz+8vLCcZzw//n8Zw6lNBQKiX6Qp4lGo/F4vKSk5JMKm8PukxN+nV3kB/kLJYmbe4H5pt8AAAAASUVORK5CYII="
                      }
                      alt="Mylapay Logo"
                      width="100"
                      height="40"
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    border: "1px solid black",
                    fontSize: "12px",
                  }}
                >
                  <Grid
                    style={{
                      display: "flex",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <>
                        <span>
                          <strong>Return Address:</strong>
                        </span>
                        <br />
                        <span>
                          <strong>{packingSlipData.snm.toUpperCase()}</strong>
                        </span>
                        <br />
                        <span>{packingSlipData.sadd}</span>
                        <br />
                        <span>{packingSlipData.origin_city}</span>
                        <br />
                        <span>
                          {packingSlipData.rst}-{packingSlipData.rpin}
                        </span>
                      </>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={3}></Grid>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
