import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  CircularProgress,
  Slide,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import {
  Add,
  Visibility,
  ArrowBack,
  ArrowForward,
  Close,
  Help,
  DeleteOutline,
  Done,
  Edit,
} from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";

import React, { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
// import ProductFileUpload from "./ProductFileUpload";
import WebPageLinkImageUpload from "./WebPageLinkImageUpload";
import styles from "./css/AddNewProduct.module.css";
import { Link } from "react-router-dom";
import _ from "lodash";
import AddNewInputField from "./AddNewInputField";
import { setPaymentDetails } from "../../redux/paymentWebPageSlice";
import Swal from "sweetalert2";

export default function AddNewProduct({
  setShowNewPrdDialog,
  getProductList,
  editId,
  paymentiShop,
  setEditId,
  createFileFromUrl,
}) {
  const [shopCategories, setShopCategories] = useState([]);
  const [productgst, setProductgst] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pervalue, setValue] = React.useState(1);
  const [inputValue, setInputValue] = React.useState("");
  const [iProductcategory, setiProductcategory] = useState(0);
  const [iProduct, setiProduct] = useState(0);
  const [productlist, setproductlist] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attributesDialog, setAttributesDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [alert] = React.useState(null);
  const productDetails = useSelector(
    (state) => state.paymentPage.productDetails
  );
  const paymentDetails = useSelector(
    (state) => state.paymentWebPage.paymentDetails
  );

  // console.log("webPageDetails Add Product : " + JSON.stringify(webPageDetails));

  const iShop = useSelector((state) => state.paymentPage.iShop);
  const [productNames, setProductNames] = useState([]);
  const [productNameDialog, setProductNameDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryDialogedit, setcategoryDialogedit] = useState(false);
  const [categoryDialogview, setcategoryDialogview] = useState(false);
  const [filterFlag, setFilterFlag] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  const [imageDialogObj, setImageDialogObj] = useState(null);
  const [searchNamesList, setSearchNamesList] = useState([]);
  const dispatch = useDispatch();
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [testString, setTestString] = useState(false);

  const [debouncedState, setDebouncedState] = useState("");

  const validationSchema = yup.object({
    product_name: yup.string().required("Name is required"),
    prodDescription: yup.string().required("Description is required"),
    product_image: yup.mixed().required("Image is required"),
    convenience_fee: yup.number().min(0).required("This field is required"),
    price: yup.number().typeError("Enter a valid amountt").min(0),
  });

  // const formik = useFormik({
  //   initialValues: {
  //     index: null,
  //     product_name: "",
  //     prodDescription: "",
  //     product_image: null,
  //     file_name: "",
  //     price: "",
  //     stock: "",
  //     iGst: 0,
  //     Gst_Percentage: 0,
  //     attributes: [],
  //     filters: [],
  //     catogoryName: null,
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     saveProduct(values);
  //   },
  // });

  const formik = useFormik({
    initialValues: {
      index: null,
      product_name: "",
      prodDescription: "",
      product_image: null,
      price: 0,
      iGst: 1,
      Gst_Percentage: 0,
      attributes: [],
      convenience_fee: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveProduct(values);
    },
  });

  const setFile = (e, elName) => {
    let t = [...imageArray, e.currentTarget.files[0]];
    setImageArray(t);
    formik.setFieldValue(elName, t);
  };


  const IconWithTooltip = (value) => (
    <Tooltip title="select GST percentage applicable for this product/services. You can select zero percentage if GST is not applicable.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltipconvience = (value) => (
    <Tooltip title="Convenience fee is an option to collect the cost of the payment from your customer. You can set up convenience fee up to 2.00% which will be added in the total payment amount while your customer making payment.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const IconWithTooltipamount = (value) => (
    <Tooltip title="Amount is optional, If you do not enter the customer will be able to enter their own amount">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  

  // const setFile = (e, elName) => {

  //   // setImageArray([]);

  //   // let t = [...imageArray, e.currentTarget.files[0]];
  //   // setImageArray(t);
  //   formik.setFieldValue(elName, e.currentTarget.files[0]);

  //   // if(imageArray.length>0)
  //   // {
  //   //   let empty = imageArray.filter((item) => 0 !== item);
  //   //   setImageArray(empty);
  //   // }
  //   // else
  //   // {
  //   //   let t = [...imageArray, e.currentTarget.files[0]];
  //   //   setImageArray(t);
  //   //   formik.setFieldValue(elName, e.currentTarget.files[0]);
  //   // }

  // };

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

  useEffect(() => {
    formik.setFieldValue("product_image", imageArray);
  }, [imageArray]);

  // const saveProduct = async (values) => {
  //   setLoading(true);
  //   let payload = Object.assign({}, values);
  //   delete payload.product_image;
  //   delete payload.filters;
  //   delete payload.index;
  //   delete payload.file_name;
  //   payload.attributes = JSON.stringify(values.attributes);

  //   if (values.filters != undefined) {
  //     payload.filters = JSON.stringify(values.filters);
  //   }

  //   const formData = new FormData();
  //   Object.keys(payload).forEach((key) => formData.append(key, payload[key]));
  //   formData.append("iShop", iShop);

  //   values.product_image.forEach((item, i) =>
  //     formData.append(`file_${i}`, item)
  //   );
  //   if (editId) formData.append("id", editId);
  //   await axios
  //     .post("mylapay/shop/product_details", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       if (res.data.status) {
  //         toast.success("Product Saved!");
  //         setImageArray([]);
  //         getProductList();

  //         formik.resetForm({
  //           values: {
  //             index: null,
  //             product_name: "",
  //             prodDescription: "",
  //             product_image: null,
  //             file_name: "",
  //             price: "",
  //             stock: "",
  //             iGst: 0,
  //             Gst_Percentage: 0,
  //             attributes: [],
  //             filters: [],
  //             catogoryName: null,
  //           },
  //         });
  //         setShowNewPrdDialog(false);
  //       } else {
  //         toast.error("Error: " + JSON.stringify(res.data));
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error("Something went wrong, please try again");
  //       console.log(error);
  //     });
  //   setLoading(false);
  // };

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

    // if (editId != null) {
    //   formData.append("iShop", editId);
    // } else {
    //   formData.append("iShop", paymentiShop);
    // }

    formData.append("iShop", paymentiShop);

    formData.append("product_name", values.product_name);
    formData.append("price", values.price);
    formData.append("prodDescription", values.prodDescription);
    formData.append("iGst", values.iGst);
    formData.append("Gst_Percentage", values.Gst_Percentage);
    formData.append("convenienceFee", values.convenience_fee);

    values.product_image.forEach((item, i) =>
      formData.append(`file_${i}`, item)
    );
    formData.append("page_input", JSON.stringify(paymentDetails));
    // formData.append(`file_0`, values.product_image);

    // if (values.id) formData.append("id", values.id);
    if (editId) formData.append("id", editId);

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
          setImageArray([]);
          dispatch(setPaymentDetails(null));

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

  const deleteImageFromArray = (i) => {
    let t = imageArray.filter((item) => i !== item);
    setImageArray(t);
  };

  const handleProductName = () => {
    let r = document.getElementById("add_product_name").value;
    if (!r) return;
    formik.setFieldValue("product_name", r);
    setProductNameDialog(false);
  };

  let handleProductPrice = (e) => {
    if (parseInt(e.target.value) >= 0 || e.target.value === "") {
      formik.setFieldValue("price", e.target.value);
    }
  };

  let handleProductStock = (e) => {
    if (parseInt(e.target.value) >= 0 || e.target.value === "") {
      formik.setFieldValue("stock", e.target.value);
    }
  };

  const categorynamefind = (newValue) => {
    shopCategories.map((option) => {
      if (option.CategoryName == newValue) {
        setiProductcategory(option.iProductcategory);
      }
    });

    formik.setFieldValue("catogoryName", newValue);
  };

  const handleChangegst = (event) => {
    productgst.map(async (item) => {
      if (item.iGst == event.target.value) {
        setValue(event.target.value);
        formik.setFieldValue("iGst", event.target.value);
        formik.setFieldValue("Gst_Percentage", item.Gst_Percentage);
      }
    });
  };

  const viewcategory = () => {
    if (iProductcategory != 0) {
      getCategorybyId(iProductcategory);
    }
  };

  const getCategorybyId = async (newValue) => {
    await axios
      .get("/mylapay/shop/get/product_catogory/" + newValue)
      .then((response) => {
        if (response.data.success === 1) {
          setproductlist(response.data.data[0]);
          if (response.data.data.length > 0) setcategoryDialogview(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    getproductgst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const prefillProductData = async () => {
    await axios
      .get(
        "mylapay/merchant/get/products/" + editId + "?shopId=" + paymentiShop
      )
      .then(async (res) => {
        if (res.data.status) {
          let ia = await Promise.all(
            res.data.data[0].product_images.map(async (item) => {
              let imageFile = await createFileFromUrl(
                `${REACT_APP_SHOPAPI_URL}/uploads${item.product_image}`,
                item.file_name
              );
              return imageFile;
            })
          );
          setImageArray(ia);

          formik.resetForm({
            values: {
              index: null,
              product_name: res.data.data[0].product_name,
              prodDescription: res.data.data[0].prodDescription,
              product_image: ia,
              file_name: "",
              price: res.data.data[0].product_price,
              stock: res.data.data[0].stock,
              iGst: res.data.data[0].iGst,
              Gst_Percentage: res.data.data[0].Gst_Percentage,
              attributes: res.data.data[0].attributes,
              filters: res.data.data[0].filters,
              convenience_fee: res.data.data[0].convenience_fee,
            },
          });
          setValue(res.data.data[0].iGst);
          dispatch(setPaymentDetails(res.data.data[0].page_info));
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while fetching product details");
      });
  };

  useEffect(() => {
    if (!editId) return;
    prefillProductData();
    return () => {
      setEditId(null);
    };
  }, []);
  const renderInputBoxes = () => {
    return paymentDetails.map((item, index) => {
      return (
        <Box key={index} mb={2} display="flex" alignItems="center">
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            label={item.inputLabel}
            disabled
            multiline={item.inputType === "multiline_text"}
            rows={3}
          />
          <IconButton
            onClick={() => {
              deleteField(index);
            }}
            className="red-text"
          >
            <Close />
          </IconButton>
        </Box>
      );
    });
  };
  const handleDialog = (value) => {
    setDialogOpen(value);
  };
  const handleInput = (newItem) => {
    let payload;
    if (paymentDetails) {
      payload = [...paymentDetails, newItem];
    } else {
      payload = [newItem];
    }
    dispatch(setPaymentDetails(payload));
  };
  const deleteField = (delIndex) => {
    let payload = paymentDetails.filter((item, index) => index !== delIndex);
    dispatch(setPaymentDetails(payload));
  };

  const checkclose = () => {

    // setshopclosecheck(true);
    // Swal.fire({
    //   icon: "error",
    //   title: "Oops...",
    //   text: "Kindly save the information",
    // });
    // stepChange(0);

    Swal.fire({
      title: "Are you sure?",
      text: "Want to close popup?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#20295C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // handleDialog(false);
        setShowNewPrdDialog(false)
      } 
    });
  };

  return (
    <>
      <Dialog
        open={true}
        fullWidth
        maxWidth="md"
        onClose={() => {
          // setShowNewPrdDialog(false);
          checkclose()
        }}
      >
        {/* <DialogTitle>Add a new product</DialogTitle> */}

        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Add New Payment Page</Box>
            <Box>
              <IconButton
                onClick={() => {
                  // handleDialog(false);
                  checkclose()
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent style={{ padding: "3em 0" }}>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.formWrap}>
              <div className={styles.formLeft}>
                <Box display="flex" alignItems="center">

                <Grid container>
                  <Grid item xs={11}>

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
                </Grid>
                </Box>

                {/* <TextField
                  label="Product/Service Price"
                  variant="outlined"
                  fullWidth
                  name="price"
                  type="number"
                  value={formik.values.price}
                  onChange={handleProductPrice}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                /> */}

                <Grid container>
                  <Grid item xs={11}>

                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-helper-label">
                      <em>GST (%)</em>
                    </InputLabel>
                    <Select
                      value={pervalue || ""}
                      defaultValue=""
                      label="GST (%)"
                      onChange={handleChangegst}
                    >
                      {productgst.map((item) => (
                        <MenuItem key={item.iGst} value={item.iGst}>
                          {item.Gst_Percentage}
                        </MenuItem>
                      ))}

                    </Select>

                    

                    {/* <FormHelperText>
                      {
                        "select GST percentage applicable for this product/services. You can select zero percentage if GST is not applicable."
                      }
                    </FormHelperText> */}
                  </FormControl>

                  </Grid>

                  <Grid item xs={1}>
                    <IconWithTooltip />

                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={11}>
                    
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
                </Grid>

                <Grid container>
                  <Grid item xs={11}>


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
                    // helperText={
                    //   formik.touched.convenience_fee &&
                    //   formik.errors.convenience_fee
                    //     ? formik.errors.convenience_fee
                    //     : "Convenience fee is an option to collect the cost of the payment from your customer. You can set up convenience fee up to 2.00% which will be added in the total payment amount while your customer making payment."
                    // }
                  />

                </Grid>

                  <Grid item xs={1}>
                  <IconWithTooltipconvience />

                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={11}>

                    <TextField
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      name="price"
                      type="number"
                      value={formik.values.price !== 0 ? formik.values.price : 0}
                      onBlur={formik.handleChange}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched("price");
                      }}
                      error={formik.touched.price && Boolean(formik.errors.price)}
                      // helperText={
                      //   formik.touched.price && formik.errors.price
                      //     ? formik.errors.price
                      //     : "Amount is optional, If you do not enter the customer will be able to enter their own amount"
                      // }
                    />
                  </Grid>

                <Grid item xs={1}>
                <IconWithTooltipamount />

                </Grid>
              </Grid>
              </div>

              <div className={styles.formLeft}>
                {/* <ProductFileUpload
                  id="product_image"
                  name="product_image"
                  value={formik.values.product_image}
                  setfile={setFile}
                  error={
                    formik.touched.product_image &&
                    Boolean(formik.errors.product_image)
                  }
                  helperText={
                    formik.touched.product_image && formik.errors.product_image
                  }
                  style={{ marginBottom: "1em" }}
                /> */}
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
                    formik.touched.product_image && formik.errors.product_image
                  }
                />

                {imageArray.length > 0 ? (
                  <div className={styles.imageArrWrap}>
                    {imageArray.map((item, i) => (
                      <div className={styles.imageArrItem} key={i}>
                        <Close
                          fontSize="small"
                          onClick={() => deleteImageFromArray(item)}
                          className={styles.imgDelete}
                        />
                        <img
                          src={URL.createObjectURL(item)}
                          alt={item.name}
                          width="80"
                          height="80"
                          onClick={() => {
                            setImageDialogObj(item);
                            setImageDialog(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {imageDialog && (
                  <Dialog
                    onClose={() => setImageDialog(false)}
                    open={imageDialog}
                  >
                    <img
                      src={URL.createObjectURL(imageDialogObj)}
                      alt="Image"
                    />
                  </Dialog>
                )}
                {paymentDetails &&
                  paymentDetails.length > 0 &&
                  renderInputBoxes()}
                <Box mb={2}>
                  <Button
                    startIcon={<Add />}
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      handleDialog(true);
                    }}
                  >
                    Add Input Fields
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  style={{ color: "#fff" }}
                  disabled={loading}
                  onClick={() => {
                    setiProduct(0);
                  }}
                >
                  {editId == null ? (
                    loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Add Product"
                    )
                  ) : loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Save Product"
                  )}
                </Button>
                {/* <Typography variant="subtitle1" align="center">
                  Need guidance?{" "}
                  <Link className="mp-link" to="#">
                    Click here
                  </Link>
                </Typography> */}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog style={{ width: "500px", margin: "auto" }} open={dialogOpen}>
        <DialogTitle>Add a new input field</DialogTitle>
        <DialogContent>
          <AddNewInputField
            handleDialog={handleDialog}
            handleInput={handleInput}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
