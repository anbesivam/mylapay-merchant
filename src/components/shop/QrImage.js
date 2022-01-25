import { Box, CircularProgress, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import short from "short-uuid";

export default function QrImage() {
  const [loading, setLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const shopData = useSelector((state) => state.shop.shopData);
  const orderTotal = useSelector((state) => state.shop.orderTotal);

  useEffect(() => {
    const handleQrGenerate = async () => {
      setLoading(true);
      await axios
        .post("/mylapay/qrcode/generate", {
          payee_VPA: shopData.payee_VPA,
          payee_name: shopData.payee_name,
          payee_mcc_code: shopData.catogory,
          MerchantTxnID: short.generate(),
          TxnAmountDecimalFormat: parseFloat(orderTotal.toFixed(2)),
          TxnMinimumAmountDecimalFormat: parseFloat(orderTotal.toFixed(2)),
          currency_code: "INR",
          TxnNote: "Test transaction Note",
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            setLoading(false);
            setQrImageUrl(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      setLoading(false);
    };
    handleQrGenerate();
  }, [orderTotal, shopData.catogory, shopData.payee_VPA, shopData.payee_name]);

  return (
    <>
      {loading ? (
        <Box p={2} style={{ textAlign: "center" }}>
          <Typography variant="body2">Generating QR Code...</Typography>
          <Box
            style={{
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      ) : (
        <Box p={2} style={{ textAlign: "center" }}>
          <Typography variant="body2">
            Scan the QR Code with your UPI app.
          </Typography>
          {qrImageUrl && <img src={qrImageUrl} alt="QR Code" />}
        </Box>
      )}
    </>
  );
}
