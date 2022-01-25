import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import { Close, Done } from "@material-ui/icons";
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";

export default function AddNewInputField({ handleDialog, handleInput }) {
  const validationSchema = yup.object({
    inputLabel: yup
      .string("Enter a label for the field")
      .required("Enter a label for the field"),
    inputType: yup
      .string("Please select a type")
      .required("Please select a type"),
  });

  const formik = useFormik({
    initialValues: {
      inputLabel: "",
      inputType: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleInput(values);
      handleDialog(false);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Input Label"
              name="inputLabel"
              value={formik.values.inputLabel}
              onChange={formik.handleChange}
              error={
                formik.touched.inputLabel && Boolean(formik.errors.inputLabel)
              }
              helperText={formik.touched.inputLabel && formik.errors.inputLabel}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Select Input Type"
              name="inputType"
              select
              value={formik.values.inputType}
              onChange={formik.handleChange}
              error={
                formik.touched.inputType && Boolean(formik.errors.inputType)
              }
              helperText={formik.touched.inputType && formik.errors.inputType}
            >
              <MenuItem value="single_line">Single Line Text</MenuItem>
              <MenuItem value="alphabets">Alphabets</MenuItem>
              <MenuItem value="alphanumeric">Alphanumeric</MenuItem>
              <MenuItem value="multiline_text">Multiline Text</MenuItem>
              <MenuItem value="numbers">Numbers</MenuItem>
            </TextField>
          </Grid>
          <Grid item md={12}>
            <Box py={2} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Close />}
                onClick={() => {
                  handleDialog(false);
                }}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<Done />}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
