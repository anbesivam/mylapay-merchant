import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Collapse,
  CircularProgress,
  Dialog,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link, useHistory } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { setAuth, setUserData } from "../../redux/authSlice";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import ForgotPassword from "../../components/user/ForgotPassword";
import UpdatePassword from "../../components/user/UpdatePassword";

export default function Login() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("This is a message!");
  const { REACT_APP_API_URL, REACT_APP_WEBSITE_URL } = process.env;

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup.string().required("Enter a password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login(values);
    },
  });

  const login = async (values) => {
    setLoading(true);

    await axios
      .post(`${REACT_APP_API_URL}/mylapay/auth/login`, {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("userData", JSON.stringify(res.data.data));
          localStorage.setItem("imid", JSON.stringify(res.data.data.imid));
          dispatch(setUserData(res.data.data));
          dispatch(setAuth(true));

          switch (res.data.data.is_approved) {
            case 0:
              history.push("/user/kyc-form");
              break;
            case 1:
              if (res.data.Sub_Merchant_ID === null) {
                history.push("/approval");
              } else {
                history.push("/");
              }
              break;
            case 2:
              history.push("/rejected-docs");
              break;

            default:
              break;
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(true);
          if (error.response.data.message) {
            setErrorMsg(error.response.data.message);
          } else {
            setErrorMsg(error.response.statusText);
          }
        } else {
          setError(true);
          setErrorMsg(error.message);
        }
      });

    setLoading(false);
  };
  const handleDialog = async (value) => {
    setForgotPassword(value);
    console.log(forgotPassword);
  };

  const updatePasswordFunc = async (value) => {
    setUpdatePassword(value);
  };
  return (
    <>
      <AppBar
        className="signup-header"
        position="static"
        color="transparent"
        elevation={0}
      >
        <Container>
          <Toolbar disableGutters>
            <a
              target="_blank"
              href={REACT_APP_WEBSITE_URL}
              style={{ marginRight: "auto" }}
            >
              <img
                className="site-logo"
                src="/logo.svg"
                alt="Mylapay Logo"
                width="290px"
                height="70px"
              />
            </a>
            <Box ml="auto" mr={2} display={{ xs: "none", md: "block" }}>
              <Typography style={{ color: "#fff" }}>
                New User? Create your account now
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/user/signup"
              endIcon={<ArrowForwardIcon />}
              variant="outlined"
              style={{ color: "#fff", borderColor: "#fff" }}
              className="header-cta"
            >
              Sign up
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container className="full-height">
        <Grid className="signup-grid full-height" container spacing={3}>
          <Grid item xs={12} md={7} className="signup-left">
            <img
              className="signup-image"
              src="/images/signup.svg"
              alt="Signup"
              height="300px"
              width="300px"
            />
            <Typography gutterBottom variant="h4">
              Faster Settlements
            </Typography>
            <Typography className="signup-text">
              No more worries on delayed settlements <br />
              Get your settlement pay-outs on time (RBI Guidelines)
              <br />
              Manage your business cashflows efficiently
            </Typography>
          </Grid>
          <Grid className="v-center signup-right" item xs={12} md={5}>
            <Card variant="outlined">
              <Box className="form-outer" p={4}>
                <CardContent>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Login to your Account
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    to access your Dashboard
                  </Typography>

                  <Collapse in={error}>
                    <Box mt={2}>
                      <Alert severity="error">{errorMsg}</Alert>
                    </Box>
                  </Collapse>

                  <form
                    noValidate
                    className="auth-form"
                    onSubmit={formik.handleSubmit}
                  >
                    <Box mt={4}>
                      <TextField
                        label="Your email"
                        onChange={formik.handleChange}
                        fullWidth
                        variant="outlined"
                        name="email"
                        id="email"
                        type="email"
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Box>
                    <Box mt={4}>
                      <TextField
                        label="Password"
                        onChange={formik.handleChange}
                        fullWidth
                        variant="outlined"
                        name="password"
                        id="password"
                        type="password"
                        error={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        helperText={
                          formik.touched.password && formik.errors.password
                        }
                      />
                    </Box>
                    <Box mt={4}>
                      <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        style={{
                          paddingTop: "16px",
                          paddingBottom: "16px",
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : "Login"}
                      </Button>
                    </Box>
                  </form>
                  <Box display="flex" justifyContent="flex-end">
                    <Link
                      //to="../components/user/ForgotPassword"
                      onClick={() => handleDialog(true)}
                      style={{
                        textDecoration: "none",
                        marginTop: "1em",
                        display: "inline-flex",
                      }}
                    >
                      <Typography
                        style={{
                          textAlign: "right",
                        }}
                        variant="body2"
                        color="primary"
                      >
                        Forgot Password?
                      </Typography>
                    </Link>
                  </Box>
                  <Dialog open={forgotPassword}>
                    <ForgotPassword
                      handleDialog={handleDialog}
                      updatePassword={updatePasswordFunc}
                      setRegisteredEmail={setRegisteredEmail}
                    />
                  </Dialog>
                  <Dialog open={updatePassword}>
                    <UpdatePassword
                      updatePasswordFunc={updatePasswordFunc}
                      otpVerified={true}
                      registeredEmail={registeredEmail}
                    />
                  </Dialog>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
