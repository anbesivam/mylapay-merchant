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
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link, useHistory } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { setAuth, setUserData } from "../../redux/authSlice";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";

export default function Signup() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { REACT_APP_API_URL } = process.env;
  
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Enter a password")
      .min(8, "Must be 8 characters or more")
      .matches(/[a-z]+/, "Must have atleast 1 lowercase character")
      .matches(/[A-Z]+/, "Must have atleast 1 uppercase character")
      .matches(/[@$!%*#?&]+/, "Must have atleast 1 special character")
      .matches(/\d+/, "Must have atleast 1 number"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    await axios
      .post(`${REACT_APP_API_URL}/mylapay/merchant/signup`, {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        if (res.data.status === 0) {
          setError(true);
          setErrorMsg(res.data.message);
        } else {
          login(values);
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(true);
          setErrorMsg(error.response.statusText);
        } else {
          setError(true);
          setErrorMsg(error.message);
        }
      });

    setLoading(false);
  };

  const login = async (values) => {
    setLoading(true);

    await axios
      .post(`${REACT_APP_API_URL}/mylapay/auth/login`, {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        if (res.data.success) {
          dispatch(setUserData(res.data.data));
          localStorage.setItem("userData", JSON.stringify(res.data.data));
          dispatch(setAuth(true));
          history.push("/user/kyc-form");
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
          setErrorMsg(error);
          console.log(error);
        }
      });

    setLoading(false);
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
            <Link to="/" style={{ marginRight: "auto" }}>
              <img
                className="site-logo"
                src="/logo.svg"
                alt="Mylapay Logo"
                width="290px"
                height="70px"
              />
            </Link>
            <Box ml="auto" mr={2} display={{ xs: "none", md: "block" }}>
              <Typography style={{ color: "#fff" }}>
                Already have an account?
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/user/login"
              endIcon={<ArrowForwardIcon />}
              variant="outlined"
              style={{ color: "#fff", borderColor: "#fff" }}
              className="header-cta"
            >
              Log in
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container className="full-height">
        <Grid className="signup-grid full-height" container spacing={3}>
          <Grid item xs={12} md={7} className="signup-left">
            <Typography gutterBottom variant="h4">
              Zero setup cost!
            </Typography>
            <Typography className="signup-text">
              Signup today and get your account activated with no charges on
              setup. Hurry now..
            </Typography>
            <img
              className="signup-image"
              src="/images/signup.svg"
              alt="Signup"
              height="300px"
              width="300px"
            />
            <Typography gutterBottom variant="h4">
              Instant Activation
            </Typography>
            <Typography className="signup-text">
              Create your account with simplified KYC <br />
              Get activated instantly and go live!
              <br />
              Easy Integration & developer support
            </Typography>
          </Grid>
          <Grid className="v-center signup-right" item xs={12} md={5}>
            <Card variant="outlined">
              <Box className="form-outer" p={4}>
                <CardContent>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Mylapay
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Create your account
                  </Typography>

                  <Collapse in={error}>
                    <Box mt={2}>
                      <Alert severity="error">{errorMsg}</Alert>
                    </Box>
                  </Collapse>

                  <form
                    autoComplete="off"
                    noValidate
                    className="auth-form"
                    onSubmit={formik.handleSubmit}
                  >
                    <Box mt={4}>
                      <TextField
                        label="Business Email"
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
                        {loading ? <CircularProgress size={24} /> : "Signup"}
                      </Button>
                    </Box>
                  </form>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
