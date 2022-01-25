import { Box, AppBar, Tab, Tabs } from "@material-ui/core";
import { AddAlert, DepartureBoard } from "@material-ui/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import WebPageLinkImageUpload from "./WebPageLinkImageUpload";
import LinesEllipsis from "react-lines-ellipsis";
import Swal from "sweetalert2";
import {
  setPaymentPageDetails,
  setWebPageDetails,
} from "../../redux/paymentWebPageSlice";
// import { setShopDetails, setiShop } from "../../redux/paymentPageSlice";
import { useHistory } from "react-router-dom";
import { Alert, Autocomplete } from "@material-ui/lab";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import _ from "lodash";

import Active from "./active";
import InActive from "./inactive";

export default function WebPageLinks({ webPageId, stepChange }) {
  const [productArray, setProductArray] = useState([]);
  const [alert] = React.useState(null);
  const paymentPageDetails = useSelector(
    (state) => state.paymentWebPage.paymentPageDetails
  );
  const [value, setValue] = React.useState();
  const [productgst, setProductgst] = useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [iProduct, setiProduct] = useState(0);
  // console.log("paymentPageDetails");
  // console.log(paymentPageDetails);
  const webPageDetails = useSelector(
    (state) => state.paymentWebPage.webPageDetails
  );

  const iShop = useSelector((state) => state.paymentPage.iShop);

  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { REACT_APP_SHOP_URL } = process.env;
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const [debouncedState, setDebouncedState] = useState("");
  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
  };

  const getproductgst = async (newValue) => {
    await axios
      .get("/mylapay/shop/product_gst")
      .then((response) => {
        if (response.data.success === 1) {
          setProductgst(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (paymentPageDetails == null || paymentPageDetails.length < 1) return;
    setProductArray(paymentPageDetails);
    getproductgst();
  }, [paymentPageDetails]);

  const getProductList = async () => {
    if (webPageId != null) {
      await axios
        .get(`mylapay/shop/product_details?iShop=${webPageId}`)
        .then(async (res) => {
          if (res.data.status) {
            const prodDetails = await Promise.all(
              res.data.data.map(async (item) => {
                let imageFile = await createFileFromUrl(
                  `${REACT_APP_SHOPAPI_URL}/uploads${item.product_image}`,
                  item.file_name
                );
                return {
                  ...item,
                  product_image: imageFile,
                };
              })
            );
            setProductArray(prodDetails);
            dispatch(setPaymentPageDetails(prodDetails));
          } else {
            // console.log(res.data);
            toast.error("Something went wrong while fetching products");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong while fetching products");
        });
    } else {
      await axios
        .get(`mylapay/shop/product_details?iShop=${iShop}`)
        .then(async (res) => {
          if (res.data.status) {
            const prodDetails = await Promise.all(
              res.data.data.map(async (item) => {
                let imageFile = await createFileFromUrl(
                  `${REACT_APP_SHOPAPI_URL}/uploads${item.product_image}`,
                  item.file_name
                );
                return {
                  ...item,
                  product_image: imageFile,
                };
              })
            );
            setProductArray(prodDetails);
            dispatch(setPaymentPageDetails(prodDetails));
          } else {
            // console.log(res.data);
            toast.error("Something went wrong while fetching products");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong while fetching products");
        });
    }
  };

  useEffect(() => {
    getproductgst();
    getProductList();
  }, []);

  const deleteProduct = (iProduct) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "primary",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // let payload = productArray.filter((item, index) => index !== iProduct);
        // setProductArray(payload);
        deleteApiCall(iProduct);
      }
    });
  };

  const deleteApiCall = async (iProduct) => {
    if (!iProduct) return;
    await axios
      .delete("/mylapay/shop/product_details", { data: { iProduct } })
      .then((res) => {
        if (res.data.status) {
          toast.success("Product Deleted Successfully!");
          getProductList();
        } else {
          toast.error("Something went wrong, Please try again");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again");
        console.log(error);
      });
  };
  const editProduct = (editIndex) => {
    let curProduct = Object.assign({}, productArray[editIndex]);
    curProduct.index = editIndex;
    productgst.map((option) => {
      if (option.iGst == curProduct["iGst"]) {
        // console.log("Event match : " + JSON.stringify(option.iGst));
        // setiProductcategory(option.iGst);
        // formik.setFieldValue("gst", JSON.stringify(newValue));

        setValue(option.Gst_Percentage + " %");
        setInputValue(option.Gst_Percentage + " %");
      }
    });
    // console.log(curProduct.convenience_fee);

    setiProduct(curProduct.id);
    formik.resetForm({ values: curProduct });
  };

  const nextStep = async () => {
    setLoading(true);
    setError(false);
    history.push("/payment-web-page");
    // const formData = new FormData();
    // formData.append("webpageName", webPageDetails.name);
    // formData.append("webpageUrl", webPageDetails.url);
    // formData.append("webpageImage", webPageDetails.logo);

    // if (webPageId) formData.append("iShop", webPageId);

    // let t = paymentPageDetails.map((item) => {
    //   return {
    //     product_name: item.product_name,
    //     prodDescription: item.prodDescription,
    //     price: item.price,
    //     product_image: item.product_image.name,
    //   };
    // });
    // formData.append("productDetails", JSON.stringify(t));
    // console.log(t);

    // paymentPageDetails.forEach((item, i) => {
    //   formData.append(`product_image_${i}`, item.product_image);
    // });

    // await axios
    //   .post("/mylapay/shop/payment_page", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((response) => {
    //     if (response.data.status === 1) {
    //       dispatch(setPaymentPageDetails(null));
    //       dispatch(setWebPageDetails(null));
    //       setLoading(false);
    //       history.push("/payment-web-page");
    //     } else {
    //       setError(true);
    //       setErrorMsg(response.data.data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const validationSchema = yup.object({
    product_name: yup.string().required("Name is required"),
    prodDescription: yup.string().required("Description is required"),
    product_image: yup.mixed().required("Image is required"),
    convenience_fee: yup.number().min(0).required("This field is required"),
    price: yup
      .number()
      .typeError("Enter a valid amount")
      .positive("Enter a valid amount"),
  });

  const formik = useFormik({
    initialValues: {
      index: null,
      product_name: "",
      prodDescription: "",
      product_image: null,
      price: "",
      iGst: null,
      Gst_Percentage: null,
      attributes: [],
      convenience_fee: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveProduct(values);
    },
  });
  const handleConvenienceFee = (event) => {
    //max 2 percentage
    if (event.target.value <= 2 && event.target.value >= 0) {
      debounce(event.target.value);

      formik.setFieldValue("convenience_fee", event.target.value);
    } else {
      formik.setFieldValue("convenience_fee", "");
    }
  };
  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedState(_searchVal);
      // send the server request here
    }, 1000),
    []
  );
  const saveProduct = async (values) => {
    setLoading(true);
    let payload = Object.assign({}, values);
    delete payload.product_image;

    delete payload.index;
    delete payload.file_name;
    payload.attributes = JSON.stringify(values.attributes);

    if (values.filters != undefined) {
      payload.filters = JSON.stringify(values.filters);
    }

    const formData = new FormData();
    //Object.keys(payload).forEach((key) => formData.append(key, payload[key]));

    if (webPageId != null) {
      formData.append("iShop", webPageId);
    } else {
      formData.append("iShop", iShop);
    }

    formData.append("product_name", values.product_name);
    formData.append("price", values.price);
    formData.append("prodDescription", values.prodDescription);
    formData.append("iGst", values.iGst);
    formData.append("Gst_Percentage", values.Gst_Percentage);
    formData.append("convenienceFee", values.convenience_fee);

    formData.append(`file_0`, values.product_image);

    if (values.id) formData.append("id", values.id);

    await axios
      .post("mylapay/shop/product_details", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status) {
          toast.success("Product Saved!");

          getProductList();
          setValue();
          setInputValue("");

          formik.resetForm({
            values: {
              index: null,
              product_name: "",
              prodDescription: "",
              product_image: null,
              price: "",
              iGst: null,
              Gst_Percentage: null,
              attributes: [],
              convenience_fee: "",
            },
          });
        } else {
          toast.error("Error: " + JSON.stringify(res.data));
        }
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again");
        console.log(error);
      });
    setLoading(false);
  };
  const setFile = (e, elName) => {
    formik.setFieldValue(elName, e.currentTarget.files[0]);
  };

  /* Tab concept starts here */

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Active />;
      case 1:
        return <InActive />;

      default:
        return <Active />;
    }
  };

  /* Tab concept ends here */

  return (
    <>
      <Box
        style={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "0px",
          borderRadius: "4px",
        }}
        m={2}
      >
        <AppBar position="static">
          <Tabs value={activeTab} onChange={handleChange}>
            <Tab icon={<AddAlert />} label="Active" />
            <Tab icon={<DepartureBoard />} label="In-Active" />
          </Tabs>
        </AppBar>
        {getTabContent()}
      </Box>

      {/* <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <form onSubmit={formik.handleSubmit}>
            <Box p={4} style={{ background: "#fff", borderRadius: ".5em" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <WebPageLinkImageUpload
                    id="product_image"
                    name="product_image"
                    value={formik.values.product_image}
                    setfile={setFile}
                    error={
                      formik.touched.product_image &&
                      Boolean(formik.errors.product_image)
                    }
                    helperText={
                      formik.touched.product_image &&
                      formik.errors.product_image
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Payment Page Name"
                    variant="outlined"
                    fullWidth
                    name="product_name"
                    value={formik.values.product_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.product_name &&
                      Boolean(formik.errors.product_name)
                    }
                    helperText={
                      formik.touched.product_name && formik.errors.product_name
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Autocomplete
                      value={value}
                      style={{ flexGrow: 1 }}
                      getOptionLabel={(option) => option.Gst_Percentage + " %"}
                      onChange={(event, newValue) => {
                        console.log("newValue : " + JSON.stringify(newValue));

                        if (newValue != null) {
                          setValue(newValue.Gst_Percentage + " %");
                          formik.setFieldValue("iGst", newValue.iGst);
                          formik.setFieldValue(
                            "Gst_Percentage",
                            newValue.Gst_Percentage
                          );
                        }
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        console.log(
                          "newInputValue : " + JSON.stringify(newInputValue)
                        );
                        setInputValue(newInputValue);
                      }}
                      id="controllable-states-demo"
                      options={productgst}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="GST"
                          variant="outlined"
                          error={
                            formik.touched.gst && Boolean(formik.errors.gst)
                          }
                          helperText={formik.touched.gst && formik.errors.gst}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Payment Page Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    name="prodDescription"
                    value={formik.values.prodDescription}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.prodDescription &&
                      Boolean(formik.errors.prodDescription)
                    }
                    helperText={
                      formik.touched.prodDescription &&
                      formik.errors.prodDescription
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Convenience Fee(Max 2%)"
                    variant="outlined"
                    fullWidth
                    rows={3}
                    type="number"
                    name="convenience_fee"
                    value={formik.values.convenience_fee}
                    onChange={(e) => {
                      handleConvenienceFee(e);
                      formik.setFieldTouched("convenience_fee");
                    }}
                    error={
                      formik.touched.convenience_fee &&
                      Boolean(formik.errors.convenience_fee)
                    }
                    helperText={
                      formik.touched.convenience_fee &&
                      formik.errors.convenience_fee
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Amount"
                    variant="outlined"
                    fullWidth
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onBlur={formik.handleChange}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldTouched("price");
                    }}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={
                      formik.touched.price && formik.errors.price
                        ? formik.errors.price
                        : "Amount is optional, If you do not enter the customer will be able to enter their own amount"
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    {formik.values.index === null
                      ? "Add Payment Page"
                      : "Save Payment Page"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Grid>
        <Grid item xs={12} md={8}>
          {paymentPageDetails && paymentPageDetails.length > 0 ? (
            <Grid container spacing={2}>
              {paymentPageDetails.map((product, index) => (
                <Grid key={index} item xs={12}>
                  <Box
                    style={{
                      overflow: "hidden",
                      display: "flex",
                      width: "100%",
                      background: "#fff",
                      borderRadius: "1em",
                    }}
                  >
                    {product.product_image != null ? (
                      <img
                        src={URL.createObjectURL(product.product_image)}
                        alt={product.product_name}
                        height="150px"
                        width="150px"
                      />
                    ) : (
                      <img
                        src="/images/no-image-icon-23494.png"
                        height="150px"
                        width="150px"
                      />
                    )}
                    
                    <Box
                      p={2}
                      display="flex"
                      flexDirection="column"
                      width="100%"
                    >
                      <Typography variant="h5" style={{ fontWeight: "normal" }}>
                        {product.product_name}
                      </Typography>

                      <Typography component="div" variant="body2">
                        <LinesEllipsis
                          text={product.prodDescription}
                          maxLine="3"
                          ellipsis="..."
                          trimRight
                        />
                      </Typography>
                    </Box>
                    <Box
                      p={2}
                      style={{
                        marginLeft: "auto",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography style={{ color: "#9e9e9e" }} variant="body2">
                        Price
                      </Typography>
                      {product.price ? (
                        <Typography variant="h5" gutterBottom>
                          ₹{product.price}
                        </Typography>
                      ) : (
                        <Typography variant="body1" gutterBottom>
                          User Input
                        </Typography>
                      )}

                      <Box
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "0.5em",
                          marginTop: "auto",
                          alignSelf: "flex-end",
                        }}
                      >
                        {product.id && (
                          <>
                            <CopyToClipboard
                              text={`${REACT_APP_SHOP_URL}/payment-webpage/${webPageDetails.shop_url}/${product.id}`}
                              onCopy={() => toast.success("Link Copied!")}
                            >
                              <Tooltip title="Copy Link">
                                <Button
                                  style={{
                                    minWidth: "50px",
                                  }}
                                  color="primary"
                                  size="small"
                                  variant="contained"
                                  disableElevation
                                >
                                  <FileCopy fontSize="small" />
                                </Button>
                              </Tooltip>
                            </CopyToClipboard>
                          </>
                        )}
                        <Tooltip title="Edit">
                          <Button
                            style={{
                              backgroundColor: "var(--mp-light-blue)",
                              color: "#fff",
                              minWidth: "50px",
                            }}
                            size="small"
                            variant="contained"
                            disableElevation
                            onClick={() => editProduct(index)}
                          >
                            <Edit fontSize="small" />
                          </Button>
                        </Tooltip>
                        {alert}
                        <Tooltip title="Delete">
                          <Button
                            style={{
                              marginTop: "auto",
                              backgroundColor: "#f44336",
                              color: "#fff",
                              minWidth: "50px",
                            }}
                            size="small"
                            variant="contained"
                            disableElevation
                            onClick={() => deleteProduct(product.id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              p={2}
              py={5}
              style={{
                background: "#fff",
                borderRadius: ".5em",
                textAlign: "center",
              }}
            >
              <Typography variant="body1">No products added yet...</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      <Collapse in={error}>
        <Box mt={2}>
          <Alert severity="error">{errorMsg}</Alert>
        </Box>
      </Collapse>

      <Box mt={2} style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={() => {
            stepChange(0);
          }}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          endIcon={loading ? <CircularProgress size={16} /> : <ArrowForward />}
          disabled={loading}
          onClick={() => {
            nextStep();
          }}
        >
          Publish
        </Button>
      </Box> */}
    </>
  );
}

/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */
