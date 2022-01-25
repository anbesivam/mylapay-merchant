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
  FormControlLabel,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link, useHistory } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { setAuth, setUserData } from "../../redux/authSlice";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Checkbox from "@material-ui/core/Checkbox";
import Mindeed from "../../components/common/footer/Mindeed";
import FooterLinks from "../../components/common/footer/Links";
import FooterSupport from "../../components/common/footer/Support";
import Copyright from "../../components/common/footer/Copyright";

export default function Signup() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

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
    tos: yup.boolean().oneOf([true], "Please agree to the Terms of Service"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      tos: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    await axios
      .post("/mylapay/merchant/signup", {
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
      .post("/mylapay/auth/login", {
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
      <AppBar className="signup-header" color="#fff" elevation={0}>
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
              <Typography>Already have an account?</Typography>
            </Box>

            <Button
              component={Link}
              to="/user/login"
              endIcon={<ArrowForwardIcon />}
              variant="outlined"
              className="header-cta"
              style={{
                color: "var(--mp-light-blue)",
                borderColor: "var(--mp-light-blue)",
              }}
            >
              Log in
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <div className="page-content dots">
        <div className="container">
          <div className="grid">
            <div className="left">
              <div className="point">
                <img
                  src="/images/quick-cost-free-activation.svg"
                  alt="Quick Cost-free Activation"
                  height="60"
                  width="60"
                />
                <p>Quick Cost-free Activation</p>
              </div>
              <div className="point">
                <img
                  src="/images/simplified-kyc.svg"
                  alt="Simplified KYC"
                  height="60"
                  width="60"
                />
                <p>Simplified KYC</p>
              </div>
              <div className="point">
                <img
                  src="/images/instant-setup.svg"
                  alt="Business Live Instantly With Payment Setup"
                  height="60"
                  width="60"
                />
                <p>Business Live Instantly With Payment Setup</p>
              </div>
              <div className="point">
                <img
                  src="/images/easy-integration.svg"
                  alt="Easy Integration & Developer Support"
                  height="60"
                  width="60"
                />
                <p>Easy Integration & Developer Support</p>
              </div>
            </div>
            <div className="right">
              <h1>Sign Up</h1>
              <form onSubmit={formik.handleSubmit}>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Business Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  <div className="error">
                    {formik.touched.email && formik.errors.email}
                  </div>
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <div className="error">
                    {formik.touched.password && formik.errors.password}
                  </div>
                </div>
                <div className="field tos-field ">
                  <FormControlLabel
                    className="tos-label"
                    control={
                      <Checkbox
                        className="tos-check"
                        checked={formik.values.tos}
                        onChange={formik.handleChange}
                        inputProps={{ "aria-label": "primary checkbox" }}
                        name="tos"
                      />
                    }
                    label="I agree to the Terms of service and Privacy policies of Mylapay"
                  />

                  <div className="error">
                    {formik.touched.tos && formik.errors.tos}
                  </div>
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={14} color="#fff" />
                  ) : (
                    "Signup"
                  )}
                </button>
              </form>

              <Collapse in={error}>
                <Box mt={2}>
                  <Alert severity="error">{errorMsg}</Alert>
                </Box>
              </Collapse>
            </div>
          </div>
        </div>
      </div>

      <Mindeed />
      <FooterLinks />
      <FooterSupport />
      <Copyright />

      <style>
        {`
          body {
            background-color: #fff;
          }
          .page-content {
            background: linear-gradient(
              to right,
              var(--mp-light-blue) 40%,
              #fff 40%
            );
            height: 100%;
            margin-top: 0px;
          }

          .dots::before {
            content: "";
            display: block;
            height: 180px;
            width: 60px;
            background: url(/images/dots-left.svg) no-repeat;
            background-size: contain;
            position: absolute;
            top: 0px;
            left: 0px;
          }

          .container {
            max-width: 1280px;
            height: 100%;
            margin: auto;
          }
          .grid {
            display: grid;
            grid-template-columns: 40% 60%;
            height: 100%;
            align-items: center;
          }
          .left {
            color: #fff;
            padding: 2em 0;
            display: grid;
            gap: 2em;
          }
          .point {
            display: flex;
            align-items: center;
            max-width: 280px;
          }
          .point img {
            margin-right: 2em;
          }
          .point p {
            font-weight: 600;
            line-height: 1.6;
          }

          h1 {
            font-size: 50px;
            color: #797979;
            font-weight: 600;
          }
          .right {
            width: 400px;
            margin: auto;
          }
          form {
            display: grid;
            gap: 1em;
          }
          input {
            background: rgba(213, 222, 226, 0.31);
            border-radius: 5px;
            padding: 1em;
            font-size: 1rem;
            border: 0;
            outline: 0;
            width: 100%;
          }
          .error {
            color: red;
            font-size: 0.7em;
            padding: 0.5em 1.5em;
          }
          button {
            padding: 1em 2em;
            background: var(--mp-light-blue);
            color: #fff;
            border: 0;
            outline: 0;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: 500;
            width: auto;
            margin-right: auto;
            cursor: pointer;
          }
          .tos-label .MuiFormControlLabel-label {
            font-size: 0.8em;
            padding-top: 1em;
            color: #909090;
          }
          .tos-field {
            max-width: 300px;
            margin-top: -1em;
          }

          @media (max-width: 1366px) {
            .container {
              max-width: 1070px;
            }
            .dots::before {
              height: 120px;
              width: 40px;
              top: 9px;
            }
          }
        `}
      </style>
    </>
  );
}
