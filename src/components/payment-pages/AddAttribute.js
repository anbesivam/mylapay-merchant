import React from "react";
import { Dialog } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";
import { DialogContent } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Add, Close, Done } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { DialogContentText } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { FieldArray, Form, Formik, getIn } from "formik";
import * as Yup from "yup";

export default function AddAttribute({
  attributesDialog,
  setAttributesDialog,
  formik,
  attrArray,
}) {
  const validationSchema = Yup.object().shape({
    attributes: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required("Required Field"),
        value: Yup.string().required("Required Field"),
      })
    ),
  });

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={attributesDialog}>
        <DialogTitle>
          Add a new attribute
          <IconButton
            style={{ position: "absolute", right: "0", top: "0" }}
            aria-label="Close"
            onClick={() => {
              setAttributesDialog(false);
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>

          <Formik
            initialValues={{
              attributes:
                attrArray && attrArray.length > 0
                  ? attrArray
                  : [
                      {
                        label: "",
                        value: "",
                      },
                    ],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              formik.setFieldValue("attributes", values.attributes);
              setAttributesDialog(false);
            }}
          >
            {({ values, touched, errors, handleChange, isValid }) => (
              <Form noValidate autoComplete="off">
                <FieldArray name="attributes">
                  {({ push, remove }) => (
                    <Grid container spacing={2}>
                      {values.attributes.map((p, index) => {
                        const label = `attributes[${index}].label`;
                        const touchedLabel = getIn(touched, label);
                        const errorLabel = getIn(errors, label);

                        const value = `attributes[${index}].value`;
                        const touchedValue = getIn(touched, value);
                        const errorValue = getIn(errors, value);

                        return (
                          <React.Fragment key={index}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                label="Label"
                                name={label}
                                value={p.label}
                                required
                                helperText={
                                  touchedLabel && errorLabel ? errorLabel : ""
                                }
                                error={Boolean(touchedLabel && errorLabel)}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                label="Value"
                                name={value}
                                value={p.value}
                                required
                                helperText={
                                  touchedValue && errorValue ? errorValue : ""
                                }
                                error={Boolean(touchedValue && errorValue)}
                                onChange={handleChange}
                              />
                            </Grid>

                            <Grid item xs={12} md={1}>
                              <IconButton
                                className="red-text"
                                onClick={() => remove(index)}
                              >
                                <Close />
                              </IconButton>
                            </Grid>
                          </React.Fragment>
                        );
                      })}
                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          py={2}
                        >
                          <Button
                            type="button"
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() =>
                              push({
                                label: "",
                                value: "",
                              })
                            }
                          >
                            Add
                          </Button>
                          <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            endIcon={<Done />}
                            // disabled={!isValid || values.people.length === 0}
                          >
                            Save
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </FieldArray>

                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}
