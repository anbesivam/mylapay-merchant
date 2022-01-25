import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { setFormValues } from "../../redux/shopSlice";
import { useDispatch } from "react-redux";
export default function PaymentForm({ orderTotal, inputData, handleDialog }) {
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const numberRegex = /^[0-9\b]+$/;
  const alphabetRegex = /^[A-Za-z]+$/;
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const mobRegex = /^\d{10}$/;

  useEffect(() => {
    let temp = { name: "", email: "", phone: "", building_no: "",street_name: "", landmark: "" };
    inputData.forEach((item) => {
      temp = {
        ...temp,
        [item.inputLabel]: "",
      };
    });
    setFormData(temp);
    setFormErrors(temp);
  }, [inputData]);

  const renderInputs = (item) => {
    switch (item.inputType) {
      case "alphanumeric":
        return (
          <TextField
            type="text"
            label={item.inputLabel}
            variant="outlined"
            fullWidth
            value={formData[item.inputLabel]}
            onChange={(e) => {
              setFormData({
                ...formData,
                [item.inputLabel]: e.target.value,
              });
              if (formSubmitted) validateForm();
            }}
            error={Boolean(formErrors[item.inputLabel])}
            helperText={formErrors[item.inputLabel]}
          />
        );
      case "single_line":
        return (
          <TextField
            type="text"
            label={item.inputLabel}
            variant="outlined"
            fullWidth
            value={formData[item.inputLabel]}
            onChange={(e) => {
              setFormData({
                ...formData,
                [item.inputLabel]: e.target.value,
              });
              if (formSubmitted) validateForm();
            }}
            error={Boolean(formErrors[item.inputLabel])}
            helperText={formErrors[item.inputLabel]}
          />
        );
      case "alphabets":
        return (
          <TextField
            type="text"
            label={item.inputLabel}
            variant="outlined"
            fullWidth
            value={formData[item.inputLabel]}
            onChange={(e) => {
              if (e.target.value === "" || alphabetRegex.test(e.target.value)) {
                setFormData({
                  ...formData,
                  [item.inputLabel]: e.target.value,
                });
              }
              if (formSubmitted) validateForm();
            }}
            error={Boolean(formErrors[item.inputLabel])}
            helperText={formErrors[item.inputLabel]}
          />
        );
      case "multiline_text":
        return (
          <TextField
            type="text"
            label={item.inputLabel}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={formData[item.inputLabel]}
            onChange={(e) => {
              setFormData({
                ...formData,
                [item.inputLabel]: e.target.value,
              });
              if (formSubmitted) validateForm();
            }}
            error={Boolean(formErrors[item.inputLabel])}
            helperText={formErrors[item.inputLabel]}
          />
        );
      case "numbers":
        return (
          <TextField
            type="text"
            label={item.inputLabel}
            variant="outlined"
            fullWidth
            value={formData[item.inputLabel]}
            onChange={(e) => {
              if (e.target.value === "" || numberRegex.test(e.target.value)) {
                setFormData({
                  ...formData,
                  [item.inputLabel]: e.target.value,
                });
              }
              if (formSubmitted) validateForm();
            }}
            error={Boolean(formErrors[item.inputLabel])}
            helperText={formErrors[item.inputLabel]}
          />
        );

      default:
        break;
    }
  };

  const validateForm = (checkIsValid) => {
    let errors = {};
    Object.entries(formData).forEach(([key, val]) => {
      if (val) {
        errors[key] = "";
      } else {
        errors[key] = "Required Field";
      }
    });
    setFormErrors(errors);
    if (checkIsValid) {
      checkIsValid(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitted === false) setFormSubmitted(true);

    const checkIsValid = (errors) => {
      let valid = !Object.values(errors).some((x) => x !== "");
      if (valid) {
        dispatch(setFormValues(formData));
        handleDialog(true);
      }
    };

    validateForm(checkIsValid);
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      {formData != null && (
        <Box p={3} style={{ background: "#fff", borderRadius: ".5em" }}>
          <Typography style={{ marginBottom: "0.5em" }} variant="h6">
            Payment Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="customer_name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                  if (formSubmitted) {
                    validateForm();
                  }
                }}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  });
                  if (formSubmitted) {
                    validateForm();
                    if (!emailRegex.test(e.target.value)) {
                      setFormErrors((prevFormData) => ({
                        ...prevFormData,
                        email: "Enter a valid Email",
                      }));
                    }
                  }
                }}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="tel"
                label="Phone"
                variant="outlined"
                fullWidth
                value={formData.phone}
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    numberRegex.test(e.target.value)
                  ) {
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    });
                  }
                  if (formSubmitted) {
                    validateForm();
                    if (!mobRegex.test(e.target.value)) {
                      setFormErrors((prevFormData) => ({
                        ...prevFormData,
                        phone: "Enter a valid Phone Number",
                      }));
                    }
                  }
                }}
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="building_no"
                label="Building No"
                variant="outlined"
                fullWidth
                value={formData.building_no}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    building_no: e.target.value,
                  });
                  if (formSubmitted) {
                    validateForm();
                  }
                }}
                error={Boolean(formErrors.building_no)}
                helperText={formErrors.building_no}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="street_name"
                label="Street Name"
                variant="outlined"
                fullWidth
                value={formData.street_name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    street_name: e.target.value,
                  });
                  if (formSubmitted) {
                    validateForm();
                  }
                }}
                error={Boolean(formErrors.street_name)}
                helperText={formErrors.street_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="landmark"
                label="Landmark"
                variant="outlined"
                fullWidth
                value={formData.landmark}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    landmark: e.target.value,
                  });
                  if (formSubmitted) {
                    validateForm();
                  }
                }}
                error={Boolean(formErrors.landmark)}
                helperText={formErrors.landmark}
              />
            </Grid>

            {inputData.map((item, index) => (
              <Grid key={index} item xs={12}>
                {renderInputs(item)}
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                fullWidth
                style={{ paddingTop: "12px", paddingBottom: "12px" }}
              >
                Pay ₹{orderTotal}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* <h3>Values:</h3>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <h3>Errors:</h3>
      <pre>{JSON.stringify(formErrors, null, 2)}</pre>
      <h3>Formdata:</h3>
      <pre>{JSON.stringify(formData, null, 2)}</pre> */}
    </form>
  );
}
