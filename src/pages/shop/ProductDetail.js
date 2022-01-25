import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import QtyBox from "../../components/shop/QtyBox";
import setLocalCart from "../../components/shop/setLocalCart";
import ShopHeader from "../../components/shop/ShopHeader";
import { setCartData } from "../../redux/shopSlice";

export default function ShopProductDetail() {
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const { shop_url, product_id } = useParams();
  const [shopData, setShopData] = useState(null);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.shop.cartData);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  
  const handleQty = (value) => {
    setQty(value);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast(false);
  };
  const addToCart = () => {
    setLoading(true);
    let alreadyExists = cartData.find((item) => item.id === product.id);
    if (alreadyExists) {
      let payload = cartData.map((item) => {
        if (item.id === product.id)
          return { ...item, qty: alreadyExists.qty + qty };
        return item;
      });
      dispatch(setCartData(payload));
      setLocalCart(shop_url, payload);
    } else {
      let payload = product;
      payload.qty = qty;
      dispatch(setCartData([...cartData, payload]));
      setLocalCart(shop_url, [...cartData, payload]);
    }
    setToast(true);
    setLoading(false);
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

  useEffect(() => {
    if (shopData == null) return;
    if (shopData.products.length < 1) return;
    let p = shopData.products.find((item) => item.id === parseInt(product_id));
    setProduct(p);
  }, [shopData, product_id]);

  return (
    <>
      {shopData && product && (
        <>
          <ShopHeader shopData={shopData} />
          <Container style={{ paddingTop: "1em", paddingBottom: "1em" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <img
                  style={{ borderRadius: "0.5em" }}
                  src={`${REACT_APP_SHOPAPI_URL}/uploads${product.product_image}`}
                  alt={product.product_name}
                  width="100%"
                  height="auto"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  p={2}
                  style={{
                    background: "#fff",
                    borderRadius: "0.5em",
                    height: "100%",
                  }}
                >
                  <Typography
                    style={{ color: "#9e9e9e" }}
                    variant="body2"
                    gutterBottom
                  >
                    {product.catogoryName}
                  </Typography>
                  <Typography variant="h4">{product.product_name}</Typography>
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "2em",
                    }}
                  >
                    <Typography style={{ color: "#9e9e9e" }} variant="body1">
                      Price:
                    </Typography>
                    <Typography variant="h5">₹ {product.price}</Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      style={{ color: "#9e9e9e" }}
                      gutterBottom
                      variant="body1"
                    >
                      Quantity:
                    </Typography>
                    <QtyBox
                      qty={qty}
                      max={product.stock}
                      handleQty={handleQty}
                    />
                  </Box>

                  <Button
                    onClick={() => {
                      addToCart();
                    }}
                    style={{ marginTop: "2em" }}
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={
                      loading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <AddShoppingCart />
                      )
                    }
                    disabled={loading}
                  >
                    ADD TO CART
                  </Button>

                  <Box mt={4}>
                    <Typography
                      style={{ color: "#9e9e9e" }}
                      gutterBottom
                      variant="body1"
                    >
                      Details:
                    </Typography>

                    {product.attributes &&
                      product.attributes.map((attr, ai) => (
                        <Typography key={ai} variant="body1">
                          <strong>{attr.label} : </strong>
                          <span>{attr.value}</span>
                        </Typography>
                      ))}
                  </Box>

                  <Box mt={2}>
                    <Typography
                      style={{ color: "#9e9e9e" }}
                      gutterBottom
                      variant="body1"
                    >
                      Stock:
                    </Typography>
                    <Typography variant="body1">{product.stock}</Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography
                      style={{ color: "#9e9e9e" }}
                      gutterBottom
                      variant="body1"
                    >
                      Description:
                    </Typography>
                    <Typography variant="body1">
                      {product.prodDescription}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
      {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
      <Snackbar open={toast} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Added to cart!
        </Alert>
      </Snackbar>
    </>
  );
}
