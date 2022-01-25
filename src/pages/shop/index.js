import { Typography } from "@material-ui/core";
import { Container, Grid } from "@material-ui/core";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import ProductCard from "../../components/shop/ProductCard";
import ShopHeader from "../../components/shop/ShopHeader";
import { setProductsData, setShopData } from "../../redux/shopSlice";

export default function Shop() {
  const { shop_url } = useParams();
  // const [shopData, setShopData] = useState();
  const productsData = useSelector((state) => state.shop.productsData);
  const shopData = useSelector((state) => state.shop.shopData);
  const dispatch = useDispatch();
  const { REACT_APP_API_URL } = process.env;
  
  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`mylapay/customer/shop/view?shop_url=${shop_url}`)
        .then((res) => {
          if (res.data.status === 1) {
            if (res.data.data.length === 0) return;
            dispatch(setShopData(res.data.data));
            dispatch(setProductsData(res.data.data.products));
          }
        })
        .catch((err) => console.log(err));
    };
    getData();
  }, [shop_url, dispatch]);

  return (
    <>
      {shopData && (
        <>
          <ShopHeader showHeader={true} />
          <Container style={{ paddingTop: "1em", paddingBottom: "1em" }}>
            <Grid container spacing={2}>
              {productsData &&
                productsData.length > 0 &&
                productsData.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                      product={product}
                      shoplink={shopData.url_name}
                    />
                  </Grid>
                ))}

              {productsData && productsData.length < 1 && (
                <Typography variant="body1">
                  No products available in this store yet...
                </Typography>
              )}
            </Grid>
          </Container>
        </>
      )}
    </>
  );
}
