import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Stepper,
  Tooltip,
  IconButton,
  StepLabel,
  StepConnector,
  Step,
  Button,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import ReactToPdf from "react-to-pdf";
import { PictureAsPdf } from "@material-ui/icons";

import {
  SaveAlt,
  PanTool,
  FlightTakeoff,
  CheckCircle,
  LibraryBooks,
  MenuBook,
  Cancel,
  AddAlert,
  DepartureBoard,
} from "@material-ui/icons";

// import SettingsIcon from '@material-ui/icons/Settings';
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

import GroupAddIcon from "@material-ui/icons/GroupAdd";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import Check from "@material-ui/icons/Check";
import LayersIcon from "@material-ui/icons/Layers";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import ProductDetails from "../../components/order-pages/ProductDetails";
import ShipmentDetails from "../../components/order-pages/ShipmentDetails";
import DeliveryDetails from "../../components/order-pages/DeliveryDetails";

import {
  setProductDetails,
  setShipDetails,
  setDeliveryDetails,
  setPaymentDetails,
} from "../../redux/shipmentPageSlice";

import styles from "./css/Edit.module.css";

const { REACT_APP_API_URL } = process.env;
const { REACT_APP_SHOPAPI_URL } = process.env;

export default function OrdersView() {
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState(null);
  const { search } = useLocation();
  const { id, orderStatus } = queryString.parse(search);
  const userData = useSelector((state) => state.auth.userData);
  const ref = React.createRef();
  const history = useHistory();

  const [activeStep, setActiveStep] = useState(0);

  const stepChange = (n) => {
    setActiveStep(n);
  };

  const redirection = (n) => {
    localStorage.setItem("redirectid", n);
    history.push(`/orders`);
  };
  

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return <ProductDetails orderData={orderData} stepChange={stepChange} />;
      case 1:
        return (
          <ShipmentDetails orderData={orderData} stepChange={stepChange} />
        );
      case 2:
        return (
          <DeliveryDetails orderData={orderData} stepChange={stepChange} />
        );
      // case 3:
      //   return null;

      default:
        return <ProductDetails stepChange={stepChange} />;
    }
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`mylapay/orders/get/${parseInt(id)}?orderStatus=${orderStatus}`)
        .then((res) => {
          if (res.data.status === 1) {
            if (res.data.message.length === 0) return;
            // let temp = res.data.message.find(
            //   (item) => item.iOrder === parseInt(id)
            // );
            setOrderData(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    };

    getData();
  }, [userData, id, dispatch]);

  const UserManual_click = () => {
    history.push({
      pathname: "/order-user-manual",
    });
  };

  useEffect(() => {
    return () => {
      dispatch(setProductDetails(null));
      dispatch(setShipDetails(null));
      dispatch(setDeliveryDetails(null));
      dispatch(setPaymentDetails(null));
    };
  }, [dispatch]);

  /* Stepper icon code starts here */

  const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: "#ccc",
      zIndex: 1,
      color: "#fff",
      width: 50,
      height: 50,
      display: "flex",
      borderRadius: "50%",
      justifyContent: "center",
      alignItems: "center",
    },
    active: {
      // backgroundImage:
      //   'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',

      backgroundImage:
        "linear-gradient( 136deg, rgb(75 197 197) 0%, rgb(58 132 208) 50%, rgb(8 56 84) 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    },
    completed: {
      // backgroundImage:
      //   'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      backgroundImage:
        "linear-gradient( 136deg, rgb(75 197 197) 0%, rgb(58 132 208) 50%, rgb(8 56 84) 100%)",
    },
  });

  const useQontoStepIconStyles = makeStyles({
    root: {
      color: "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center",
    },
    active: {
      color: "#784af4",
    },
    circle: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    completed: {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
  });

  function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
        })}
      >
        {completed ? (
          <Check className={classes.completed} />
        ) : (
          <div className={classes.circle} />
        )}
      </div>
    );
  }

  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
  };

  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };

  function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons = {
      1: <AddShoppingCartIcon />,
      2: <LayersIcon />,
      3: <LocalShippingIcon />,
      4: <AttachMoneyIcon />,
    };

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {icons[String(props.icon)]}
      </div>
    );
  }

  const ColorlibConnector = withStyles({
    alternativeLabel: {
      top: 22,
    },
    active: {
      "& $line": {
        // backgroundImage:
        //   'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        backgroundImage:
          "linear-gradient( 136deg, rgb(75 197 197) 0%, rgb(58 132 208) 50%, rgb(8 56 84) 100%)",
      },
    },
    completed: {
      "& $line": {
        // backgroundImage:
        //   'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        backgroundImage:
          "linear-gradient( 136deg, rgb(75 197 197) 0%, rgb(58 132 208) 50%, rgb(8 56 84) 100%)",
      },
    },
    line: {
      height: 3,
      border: 0,
      backgroundColor: "#eaeaf0",
      borderRadius: 1,
    },
  })(StepConnector);

  /* Stepper icon code ends here */

  /* New stepper design */
  const stepTitles = [
    "Order Details",
    "Initiate Shipment",
  ];

  return (
    <>
      {orderData && (
        // <Container className="full-height">
        //   <Box mb={3}>
        //     <Stepper
        //       style={{ background: "transparent" }}
        //       activeStep={activeStep}
        //       alternativeLabel
        //       connector={<ColorlibConnector />}
        //     >
        //       <Step>
        //         <StepLabel StepIconComponent={ColorlibStepIcon}>
        //           Product Details
        //         </StepLabel>
        //       </Step>
        //       <Step>
        //         <StepLabel StepIconComponent={ColorlibStepIcon}>
        //           Shipment Details
        //         </StepLabel>
        //       </Step>
        //       <Step>
        //         <StepLabel StepIconComponent={ColorlibStepIcon}>
        //           Delivery Details
        //         </StepLabel>
        //       </Step>
        //     </Stepper>
        //   </Box>

        //   {stepContent()}

        //   <Box pb={5}></Box>
        // </Container>

        <Container className="full-height">
      
          <Box my={2} className={styles.stepWrapredirect}>

            <div className={styles.redirectactions}
              onClick={() => redirection(0)}
            >
              <div className={styles.redirectactionsicon}>
                <AddAlert />
              </div>
              
              New orders
            </div>

            <div className={styles.redirectactions}
              onClick={() => redirection(1)}
              >
                <div className={styles.redirectactionsicon}>
                <DepartureBoard />
              </div>
              Accepted Orders
            </div>
            <div className={styles.redirectactions}
              onClick={() => redirection(2)}
            >
              <div className={styles.redirectactionsicon}>
                <FlightTakeoff />
              </div>
              Transit
            </div>
            <div className={styles.redirectactions}
              onClick={() => redirection(3)}
            >
              <div className={styles.redirectactionsicon}>
                <CheckCircle />
              </div>
              Closed
            </div>
            <div className={styles.redirectactions}
              onClick={() => redirection(4)}
            >
              <div className={styles.redirectactionsicon}>
                <Cancel />
              </div>
              Cancelled
            </div>
            <div className={styles.redirectactions}
              onClick={() => redirection(5)}
            >
              <div className={styles.redirectactionsicon}>
                <LibraryBooks />
              </div>
              All orders
            </div>

            <div className={styles.redirectactions_usermanual}>
              <Tooltip title="User Manual">
                <IconButton
                  onClick={() => {
                    UserManual_click();
                  }}
                  style={{ color: "white" }}
                >
                  <MenuBook />
                </IconButton>
              </Tooltip>
            </div>
            
          </Box>

            <Box my={3} className={styles.stepWrap}>
              {stepTitles.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`${styles.stepCard} ${
                    i === activeStep ? styles.active : ""
                  }`}
                >
                  {item}
                </div>
              ))}
            </Box>

          {stepContent()}

          <Box pb={5}></Box>

          {/* <StepOne /> */}
        </Container>
      )}

      {/* <Grid container>
        <Grid item xs={6}>
          <pre>{JSON.stringify(orderData, null, 2)}</pre>
        </Grid>
        <Grid item xs={6}>
          <h3>products data</h3>
          <pre>
            {orderData && JSON.stringify(orderData.productDetails, null, 2)}
          </pre>
        </Grid>
      </Grid> */}
    </>
  );
}
