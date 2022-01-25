import { Box, IconButton, Typography } from "@material-ui/core";
import {
  AccountBalance,
  AccountBalanceWallet,
  AccountCircleOutlined,
  ArrowBack,
  Close,
  CreditCard,
  DoubleArrow,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ComingSoon from "./ComingSoon";
import UpiForm from "./UpiForm";

export default function PaymentPopup({ shopData, orderTotal, handleDialog }) {
  const formValues = useSelector((state) => state.shop.formValues);
  const [showPaymentList, setShowPaymentList] = useState(true);
  const [currentPaymentForm, setCurrentPaymentForm] = useState(null);

  const paymentOptions = [
    {
      value: "card",
      name: "Card",
      description: "Visa, MasterCard, RuPay, and Maestro",
      icon: (
        <CreditCard
          className="purple-text"
          style={{ fontSize: "28px", marginRight: "0.5em" }}
        />
      ),
    },
    {
      value: "upi",
      name: "UPI / QR",
      description: "Instant payment using UPI App",
      icon: (
        <DoubleArrow
          className="green-text"
          style={{ fontSize: "28px", marginRight: "0.5em" }}
        />
      ),
    },
    {
      value: "netbanking",
      name: "Netbanking",
      description: "All Indian banks",
      icon: (
        <AccountBalance
          className="red-text"
          style={{ fontSize: "28px", marginRight: "0.5em" }}
        />
      ),
    },
    {
      value: "wallets",
      name: "Wallets",
      description: "Mobikwik, Paytm & More",
      icon: (
        <AccountBalanceWallet
          className="blue-text"
          style={{ fontSize: "28px", marginRight: "0.5em" }}
        />
      ),
    },
  ];

  const handlePaymentForms = (option) => {
    switch (option) {
      case "upi":
        setShowPaymentList(false);
        setCurrentPaymentForm(<UpiForm />);
        break;

      default:
        setShowPaymentList(false);
        setCurrentPaymentForm(<ComingSoon />);
        break;
    }
  };

  return (
    <>
      {formValues && (
        <Box style={{ width: "400px" }}>
          <Box
            p={2}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              backgroundColor: "#0f123b",
              background: "linear-gradient(90deg,#0f123b,#1b2062 35%,#2b329a)",
              color: "#fff",
              position: "relative",
            }}
          >
            <Typography variant="body1">{shopData.shop_name}</Typography>
            <Typography variant="h4">₹{orderTotal}</Typography>
            <IconButton
              style={{
                position: "absolute",
                right: "0",
                top: "0",
                color: "#fff",
              }}
              aria-label="Close"
              onClick={() => {
                handleDialog(false);
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <Box
            p={2}
            style={{
              background: "var(--mp-light-bg)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <Edit style={{ fontSize: "16px", marginRight: "0.5em" }} /> */}
            <AccountCircleOutlined
              style={{ fontSize: "16px", marginRight: "0.5em" }}
            />
            <Typography variant="caption">{formValues.phone}</Typography>
            <Box style={{ margin: "0 1em", color: "var(--mp-light-blue)" }}>
              |
            </Box>
            <Typography variant="caption">{formValues.email}</Typography>
          </Box>
          {showPaymentList ? (
            <Box p={2}>
              <Typography variant="body2">Cards, UPI & More</Typography>
            </Box>
          ) : (
            <Box
              onClick={() => {
                setShowPaymentList(true);
                setCurrentPaymentForm(null);
              }}
              p={2}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ArrowBack fontSize="small" />
              <Typography variant="body2" style={{ marginLeft: "1em" }}>
                Back
              </Typography>
            </Box>
          )}

          {showPaymentList &&
            paymentOptions.map((item, index) => (
              <Box
                key={index}
                p={2}
                className="paymentList"
                style={{
                  display: "flex",
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => handlePaymentForms(item.value)}
              >
                {item.icon}
                <Box>
                  <Typography variant="subtitle2">{item.name}</Typography>
                  <Typography variant="caption">{item.description} </Typography>
                </Box>
              </Box>
            ))}

          {currentPaymentForm && currentPaymentForm}
        </Box>
      )}
    </>
  );
}
