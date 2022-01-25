import { Container, Grid, Typography, Box, Dialog } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import LinesEllipsis from "react-lines-ellipsis";
import PaymentForm from "../../components/shop/PaymentForm";

import PaymentPopup from "../../components/shop/PaymentPopup";

const { REACT_APP_SHOPAPI_URL } = process.env;

export default function ShopCart() {
  const { shop_url } = useParams();
  const [shopData, setShopData] = useState();
  const [paymentDialog, setPaymentDialog] = useState(false);

  const handleDialog = (value) => {
    setPaymentDialog(value);
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`mylapay/customer/shop/view?shop_url=${shop_url}`)
        .then((res) => {
          if (res.data.status === 1) {
            if (res.data.data.length === 0) return;
            setShopData(res.data.data);
          }
        })
        .catch((err) => console.log(err));
    };
    getData();
  }, [shop_url]);

  return (
    <>
      {shopData && (
        <Container style={{ paddingTop: "2em", paddingBottom: "2em" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box
                mb={2}
                p={2}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  background: "#fff",
                  borderRadius: "1em",
                  width: "auto",
                  paddingRight: "2em",
                }}
              >
                <img
                  style={{
                    boxShadow: "0 2px 8px 0 #c1c9d7, 0 -2px 8px 0 #cce1e9",
                    borderRadius: "1em",
                    marginRight: "2em",
                  }}
                  src={`${REACT_APP_SHOPAPI_URL}/uploads${shopData.shop_logo}`}
                  alt="Logo"
                  height="120px"
                  width="120px"
                />
                <Box>
                  <h1 style={{ margin: "0", marginBottom: ".4em" }}>
                    {shopData.shop_name}
                  </h1>
                  <Typography component="div" variant="body2">
                    <LinesEllipsis
                      text={shopData.description}
                      maxLine="3"
                      ellipsis="..."
                      trimRight
                    />
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                p={2}
                style={{
                  backgroundColor: "#0f123b",
                  background: "linear-gradient(45deg, #0288d1, #26c6da)",
                  color: "#fff",
                  borderRadius: "1em",
                  boxShadow: "10px 10px 0px 0 rgba(38, 198, 218, .5)",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <img
                    src="/logo-shop-page.svg"
                    alt="Mylapay Logo"
                    height="30px"
                    style={{ marginBottom: "1em" }}
                  />
                  <Typography variant="body2">
                    Powered by Mylapay Payment Pages. <br /> Want to create
                    payment pages of your own? <br /> Visit Mylapay Payment
                    Pages and get started!
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Products</Typography>
                </Grid>
                {shopData.products.map((product) => (
                  <Grid key={product.id} item xs={12}>
                    <Box
                      style={{
                        overflow: "hidden",
                        display: "flex",
                        width: "100%",
                        background: "#fff",
                        borderRadius: "1em",
                      }}
                    >
                      <img
                        src={`${REACT_APP_SHOPAPI_URL}/uploads${product.product_image}`}
                        alt={product.product_name}
                        height="150px"
                        width="150px"
                      />
                      <Box p={2}>
                        <Typography
                          style={{ color: "#9e9e9e" }}
                          variant="body2"
                          gutterBottom
                        >
                          {product.catogoryName}
                        </Typography>
                        <Typography
                          variant="h5"
                          style={{ fontWeight: "normal" }}
                        >
                          {product.product_name}
                        </Typography>
                      </Box>
                      <Box
                        width="150px"
                        p={2}
                        style={{
                          marginLeft: "auto",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography
                          style={{ color: "#9e9e9e" }}
                          variant="body2"
                          gutterBottom
                        >
                          Price
                        </Typography>
                        <Typography variant="h5">₹{product.price}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Payment Details</Typography>
                </Grid>
                <Grid item xs={12}>
                  <PaymentForm
                    products={shopData.products}
                    handleDialog={handleDialog}
                    inputData={shopData.page_info}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}

      <Dialog open={paymentDialog}>
        <PaymentPopup handleDialog={handleDialog} />
      </Dialog>
    </>
  );
}
