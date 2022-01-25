import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
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
import Checkbox from "@material-ui/core/Checkbox";
import Mindeed from "../../components/common/footer/Mindeed";
import FooterLinks from "../../components/common/footer/Links";
import FooterSupport from "../../components/common/footer/Support";
import Copyright from "../../components/common/footer/Copyright";
import TermsOfService from "../../components/signup/TermsOfService";
import PrivacyPolicy from "../../components/signup/PrivacyPolicy";

export default function Signup() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { REACT_APP_API_URL, REACT_APP_WEBSITE_URL } = process.env;
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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

  const handleArrow = (e) => {
    let right = document.querySelector(".right");
    right.classList.toggle("shrink");
  };

  return (
    <>
      <AppBar
        className="signup-header"
        color="transparent"
        style={{ background: "#fff" }}
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

      <div className="dots">
        <div className="container">
          <div className="grid">
            <div className="left">
              <div className="left-inner">
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
            </div>

            <div className="right">
              <div className="multi-arrow" onClick={handleArrow}>
                <img
                  src="/images/icon-multi-arrow.svg"
                  alt="Arrow"
                  height="30"
                  width="30"
                />
              </div>
              <div className="right-inner">
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
                    <div className="tos-wrap">
                      <Checkbox
                        className="tos-check"
                        checked={formik.values.tos}
                        onChange={formik.handleChange}
                        inputProps={{ "aria-label": "primary checkbox" }}
                        name="tos"
                      />

                      <p className="tos-label">
                        I agree to the{" "}
                        <a
                          target="_blank"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTerms(true);
                          }}
                        >
                          Terms of service
                        </a>{" "}
                        and{" "}
                        <a
                          target="_blank"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPrivacy(true);
                          }}
                        >
                          Privacy policies
                        </a>{" "}
                        of Mylapay
                      </p>
                    </div>

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
      </div>

      <Mindeed />
      <FooterLinks />
      <FooterSupport />
      <Copyright />

      <TermsOfService showTerms={showTerms} setShowTerms={setShowTerms} />
      <PrivacyPolicy
        showPrivacy={showPrivacy}
        setShowPrivacy={setShowPrivacy}
      />

      <style>
        {`
          body {
            background-color: #fff;
          }
          .page-content {
            height: 100%;
            margin-top: 0px;
          }
          .dots {
            background: linear-gradient(
              to right,
              var(--mp-light-blue) 50%,
              #fff 50%
            );
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
            grid-template-areas: "slide";
            margin-top: 70px;
            position: relative;
          }
          .left {
            grid-area: slide;
            width: 100%;
            overflow: hidden;
            background: var(--mp-light-blue);
            position: relative;
            padding: 3em 5em;
          }

          .left-inner {
            color: #fff;
            padding: 2em 0;
            display: grid;
            gap: 2em;
            width: 300px;
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
            margin-top: 0;
          }
          .right {
            background: #fff;
            margin-left: auto;
            grid-area: slide;
            width: 80%;
            position: absolute;
            height: 100%;
            right: 0px;
            left: auto;
            display: flex;
            transition: width 0.3s ease;
          }
          .right.shrink {
            width: 60%;
          }
          .right::before {
            content: "";
            display: block;
            height: 100%;
            width: 100px;
            background: linear-gradient(
              to left,
              var(--mp-light-blue),
              transparent
            );
            position: absolute;
            top: 0;
            left: -100px;
          }
          .multi-arrow {
            height: 60px;
            width: 60px;
            background: var(--mp-light-blue);
            border-radius: 75px;
            padding: 15px;
            box-shadow: 1px 1px 10px rgb(0 0 0 / 12%);
            cursor: pointer;
            cursor: pointer;
            position: absolute;
            left: -30px;
            top: calc(50% - 30px);
          }
          .right-inner {
            width: 420px;
            margin: auto;
            position: relative;
            z-index: 3;
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
          .tos-wrap {
            display: flex;
          }
          .tos-label {
            font-size: 0.8em;
            padding-top: 0.1em;
            color: #909090;
          }
          .tos-label a {
            color: #333;
            border-bottom: 1px solid;
          }
          .tos-field {
            max-width: 100%;
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
          @media (max-width: 767px) {
            .grid {
              grid-template-areas: unset;
              grid-template-columns: auto;
              gap: 0;
            }
            .left {
              grid-area: unset;
              grid-row: 2;
              min-width: 0;
              padding: 5em 2em;
            }
            .right {
              grid-area: unset;
              position: static;
              width: 100%;
              grid-row: 1;
              padding: 5em 2em 7em;
              box-sizing: border-box;
              min-width: 0;
            }
            .multi-arrow {
              display: none;
            }
            .right-inner {
              width: 100%;
            }
            h1 {
              font-size: 40px;
              color: #2bafe4;
            }
            button {
              padding: 0.75em 2em;
            }
            .left-inner {
              padding: 0;
              gap: 2em;
              width: 100%;
              grid-template-columns: 1fr 1fr;
              justify-items: center;
            }
            .point {
              flex-direction: column;
              align-items: center;
              text-align: center;
              max-width: 120px;
            }
            .point img {
              margin: auto;
            }
            .delivery_icons {
              margin-right: auto !important;
              margin: auto;
            }
          }
        `}
      </style>
    </>
  );
}
