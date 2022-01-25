import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Container,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Close, Person, Search, ShoppingCart } from "@material-ui/icons";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "../../redux/shopSlice";
import { TextField } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { setProductsData, setShopData } from "../../redux/shopSlice";
import axios from "axios";
import OrderLogin from "./OrderLogin";
import FullScreenOrders from "./FullScreenOrders";
// import { Autocomplete } from "@material-ui/lab";

export default function ShopHeader({ showHeader }) {
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const cartData = useSelector((state) => state.shop.cartData);
  const productsData = useSelector((state) => state.shop.productsData);
  const shopData = useSelector((state) => state.shop.shopData);
  const { shop_url } = useParams();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  // const [searchNamesList, setSearchNamesList] = useState([]);
  const [profilePopup, setProfilePopup] = useState(false);
  const [fsoOpen, setFsoOpen] = useState(false);
  const [cusOrderData, setCusOrderData] = useState(null);

  useEffect(() => {
    // Get local Data if it exists
    const localData = localStorage.getItem("cartData")
      ? JSON.parse(localStorage.getItem("cartData"))
      : null;
    if (localData === null) return;
    // Check if current shop already exists
    const shopExists = localData.find((item) => item.shopUrl === shop_url);
    if (shopExists == null) return;
    if (shopExists.cartItems.length < 1) return;

    // If current shop exists and has cart items populate redux store
    dispatch(setCartData(shopExists.cartItems));
  }, [shop_url, dispatch]);

  useEffect(() => {
    if (cartData === null) return;
    const c = cartData.length;
    setCount(c);
  }, [cartData]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!productsData) return;
    let temp = shopData.products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.catogoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(setProductsData(temp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, dispatch]);

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

  // useEffect(() => {
  //   if (!shopData) return;
  //   console.log("i'm nrunning...");
  //   let r = shopData.products.map((p) => p.product_name);
  //   console.log(r);
  //   setSearchNamesList(r);
  // }, [shopData]);

  const toggleSearch = () => {
    document.querySelector(".header-search").classList.toggle("active");
  };

  const handleProfilePopup = (val) => {
    setProfilePopup(val);
  };

  return (
    <Box
      style={{
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        position: "sticky",
        top: "0",
        zIndex: 1,
      }}
    >
      <Container>
        <div className="header-container">
          <div>
            {shopData && (
              <Link
                to={`/shop/${shopData.url_name}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <img
                    style={{ marginRight: "1em" }}
                    src={`${REACT_APP_SHOPAPI_URL}/uploads${shopData.shop_logo}`}
                    alt="Logo"
                    height="60px"
                    width="auto"
                  />
                  <Typography className="brand-name" variant="h4">
                    {shopData.shop_name}
                  </Typography>
                </Box>
              </Link>
            )}
          </div>
          <div className="header-search">
            {showHeader && (
              <form onSubmit={(e) => handleSearch(e)}>
                <TextField
                  type="search"
                  variant="outlined"
                  label="Search"
                  fullWidth
                  margin="dense"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment className="only-mobile" position="end">
                        <IconButton
                          aria-label="close"
                          edge="end"
                          onClick={toggleSearch}
                        >
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <Autocomplete
                  options={["helo", "world", "foo", "bar"]}
                  inputValue={searchTerm}
                  onInputChange={(event, value, reason) => setSearchTerm(value)}
                  freeSolo
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="close"
                              edge="end"
                              onClick={toggleSearch}
                            >
                              <Close />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                /> */}
              </form>
            )}
          </div>
          <div className="header-icons">
            {showHeader && (
              <IconButton className="mobile-search" onClick={toggleSearch}>
                <Search />
              </IconButton>
            )}
            <IconButton onClick={() => handleProfilePopup(true)}>
              <Person />
            </IconButton>
            {shopData && (
              <IconButton
                aria-label="cart"
                component={Link}
                to={`/shop/${shopData.url_name}/cart`}
              >
                <Badge badgeContent={count} color="primary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            )}
          </div>
        </div>
      </Container>
      <OrderLogin
        profilePopup={profilePopup}
        handleProfilePopup={handleProfilePopup}
        setCusOrderData={setCusOrderData}
        setFsoOpen={setFsoOpen}
      />
      <FullScreenOrders
        fsoOpen={fsoOpen}
        setFsoOpen={setFsoOpen}
        cusOrderData={cusOrderData}
      />
    </Box>
  );
}
