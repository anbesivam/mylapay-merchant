import { Box, Button, Grid, MenuItem, TextField, Paper, Typography } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";

export default function CheckApproxPrice({ handleDialog, handleInput }) {

  const validationSchema = yup.object({
    length: yup
      .number("Enter a valid length")
      .min(1)
      .required("Required Field"),
    breadth: yup
      .number("Enter a valid breadth")
      .min(1)
      .required("Required Field"),
    height: yup
      .number("Enter a valid height")
      .min(1)
      .required("Required Field"),
    weight: yup
      .number("Enter a valid weight")
      .min(1)
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
      //handleDialog(false);
    },
  });

  const handleDimensionChange = () => {
   formik.handleSubmit();
  }

  let handleLengthChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("length",e.target.value);
      // if(e.target.value !== ""){
      //   handleDimensionChange();  
      // }
    }
  }
  let handleBreadthChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("breadth",e.target.value);
      // if(e.target.value !== ""){
      //   handleDimensionChange();  
      // }
    }
  }
  let handleHeightChange = (e) => {
    console.log(e.target.value);
    if((e.target.value.length <= 3 && e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("height",e.target.value);
      // if(e.target.value !== ""){
      //   handleDimensionChange();  
      // }
    }
  }

  let handleWeightChange = (e) => {
    console.log(e.target.value);
    if((e.target.value > 0) || e.target.value === ""){
      formik.setFieldValue("weight",e.target.value);
      // if(e.target.value !== ""){
      //   handleDimensionChange();  
      // }
    }
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box mb={2}>
            <TextField
              label="Length"
              variant="outlined"
              fullWidth
              size="small"
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
              label="Height in cm"
              variant="outlined"
              size="small"
              fullWidth
              name="height"
              type="number"
              value={formik.values.height}
              onChange={handleHeightChange}
              error={formik.touched.height && Boolean(formik.errors.height)}
              helperText={formik.touched.height && formik.errors.height}
            />

          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box mb={2}>
              <TextField
                label="Breadth in cm"
                variant="outlined"
                size="small"
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
              label="Weight in gms"
              variant="outlined"
              size="small"
              fullWidth
              name="weight"
              type="number"
              value={formik.values.weight}
              onChange={handleWeightChange}
              error={formik.touched.weight && Boolean(formik.errors.weight)}
              helperText={formik.touched.weight && formik.errors.weight}
            />
          </Box>
        </Grid>

        <Grid item xs={8}>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              disableElevation
              size="medium"
              fullWidth
              style={{ color: "#fff" }}
              disabled={
                formik.values.length === "" || 
                formik.values.breadth === "" ||
                formik.values.height === "" ||
                formik.values.weight === ""
              }
              onClick={handleDimensionChange}
            >
            Select Courier
          </Button>
        </Grid>

        
      </Grid>

        
          {/* <Box flexGrow={1} ml={2}>Package Dimension</Box>
          
          <Box pt={2} display="flex">
             
            <Box maxWidth="15%" ml={2}>
              <TextField
                label="Length in cm"
                variant="outlined"
                size="small"
                fullWidth
                type="number"
                name="length"
                value={formik.values.length}
                onChange={handleLengthChange}
                error={formik.touched.length && Boolean(formik.errors.length)}
                helperText={formik.touched.length && formik.errors.length}
              />
            </Box>
            <Box maxWidth="15%" mb={2} ml={2}>
              <TextField
                label="Breadth in cm"
                variant="outlined"
                size="small"
                fullWidth
                name="breadth"
                type="number"
                value={formik.values.breadth}
                onChange={handleBreadthChange}
                error={formik.touched.breadth && Boolean(formik.errors.breadth)}
                helperText={formik.touched.breadth && formik.errors.breadth}
              />
            </Box>

            <Box maxWidth="15%" ml={2}>
              <TextField
                label="Height in cm"
                variant="outlined"
                size="small"
                fullWidth
                name="height"
                type="number"
                value={formik.values.height}
                onChange={handleHeightChange}
                error={formik.touched.height && Boolean(formik.errors.height)}
                helperText={formik.touched.height && formik.errors.height}
              />
            </Box>

            <Box maxWidth="15%" ml={2}>
              <TextField
                label="Weight in gms"
                variant="outlined"
                size="small"
                fullWidth
                name="weight"
                type="number"
                value={formik.values.weight}
                onChange={handleWeightChange}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
              />
            </Box>

            <Box maxWidth="20%" height="40px" ml={2}>
              <Button
                  type="button"
                  variant="contained"
                  size="medium"
                  color="primary"
                  disabled={
                    formik.values.length === "" || 
                    formik.values.breadth === "" ||
                    formik.values.height === "" ||
                    formik.values.weight === ""
                  }
                  onClick={handleDimensionChange}
                >
                Select Courier
              </Button>
            </Box>  
            
          </Box> */}

      </form>
    </>
  );
}
