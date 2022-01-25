import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import RejectedIndividual from "../../components/user/RejectedDocs/Individual";
import RejectedPartnership from "../../components/user/RejectedDocs/Partnership";
import RejectedPublicPvt from "../../components/user/RejectedDocs/PublicPvt";
import RejectedTrustSociety from "../../components/user/RejectedDocs/TrustSociety";
import { logOut } from "../../redux/authSlice";

export default function RejectedDocs() {
  const currentUser = useSelector((state) => state.auth.userData);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [routeCheckDone, setRouteCheckDone] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [curBusType, setCurBusType] = useState(null);
  const { REACT_APP_API_URL } = process.env;
  
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    history.push("/user/login");
  };

  // Checking Routes
  useEffect(() => {
    if (userDetails === null) return;

    switch (userDetails.is_approved) {
      case 0:
        history.push("/user/kyc-form");
        break;
      case 1:
        history.push("/");
        break;
      case 2:
        history.push("/rejected-docs");
        break;

      default:
        break;
    }

    setRouteCheckDone(true);
  }, [userDetails, history]);

  //   Getting Rejected Docs data
  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_details`)
        .then((response) => {
          if (response.data.success === 1) {
            if (!isMounted) return;
            if (response.data.data[0].user_docs.length > 0)
              setCurBusType(response.data.data[0].businessType);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
    return () => {
      isMounted = false;
    };
  }, [userDetails]);

  const getRejectedContent = (curBusType) => {
    switch (curBusType) {
      case "Individuals - HUF":
        return <RejectedIndividual />;

      case "Individuals / Professionals":
        return <RejectedIndividual />;

      case "Proprietoryship":
        return <RejectedIndividual />;

      case "Partnership":
        return <RejectedPartnership />;

      case "LLPs":
        return <RejectedPartnership />;

      case "Public Ltd Companies":
        return <RejectedPublicPvt />;

      case "Private Ltd Companies":
        return <RejectedPublicPvt />;

      case "Trust or Society":
        return <RejectedTrustSociety />;

      default:
        return <RejectedIndividual />;
    }
  };

  return (
    <>
      {userDetails && routeCheckDone && (
        <>
          <AppBar
            position="sticky"
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
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Typography>
                    Welcome, {currentUser ? currentUser.email : ""}
                  </Typography>
                  <Button
                    style={{ marginLeft: "1em" }}
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </Toolbar>
            </Container>
            <Divider />
          </AppBar>

          <Container>
            <Alert
              style={{
                backgroundColor: "#0f123b",
                background: "linear-gradient(45deg, #0288d1, #26c6da)",
                color: "#fff",
                marginTop: "1em",
              }}
              severity="info"
              variant="filled"
            >
              <AlertTitle>Documents Rejected !</AlertTitle>
              We found some errors in the documents uploaded! Please review the
              comment in (information symbol) below and submit the revised
              document or provide clarification. Thanks!
            </Alert>
          </Container>

          {curBusType && getRejectedContent(curBusType)}
        </>
      )}
    </>
  );
}
