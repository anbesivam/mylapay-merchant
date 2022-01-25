import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Container,
  Button,
  AppBar,
  Dialog,
  Toolbar,
  Link,
  Box,
  Divider,
  Snackbar,
} from "@material-ui/core";
import ContactInfo from "../../components/user/ContactInfo";
import BusinessInfo from "../../components/user/BusinessInfo";
import BankDetails from "../../components/user/BankDetails";
import { useDispatch, useSelector } from "react-redux";
import { setActiveStep } from "../../redux/kycSlice";
import axios from "axios";
import { setUserDetails } from "../../redux/authSlice";
import { useHistory } from "react-router";
import NewBusinessInfo from "../../components/user/NewBusinessInfo";
import { logOut } from "../../redux/authSlice";
import { Alert } from "@material-ui/lab";

export default function KycForm() {
  const activeStep = useSelector((state) => state.kyc.activeStep);
  const currentUser = useSelector((state) => state.auth.userData);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const isAuthenticated = Boolean(localStorage.getItem("userData"));
  const dispatch = useDispatch();
  const history = useHistory();
  const [prefillData, setPrefillData] = useState(null);
  const [contactDialog, setContactDialog] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("This is a message!");
  const [toastSeverity, setToastSeverity] = useState("info");
  const { REACT_APP_API_URL } = process.env;
  
  const toastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <NewBusinessInfo
            handleDialog={handleDialog}
            prefillData={prefillData}
          />
        );
      case 1:
        return <BusinessInfo prefillData={prefillData} />;
      case 2:
        return <BankDetails prefillData={prefillData} />;

      default:
        return (
          <ContactInfo
            toastOpen={toastOpen}
            toastClose={toastClose}
            toastSeverity={toastSeverity}
            toastMsg={toastMsg}
            prefillData={prefillData}
          />
        );
    }
  };

  useEffect(() => {
    if (currentUser === null) return;
    if (userDetails === null) return;

    const getUserData = async () => {
      if (!isAuthenticated) return;
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_details`)
        .then((response) => {
          if (response.data.success === 1) {
            if (
              response.data.data[0].imid === 0 ||
              response.data.data[0].imid === null
            ) {
              handleDialog(true);
            }
            if (
              response.data.data[0].current_step === userDetails.current_step &&
              response.data.data[0].is_approved === userDetails.is_approved
            )
              return;
            setPrefillData(response.data.data[0]);
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
  }, [currentUser, dispatch, history, isAuthenticated, userDetails]);

  useEffect(() => {
    if (userDetails === null) return history.push("/");
    if (userDetails.current_step === null) return;
    if (userDetails.current_step < 3)
      return dispatch(setActiveStep(userDetails.current_step));

    if (userDetails.is_approved === 1) {
      history.push("/");
    } else {
      history.push("/approval");
    }
  }, [userDetails, dispatch, history]);

  const handleDialog = (value) => {
    setContactDialog(value);
  };
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    history.push("/user/login");
  };

  return (
    <>
      {userDetails && (
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
                  style={{ display: "flex", alignItems: "center" }}
                  ml="auto"
                  mr={2}
                >
                  <Box display={{ xs: "none", md: "block" }}>
                    <Typography>
                      Welcome, {currentUser ? currentUser.email : ""}
                    </Typography>
                  </Box>
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
          <Container className="full-height">
            <Typography className="kyc-title" variant="body1">
              Fill KYC form to complete your account creation in simple 3 steps
            </Typography>
            <Box mb={3}>
              <Stepper
                style={{ background: "transparent" }}
                activeStep={activeStep}
                alternativeLabel
              >
                <Step>
                  <StepLabel>Business Information</StepLabel>
                </Step>
                <Step>
                  <StepLabel>KYC/Document collection</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Bank Account Details</StepLabel>
                </Step>
              </Stepper>
            </Box>

            {userDetails === null ? "" : stepContent()}

            <Dialog open={contactDialog}>
              <ContactInfo
                setToastOpen={setToastOpen}
                setToastMsg={setToastMsg}
                setToastSeverity={setToastSeverity}
                handleDialog={handleDialog}
              />
            </Dialog>

            <Box pb={10}></Box>
          </Container>
        </>
      )}
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={toastClose}>
        <Alert onClose={toastClose} severity={toastSeverity}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
