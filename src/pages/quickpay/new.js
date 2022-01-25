import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Close, FileCopyOutlined } from "@material-ui/icons";

export default function QuickpayNew() {
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("This is an alert");
  const [alertType, setAlertType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [quickPayUrl, setQuickPayUrl] = useState(null);
  const { REACT_APP_SHOP_URL } = process.env;
  const [linkCopied, setLinkCopied] = useState(false);

  const validationSchema = yup.object({
    amount: yup
      .number()
      .typeError("Enter a valid amount")
      .positive("Enter a valid amount"),
    reason: yup.string().required("Reason is required"),
  });

  const formik = useFormik({
    initialValues: {
      amount: "",
      reason: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setAlert(false);

    await axios
      .post("/mylapay/shop/quick_pay", values)
      .then((response) => {
        if (response.data.success) {
          setAlert(true);
          setAlertType("success");
          setAlertMsg(response.data.data);
          setShowDialog(true);
          setQuickPayUrl(response.data.quickPayId);
        } else {
          setAlert(true);
          setAlertType("error");
          setAlertMsg(response.data.data);
        }
      })
      .catch((error) => {
        setAlertType("error");
        setAlert(true);
        if (error.response) {
          if (error.response.data.message) {
            setAlertMsg(error.response.data.message);
          } else {
            setAlertMsg(error.response.statusText);
          }
        } else {
          setAlertMsg(error);
        }
      });
    setLoading(false);
  };

  return (
    <Box
      maxWidth="600px"
      style={{ background: "#fff" }}
      p={4}
      margin="auto"
      my={4}
      borderRadius="4px"
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Create a Quickpay Link</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              step="any"
              variant="outlined"
              label="Amount"
              fullWidth
              name="amount"
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldTouched("amount");
              }}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              variant="outlined"
              label="Reason"
              fullWidth
              multiline
              rows={3}
              name="reason"
              onChange={formik.handleChange}
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              helperText={formik.touched.reason && formik.errors.reason}
            />
          </Grid>

          <Grid item xs={12}>
            <Collapse in={alert}>
              <Alert severity={alertType}>{alertMsg}</Alert>
            </Collapse>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ArrowForward />}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Create Quickpay Link"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog open={showDialog} keepMounted>
        <DialogTitle>
          Your quickpay link is ready!
          <IconButton
            onClick={() => setShowDialog(false)}
            style={{ position: "absolute", right: "0px", top: "0px" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ minWidth: "650px", paddingBottom: "2em" }}>
          <div className="quickpay-url-wrap">
            <div className="quickpay-url">
              {REACT_APP_SHOP_URL + `/quickpay/` + quickPayUrl}
            </div>
            <CopyToClipboard
              text={`${REACT_APP_SHOP_URL}/quickpay/${quickPayUrl}`}
              onCopy={() => setLinkCopied(true)}
            >
              <Button
                style={{
                  position: "absolute",
                  right: "-4px",
                  top: "0px",
                  bottom: "0px",
                  height: "100%",
                }}
                color="primary"
                variant="contained"
                endIcon={<FileCopyOutlined />}
              >
                {linkCopied ? "Copied!" : "Copy"}
              </Button>
            </CopyToClipboard>
          </div>
          <Typography style={{ marginBottom: "1.5em" }} variant="body1">
            You can click on 'Copy' button and share with your
            customers/clients.
          </Typography>
          <Grid container justify={"center"}>
            <Link style={{ textDecoration: "none" }} to={"/quickpay"}>
              <Button type="submit" variant="contained" color="primary">
                Got to List
              </Button>
            </Link>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
