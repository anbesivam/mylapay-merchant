import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  Link,
  Box,
  Divider,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { logOut, setUserDetails } from "../../redux/authSlice";
import { useHistory } from "react-router";
import axios from "axios";

export default function Approval({ params }) {
  const currentUser = useSelector((state) => state.auth.userData);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const isAuthenticated = Boolean(localStorage.getItem("userData"));
  const [routeCheckDone, setRouteCheckDone] = useState(false);
  const { REACT_APP_API_URL } = process.env;
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    history.push("/user/login");
  };

  useEffect(() => {
    if (!isAuthenticated) return history.push("/user/login");

    if (currentUser === null) return;
    if (userDetails === null) return;

    const getUserData = async () => {
      if (!isAuthenticated) return;
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_details`)
        .then((response) => {
          if (response.data.success === 1) {
            if (
              response.data.data[0].current_step === userDetails.current_step &&
              response.data.data[0].is_approved === userDetails.is_approved
            )
              return;
            localStorage.setItem(
              "userDetails",
              JSON.stringify(response.data.data[0])
            );
            dispatch(setUserDetails(response.data.data[0]));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dispatch, history, isAuthenticated]);

  useEffect(() => {
    if (userDetails === null) return;

    if (userDetails.user_docs.length > 0) return history.push("/rejected-docs");

    if (userDetails.is_approved === 1 && userDetails.Sub_Merchant_ID !== null)
      return history.push("/");

    if (userDetails.is_approved === 3) return history.push("/account-inactive");

    if (userDetails.current_step === null || userDetails.current_step < 3)
      return history.push("/user/kyc-form");

    setRouteCheckDone(true);
  }, [userDetails, history]);
  return (
    <>
      {userDetails && routeCheckDone && (
        <>
          <AppBar
            position="static"
            color="default"
            style={{ background: "#fff" }}
            elevation={0}
          >
            <Container>
              <Toolbar disableGutters>
                <Link to="/">
                  <img
                    className="site-logo"
                    src="/logo.svg"
                    alt="Mylapay Logo"
                    width="290px"
                    height="70px"
                  />
                </Link>
                <Box
                  ml="auto"
                  mr={2}
                  display={{ xs: "none", md: "flex" }}
                  alignItems="center"
                >
                  <Typography>
                    Welcome, {currentUser ? currentUser.email : ""}
                  </Typography>
                  <Button
                    style={{ marginLeft: "1em" }}
                    onClick={handleLogout}
                    variant="outlined"
                    color="primary"
                  >
                    Log Out
                  </Button>
                </Box>
              </Toolbar>
            </Container>
            <Divider />
          </AppBar>
          <Container
            style={{ display: "grid", placeItems: "center" }}
            className="full-height"
            component="main"
            maxWidth="sm"
          >
            <Card style={{ marginTop: "-5em" }} variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="center">
                  <img
                    style={{
                      margin: "0 auto",
                    }}
                    src="/images/processing.svg"
                    alt="Approval"
                    height="300px"
                    width="300px"
                  />
                </Box>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "normal", textAlign: "center" }}
                >
                  Your account activation is under process and will be activated
                  soon.
                </Typography>
                <br></br>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "normal", textAlign: "center" }}
                >
                  Please contact our customer support number 1800 572 9101 for
                  further details.
                </Typography>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Thank you!
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </>
      )}
    </>
  );
}
