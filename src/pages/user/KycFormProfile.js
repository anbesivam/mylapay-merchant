import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Container,
  Dialog,
  Box,
} from "@material-ui/core";
import ContactInfoProfile from "../../components/user/ContactInfoProfile";
import BusinessInfoProfile from "../../components/user/BusinessInfoProfile";
import BankDetailsProfile from "../../components/user/BankDetailsProfile";
import { useDispatch, useSelector } from "react-redux";
import { setActiveStep } from "../../redux/kycSlice";
// import axios from "axios";
// import { setUserDetails } from "../../redux/authSlice";
import { useHistory } from "react-router";
import NewBusinessInfoProfile from "../../components/user/NewBusinessInfoProfile";
// import { logOut } from "../../redux/authSlice";

export default function KycFormProfile() {
  const activeStep = useSelector((state) => state.kyc.activeStep);
  const currentUser = useSelector((state) => state.auth.userData);
  const userDetails = useSelector((state) => state.auth.userDetails);
  // const isAuthenticated = Boolean(localStorage.getItem("userData"));
  const dispatch = useDispatch();
  const history = useHistory();
  const [prefillData] = useState(null);
  const [contactDialog, setContactDialog] = useState(false);

  const userDetailsNew = JSON.parse(localStorage.getItem("userDetails"));
  //console.log(userDetailsNew.is_approved);

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <NewBusinessInfoProfile
            handleDialog={handleDialog}
            prefillData={prefillData}
          />
        );
      case 1:
        return <BusinessInfoProfile prefillData={prefillData} />;
      case 2:
        return <BankDetailsProfile prefillData={prefillData} />;

      default:
        return <ContactInfoProfile prefillData={prefillData} />;
    }
  };

  useEffect(() => {
    if (userDetailsNew) {
      dispatch(setActiveStep(3));
    }
    // console.log(userDetails);
    // //if (userDetails === null) return history.push("/");
    // if (userDetails.current_step === null) return;
    // if (userDetails.current_step === 3)
    //   return dispatch(setActiveStep(userDetails.current_step));

    // if (userDetailsNew.is_approved === 1) {
    //   history.push("/");
    // }
    // eslint-disable-next-line
  }, [userDetails, dispatch, history]);

  const handleDialog = (value) => {
    setContactDialog(value);
  };
  // const handleLogout = () => {
  //   localStorage.clear();
  //   dispatch(logOut());
  //   history.push("/user/login");
  // };

  return (
    <>
      {userDetails && (
        <>
          <Container className="full-height">
            <Typography className="kyc-title" variant="body1">
              Your KYC form Details
            </Typography>
            <Box mb={3}>
              <Stepper
                style={{ background: "transparent" }}
                activeStep={activeStep}
                alternativeLabel
              >
                {/* <Step>
                  <StepLabel>Contact Info</StepLabel>
                </Step> */}
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
            {currentUser.imid === 0 && (
              <Dialog open={contactDialog}>
                <ContactInfoProfile handleDialog={handleDialog} />
              </Dialog>
            )}

            <Box pb={10}></Box>
          </Container>
        </>
      )}
    </>
  );
}
