import { TextField } from "@material-ui/core";
import React from "react";

export default function DocTextField({ formik, itemName, ...rest }) {
  return (
    <>
      <TextField
        {...rest}
        variant="outlined"
        fullWidth
        id={itemName}
        name={itemName}
        value={formik.values[itemName]}
        onChange={formik.handleChange}
        error={formik.touched[itemName] && Boolean(formik.errors[itemName])}
        helperText={formik.touched[itemName] && formik.errors[itemName]}
      />
    </>
  );
}
