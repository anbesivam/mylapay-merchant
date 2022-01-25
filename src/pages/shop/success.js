import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";
import { CheckCircle, Error } from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import ShopHeader from "../../components/shop/ShopHeader";

export default function OrderSuccess(props) {
  const shopData = useSelector((state) => state.shop.shopData);
  const statusData = props.location.state.r;
  const orderId = props.location.state.orderId;

  return (
    <>
      {shopData && <ShopHeader shopData={shopData} />}
      {shopData && (
        <Container
          style={{ display: "grid", placeItems: "center" }}
          className="full-height"
          component="main"
          maxWidth="sm"
        >
          <Card
            style={{ marginTop: "-5em", width: "600px", padding: "2em" }}
            variant="outlined"
          >
            {statusData.data === "SUCCESS" ? (
              <CardContent>
                <Box display="flex" justifyContent="center">
                  <CheckCircle
                    style={{ color: "#4caf50", fontSize: "200px" }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "normal", textAlign: "center" }}
                  gutterBottom
                >
                  Order placed Successfully
                </Typography>
                {orderId && (
                  <Typography
                    variant="h5"
                    style={{ fontWeight: "normal", textAlign: "center" }}
                  >
                    <strong>Order ID:</strong> <span>{orderId}</span>
                  </Typography>
                )}
              </CardContent>
            ) : (
              <CardContent>
                <Box display="flex" justifyContent="center">
                  <Error style={{ color: "#ff9800", fontSize: "200px" }} />
                </Box>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "normal", textAlign: "center" }}
                  gutterBottom
                >
                  Order Captured
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Your payment transanction failed, but your order data has been
                  capture.
                </Typography>
                {orderId && (
                  <Typography
                    variant="h5"
                    style={{ fontWeight: "normal", textAlign: "center" }}
                  >
                    <strong>Order ID:</strong> <span>{orderId}</span>
                  </Typography>
                )}
              </CardContent>
            )}
            {/* <pre>{JSON.stringify(statusData)}</pre>
            <pre>{JSON.stringify(orderId)}</pre> */}
          </Card>
        </Container>
      )}
    </>
  );
}
