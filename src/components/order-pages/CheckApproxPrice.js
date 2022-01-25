import { Box, Button, Grid, MenuItem, TextField, Paper } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";

export default function CheckApproxPriceInline({ handleDialog, handleInput }) {

  const validationSchema = yup.object({
    length: yup
      .number("Enter a valid length")
      .required("Required Field"),
    breadth: yup
      .number("Enter a valid breadth")
      .required("Required Field"),
    height: yup
      .number("Enter a valid height")
      .required("Required Field"),
    weight: yup
      .number("Enter a valid weight")
      .required("Required Field"),
  });

  const formik = useFormik({
    initialValues: {
      length: "",
      breadth: "",
      height: "",
      weight: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleInput(values);
      handleDialog(false);
    },
  });

  let handleLengthChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("length",e.target.value);
    }
  }
  let handleBreadthChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("breadth",e.target.value);
    }
  }
  let handleHeightChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("height",e.target.value);
    }
  }

  let handleWeightChange = (e) => {
    console.log(e.target.value);
    if((e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("weight",e.target.value);
    }
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={0}>

          <Box maxWidth="550px" mx="auto" p={1} >

            
            <Box flexGrow={1} mb={2}>Package Dimension</Box>
             
            <Box mb={2}>
              <TextField
                label="Length"
                variant="outlined"
                fullWidth
                type="number"
                name="length"
                value={formik.values.length}
                onChange={handleLengthChange}
                error={formik.touched.length && Boolean(formik.errors.length)}
                helperText={formik.touched.length && formik.errors.length}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Breadth"
                variant="outlined"
                fullWidth
                name="breadth"
                type="number"
                value={formik.values.breadth}
                onChange={handleBreadthChange}
                error={formik.touched.breadth && Boolean(formik.errors.breadth)}
                helperText={formik.touched.breadth && formik.errors.breadth}
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Height"
                variant="outlined"
                fullWidth
                name="height"
                type="number"
                value={formik.values.height}
                onChange={handleHeightChange}
                error={formik.touched.height && Boolean(formik.errors.height)}
                helperText={formik.touched.height && formik.errors.height}
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Weight in Gms"
                variant="outlined"
                fullWidth
                name="weight"
                type="number"
                value={formik.values.weight}
                onChange={handleWeightChange}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
              />
            </Box>

            <Box mb={2}>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Rs"
                disabled
              />
            </Box>

            <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={formik.handleSubmit}
              >
              Select Courier
            </Button>
            
          </Box>

        </Paper>
      </form>
    </>
  );
}
