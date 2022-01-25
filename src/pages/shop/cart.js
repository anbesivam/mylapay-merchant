import {
  Container,
  Grid,
  Typography,
  Box,
  Dialog,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import PaymentForm from "../../components/shop/PaymentForm";
import PaymentPopup from "../../components/shop/PaymentPopup";
import ShopHeader from "../../components/shop/ShopHeader";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import QtyBoxCart from "../../components/shop/QtyBoxCart";
import { setCartData, setOrderTotal, setShopData } from "../../redux/shopSlice";
import { Close } from "@material-ui/icons";
import setLocalCart from "../../components/shop/setLocalCart";

const { REACT_APP_SHOPAPI_URL } = process.env;

export default function ShopCart() {
  const { shop_url } = useParams();
  const dispatch = useDispatch();
  const [paymentDialog, setPaymentDialog] = useState(false);
  const cartData = useSelector((state) => state.shop.cartData);
  const orderTotal = useSelector((state) => state.shop.orderTotal);
  const shopData = useSelector((state) => state.shop.shopData);

  const handleQty = (value, product) => {
    let payload = cartData.map((item) => {
      if (item.id === product.id) return { ...item, qty: value };
      return item;
    });
    dispatch(setCartData(payload));
    setLocalCart(shop_url, payload);
  };

  const deleteProduct = (product) => {
    let payload = cartData.filter((item) => item.id !== product.id);
    dispatch(setCartData(payload));
    setLocalCart(shop_url, payload);
  };

  useEffect(() => {
    if (cartData === null) return;
    let res = cartData.reduce(
      (prev, cur) => prev + parseInt(cur.price) * cur.qty,
      0
    );
    dispatch(setOrderTotal(res));
  }, [cartData, dispatch]);

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
            dispatch(setShopData(res.data.data));
          }
        })
        .catch((err) => console.log(err));
    };
    getData();
  }, [shop_url, dispatch]);

  return (
    <>
      {shopData && <ShopHeader shopData={shopData} />}
      {shopData && cartData && cartData.length > 0 && (
        <Container style={{ paddingTop: "1em", paddingBottom: "2em" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box style={{ overflow: "auto", width: "100%" }}>
                <table
                  style={{
                    width: "100%",
                    background: "#fff",
                    borderRadius: "0.5em",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr>
                      <th align="left">Products</th>
                      <th align="right">Price</th>
                      <th>Quantity</th>
                      <th align="right">Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartData.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <Box className="cart-product-img-name">
                            <img
                              src={`${REACT_APP_SHOPAPI_URL}/uploads${product.product_image}`}
                              alt={product.product_name}
                              height="100px"
                              width="100px"
                              style={{ objectFit: "cover", marginRight: "1em" }}
                            />
                            <Typography variant="body1">
                              {product.product_name}
                            </Typography>
                          </Box>
                        </td>
                        <td align="right">
                          <Box style={{ padding: "0.5em 1em" }}>
                            ₹{product.price}
                          </Box>
                        </td>
                        <td align="center">
                          <QtyBoxCart
                            qty={product.qty}
                            max={product.stock}
                            handleQty={handleQty}
                            product={product}
                          />
                        </td>
                        <td align="right">
                          <Box style={{ padding: "0.5em 1em" }}>
                            ₹{product.price * product.qty}
                          </Box>
                        </td>
                        <td>
                          <Tooltip placement="left" title="Delete">
                            <IconButton
                              aria-label="delete"
                              onClick={() => {
                                deleteProduct(product);
                              }}
                            >
                              <Close />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>{" "}
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "#fff",
                      borderRadius: "0.5em",
                    }}
                  >
                    <Typography variant="h6">Order Total: </Typography>
                    <Typography variant="h6" style={{ fontWeight: "normal" }}>
                      ₹{orderTotal}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <PaymentForm
                    orderTotal={orderTotal}
                    handleDialog={handleDialog}
                    inputData={shopData.page_info}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}

      {shopData && cartData && cartData.length < 1 && (
        <Container>
          <Box
            style={{
              minHeight: "calc(100vh - 120px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5">Cart is empty</Typography>
            <Button
              component={Link}
              to={`/shop/${shopData.url_name}`}
              variant="contained"
              color="primary"
              style={{ marginTop: "1em" }}
            >
              Start Shopping
            </Button>
          </Box>
        </Container>
      )}

      {/* <pre>{JSON.stringify(shopData, null, 2)}</pre> */}

      <Dialog open={paymentDialog}>
        <PaymentPopup
          shopData={shopData}
          orderTotal={orderTotal}
          handleDialog={handleDialog}
        />
      </Dialog>
    </>
  );
}
