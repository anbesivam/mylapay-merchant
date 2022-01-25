import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import { Alert } from "@material-ui/lab";
import {
  Box,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { ArrowForward, Close } from "@material-ui/icons";
import toast from "react-hot-toast";
import readXlsxFile from "read-excel-file";
import readTextFile from "read-text-file";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const { REACT_APP_SHOP_URL } = process.env;

export default function SharePopup({
  sharePopupOpen,
  setSharePopupOpen,
  shopName,
  shopUrl,
  Template_Name,
}) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("This is an alert");
  const [alertType, setAlertType] = useState("info");

  const handleFileUpload = () => {
    const input = document.getElementById("excelImport");
    const excelImportFileName = document.getElementById("excelImportFileName");

    setAlert(false);
    if (input.files[0].type === "text/plain") {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var preview = document.getElementById("excelImportFileName");
        var file = document.querySelector("input[type=file]").files[0];
        var reader = new FileReader();

        var textFile = /text.*/;

        if (file.type.match(textFile)) {
          reader.onload = function (event) {
            preview.innerHTML = file.name;
            const newText = event.target.result;

            let t = newText.split("\n").map((item) => item.trim());
            t = t.join(",");

            formik.setFieldValue("contactList", t);
          };
        } else {
          preview.innerHTML =
            "<span class='error'>It doesn't seem to be a text file!</span>";
        }
        reader.readAsText(file);
      } else {
        alert("Your browser is too old to support HTML5 File API");
      }
    } else if (
      input.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      input.files[0].type === "application/vnd.ms-excel"
    ) {
      readXlsxFile(input.files[0]).then((rows) => {
        if (input.files[0]) {
          excelImportFileName.innerHTML = input.files[0].name;
        } else {
          excelImportFileName.innerHTML = "Import from file (Excel)";
        }
        let t = rows.map((item) => item[0]);
        console.log(t);
        const newText = t.join(",");
        formik.setFieldValue("contactList", newText);
      });
    } else {
      setAlert(true);
      setAlertType("error");
      setAlertMsg("Invalid file selected");
    }
  };
  const validationSchema = yup.object({
    message: yup.string().required("Message is required"),
    contactList: yup.string().required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      message:
        "Dear Customer, " +
        shopName +
        " is online now to delight your shopping experience. Click " +
        `${REACT_APP_SHOP_URL}/${shopUrl}/${Template_Name}` +
        " powered by MYLAPAY.",
      contactList: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      submitNumbers(values);
    },
  });

  const submitNumbers = async (values) => {
    setLoading(true);
    setAlert(false);

    let t = values.contactList.split(",");
    t = t.filter(Boolean);

    const allNumbersValid = t.every((item) => /^\d{10}$/.test(item));
    if (!allNumbersValid) {
      setAlert(true);
      setAlertType("error");
      setAlertMsg(
        "Invalid values in Phone number list. Please enter only 10-digit mobile numbers seperated by commas."
      );
      formik.setFieldError("contactList", "Invalid Values");
      setLoading(false);
      return;
    }

    await axios
      .post("/mylapay/shop/send/notification", {
        shopName: shopName,
        shopUrl: shopUrl,
        contactList: t,
      })
      .then((response) => {
        if (response.data.success) {
          toast("✅ Message sent successfully!");
          formik.resetForm();
          setSharePopupOpen(false);
        } else {
          setAlert(true);
          setAlertType("error");
          setAlertMsg("Something went wrong, please try again.");
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
    <Dialog
      disableBackdropClick={true}
      open={sharePopupOpen}
      TransitionComponent={Transition}
      onClose={() => setSharePopupOpen(false)}
    >
      <DialogTitle>
        Share shop url to your contacts
        <IconButton
          style={{ position: "absolute", right: "0", top: "0" }}
          onClick={() => setSharePopupOpen(false)}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Enter your contact numbers seperated by commas. Once you submit, a sms
          with your message will be sent to all the numbers.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            style={{ marginTop: "1em" }}
            label="Your Message"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            disabled
            name="message"
            onChange={formik.handleChange}
            value={formik.values.message}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
          />
          <TextField
            style={{ marginTop: "1em" }}
            label="Phone Numbers list (Seperated by comma)"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contactList"
            onChange={(e) => {
              const re = /^[0-9,]*$/;
              if (re.test(e.target.value)) {
                formik.setFieldValue("contactList", e.target.value);
              }
            }}
            value={formik.values.contactList}
            error={
              formik.touched.contactList && Boolean(formik.errors.contactList)
            }
            helperText={formik.touched.contactList && formik.errors.contactList}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            mt={2}
          >
            <label
              id="excelImportLabel"
              htmlFor="excelImport"
              style={{ flexBasis: "50%" }}
            >
              <input
                type="file"
                accept=".txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="excelImport"
                onChange={handleFileUpload}
              />
              <span id="excelImportFileName">Import from file</span>
            </label>
            <div
              style={{
                marginLeft: "1em",
                lineHeight: "1.5",
                fontSize: "0.8em",
                flexBasis: "50%",
              }}
            >
              Download a sample file.<br></br> (Right click and select 'save
              as')<br></br>
              <a
                className="mp-link"
                href="/docs/contacts-import-sample.xlsx"
                target="_blank"
              >
                Excel
              </a>
              <a
                className="mp-link"
                href="/docs/contactNumbers-sample.txt"
                target="_blank"
                style={{ margin: "0 1em" }}
              >
                Text file
              </a>
            </div>
          </Box>
          <Collapse in={alert}>
            <Alert style={{ marginTop: "1em" }} severity={alertType}>
              {alertMsg}
            </Alert>
          </Collapse>
          <Box mt={2} mb={1} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
