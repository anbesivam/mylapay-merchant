import { Container } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { CardContent } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { AppBar } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../../redux/authSlice";

export default function PostBoarding() {
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.clear();
    dispatch(logOut());
  }, [dispatch]);

  return (
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
                src="/images/approval.svg"
                alt="Approval"
                height="300px"
                width="300px"
              />
            </Box>
            <Typography
              variant="h5"
              style={{ fontWeight: "normal", textAlign: "center" }}
            >
              Currently your shop is deactivated. Please contact our customer
              support number 1800 572 9101 for further details.
            </Typography>
            <br></br>
            {/* <Typography
              variant="h5"
              style={{ fontWeight: "normal", textAlign: "center" }}
            >
              Track your account activation status
            </Typography> */}
            {/* <Typography
              variant="h5"
              style={{ fontWeight: "bold", textAlign: "center" }}
            >
              Log in to your Account
            </Typography> */}
            <Box display="flex" justifyContent="center" mt={7}>
              <Button
                component={Link}
                to="/user/login"
                size="large"
                variant="outlined"
                color="primary"
              >
                Close
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
