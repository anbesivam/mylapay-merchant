import React, { useEffect, useState } from "react";
import {
  Dialog,
  Tabs,
  Tab,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTitle } from "@material-ui/core";
import { DialogContent } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { DialogContentText } from "@material-ui/core";
import { Box } from "@material-ui/core";
import axios from "axios";
import { useFormik } from "formik";

export default function ProductFilters({
  filterDialog,
  setFilterDialog,
  formik,
  iProduct,
}) {
  const [value, setValue] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [masterArray, setMasterArray] = useState([]);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabIndex(newValue);
  };

  const saveFilterData = () => {
    let selectedArray = [];
    masterArray.map((ab, abIndex) => {
      ab["filterData"].map((abc, abcIndex) => {
        if (abc.isChecked == 1) {
          let selectedTabId = masterArray[abIndex].iFilter_Cloths;
          let selectedTabName = masterArray[abIndex].Filter_Name;
          var tabCheck = selectedArray.findIndex(
            (x) => x.iFilter_Cloths == selectedTabId
          );
          tabCheck === -1 &&
            selectedArray.push({
              iFilter_Cloths: selectedTabId,
              Filter_Name: selectedTabName,
            });

          selectedArray.filter((a, aIndex) => {
            if (a.iFilter_Cloths === selectedTabId) {
              if (a["filterData"]) {
                var checkBoxCheck = a["filterData"].findIndex(
                  (x) => x.iFilter_Data == abc.iFilter_Data
                );
                if (checkBoxCheck === -1) {
                  selectedArray[aIndex]["filterData"].push({
                    iFilter_Data: abc["iFilter_Data"],
                    isChecked: 1,
                  });
                } else {
                  selectedArray["filterData"].filter((b, bIndex) => {
                    if (b.iFilter_Data == abc["iFilter_Data"]) {
                      selectedArray["isChecked"] = 1;
                    }
                  });
                }
              } else {
                selectedArray[aIndex]["filterData"] = [
                  {
                    iFilter_Data: abc["iFilter_Data"],
                    isChecked: 1,
                  },
                ];
              }
            }
          });
        }
      });
    });
    //console.log("temp arrya == ", selectedArray);
    setMasterArray([]);
    setTabIndex(0);
    // if (iProduct || iProduct !== 0) {
    //   const getCheckBoxData = async () => {
    //     await axios
    //       .put(`/mylapay/shop/cloth_filter`, {
    //         iProduct: iProduct,
    //         selectedArray: selectedArray,
    //       })
    //       .then((response) => {
    //         if (response.data.status === 1) {
    //           if (!isMounted) return;
    //           setMasterArray(response.data.data);
    //         }
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   };
    //   getCheckBoxData();
    // } else {
    formik.setFieldValue("filters", selectedArray);
    // }
    setFilterDialog(false);
  };
  const handleCheckboxChange = (event, value, index) => {
    let selectedTabId = masterArray[tabIndex].iFilter_Cloths;

    let tempArr = [];
    tempArr = masterArray.map((ab, abIndex) => {
      if (ab.iFilter_Cloths === selectedTabId) {
        ab["filterData"].map((abc, abcIndex) => {
          if (abcIndex === index) {
            if (event.target.checked) {
              abc["isChecked"] = 1;
            } else {
              abc["isChecked"] = 0;
            }
          }
          return abc;
        });
      }
      return ab;
    });

    setMasterArray(tempArr);
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  useEffect(() => {
    console.log(iProduct);
    let isMounted = true;
    const getCheckBoxData = async () => {
      await axios
        .get(`/mylapay/shop/cloth_filter?iProduct=${iProduct}`)
        .then((response) => {
          if (response.data.status === 1) {
            if (!isMounted) return;
            setMasterArray(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getCheckBoxData();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iProduct, filterDialog]);

  return (
    <>
      {masterArray.length > 0 && (
        <Dialog open={filterDialog} maxWidth="md">
          <DialogTitle>
            Select Product Specifications
            <IconButton
              style={{ position: "absolute", right: "0", top: "0" }}
              aria-label="Close"
              onClick={() => {
                setFilterDialog(false);
                setTabIndex(0);
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ width: "800px" }}>
            {/* <pre>{JSON.stringify(masterArray, null, 2)}</pre> */}
            <DialogContentText
              style={{ marginBottom: "2em" }}
            ></DialogContentText>
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: "background.paper",
                display: "flex",
                height: 224,
              }}
            >
              <>
                <Grid container item>
                  <Grid xs={2}>
                    {masterArray.map((item, i) => (
                      <Tabs
                        style={{
                          marginRight: "10px",
                        }}
                        orientation="vertical"
                        variant="scrollable"
                        value={tabIndex}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: "divider" }}
                      >
                        <Tab
                          label={item.Filter_Name}
                          value={i}
                          {...a11yProps(i)}
                        />
                      </Tabs>
                    ))}
                  </Grid>
                  <Grid xs={10}>
                    {masterArray[tabIndex].filterData.map(
                      (checkBoxItem, checkBoxIndex) => (
                        <TabPanel value={checkBoxIndex} index={checkBoxIndex}>
                          <FormGroup
                            style={{
                              float: "left",
                              width: "25%",
                            }}
                          >
                            <FormControlLabel
                              display="flex"
                              control={
                                <Checkbox
                                  checked={
                                    checkBoxItem.isChecked == 1 ? true : false
                                  }
                                  onChange={(event) => {
                                    handleCheckboxChange(
                                      event,
                                      value,
                                      checkBoxIndex
                                    );
                                  }}
                                />
                              }
                              label={checkBoxItem.Filter_Data}
                            />
                          </FormGroup>
                        </TabPanel>
                      )
                    )}
                  </Grid>
                </Grid>
              </>
            </Box>
            <Box mt={2} style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() => {
                  //formik.setFieldValue("filters", selectedArray);
                  //setFilterDialog(false);
                  saveFilterData();
                }}
              >
                Submit
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
