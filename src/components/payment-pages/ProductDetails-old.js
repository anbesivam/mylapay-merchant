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
} from "@material-ui/core";
import {
  Add,
  Visibility,
  ArrowBack,
  ArrowForward,
  Close,
  DeleteOutline,
  Done,
  Edit,
} from "@material-ui/icons";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { setProductDetails } from "../../redux/paymentPageSlice";
import ProductFileUpload from "./ProductFileUpload";
import LinesEllipsis from "react-lines-ellipsis";
import Swal from "sweetalert2";
import AddAttribute from "./AddAttribute";
import ProductFilters from "./ProductFilters";
import { IconButton } from "@material-ui/core";
import AddCategory from "./AddCategory";
import toast from "react-hot-toast";

export default function ProductDetails({ shopID, stepChange }) {
  const [shopCategories, setShopCategories] = useState([]);
  const [productgst, setProductgst] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const autoC = useRef(null);

  const [pervalue, setValue] = React.useState();
  const [inputValue, setInputValue] = React.useState("");

  const [iProductcategory, setiProductcategory] = useState(0);
  const [iProduct, setiProduct] = useState(0);
  const [productlist, setproductlist] = useState();

  const [attributesDialog, setAttributesDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [alert] = React.useState(null);
  const productDetails = useSelector(
    (state) => state.paymentPage.productDetails
  );
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

  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
  };

  // useEffect(() => {
  //   if (productDetails == null || productDetails.length < 1) return;
  //   setProductArray(productDetails);
  // }, [productDetails, productArray]);

  useEffect(() => {
    if (!productDetails) return;
    let r = productDetails.map((item) => item.product_name);
    setSearchNamesList(r);
  }, [productDetails]);

  useEffect(() => {
    let MCC_Code = localStorage.getItem("MCC_Code");
    if (
      MCC_Code == 5137 ||
      MCC_Code == 5611 ||
      MCC_Code == 5651 ||
      MCC_Code == 5691 ||
      MCC_Code == 7296
    ) {
      setFilterFlag(true);
    }
  }, [filterFlag]);

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

  const editProduct = async (editIndex) => {
    let curProduct = Object.assign({}, productArray[editIndex]);
    curProduct.index = editIndex;

    console.log("Edit product- : ", curProduct.iGst);
    setValue(curProduct.iGst);

    // productgst.map((option) => {

    //   console.log("Check product GST : " + JSON.stringify(option.iGst));

    //   if(curProduct["iGst"] != null)
    //   {
    //     if (option.iGst == curProduct["iGst"]) {
    //       console.log("Event match : " + JSON.stringify(option.Gst_Percentage));
    //       // formik.setFieldValue("Gst_Percentage",JSON.stringify(option.Gst_Percentage));
    //       // setiProductcategory(option.iGst);
    //       // formik.setFieldValue("gst", JSON.stringify(newValue));
  
    //       setValue(option.iGst);
    //       // setInputValue(option.Gst_Percentage);
    //     }
    //   }
     
      
    // });

    setiProductcategory(curProduct.iProductcategory);
    setiProduct(curProduct.id);

    let ia = await Promise.all(
      curProduct.product_images.map(async (item) => {
        let imageFile = await createFileFromUrl(
          `${REACT_APP_SHOPAPI_URL}/uploads${item.product_image}`,
          item.file_name
        );
        return imageFile;
      })
    );
    setImageArray(ia);
    curProduct.product_image = ia;
    formik.resetForm({ values: curProduct });
  };

  const nextStep = () => {
    dispatch(setProductDetails(productArray));
    stepChange(2);
  };

  const getCategory = async (newValue) => {
    await axios
      .get("/mylapay/shop/get/product_catogory")
      .then((response) => {
        if (response.data.success === 1) {
          // setShopCategories(response.data.data);

          setShopCategories(response.data.data);

          if (response.data.data) {
            response.data.data.map((option) => {
              if (option.CategoryName == newValue) {
                console.log(
                  "Event match : " + JSON.stringify(option.iProductcategory)
                );
                setiProductcategory(option.iProductcategory);
              }
            });
          }

          if (newValue) formik.setFieldValue("catogoryName", newValue);

          // if(newValue)
          // {
          //   setShopCategories(response.data.data);
          //   categorynamefind(newValue)
          // }
          // else
          // {
          //   setShopCategories(response.data.data);
          // }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProductNames = async () => {
    await axios
      .get("/mylapay/shop/get_products")
      .then((response) => {
        if (response.data.success === 1) {
          let temp = response.data.data.map((item) => item.product_name);
          setProductNames(temp);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllProducts = async () => {
    await axios
      .get(`/mylapay/shop/product_details?iShop=${iShop}`)
      .then(async (response) => {
        if (response.data.status === 1) {
          const prodDetails = await Promise.all(
            response.data.data.map(async (item) => {
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
          dispatch(setProductDetails(prodDetails));
          //setProductArray(prodDetails);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (!isAuthenticated) return;
    getProductList();
  }, [isAuthenticated]);

  useEffect(() => {
    getproductgst();
    getCategory();
    getProductNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const validationSchema = yup.object({
    product_name: yup.string().required("Name is required"),
    prodDescription: yup.string().required("Description is required"),
    product_image: yup.mixed().required("Image is required"),
    price: yup
      .number()
      .required("Price is required")
      .test(
        "Is positive?",
        "Price must be greater than 0",
        (value) => value > 0
      ),
    stock: yup
      .number()
      .required("Stock is required")
      .test(
        "Is positive?",
        "Stock must be greater than 0",
        (value) => value > 0
      ),
    catogoryName: yup.string().nullable().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      index: null,
      product_name: "",
      prodDescription: "",
      product_image: null,
      file_name: "",
      price: "",
      stock: "",
      iGst: 0,
      Gst_Percentage: 0,
      attributes: [],
      filters: [],
      catogoryName: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // setValue(0);
      // setInputValue("");

      saveProduct(values);

      // let payload = Object.assign({}, values);
      // if (values.index || values.index === 0) {
      //   let tempArr = [...productArray];
      //   delete payload.index;
      //   tempArr[values.index] = payload;
      //   tempArr[values.index].file_name = payload.product_image.name;
      //   // setProductArray(tempArr);
      //   dispatch(setProductDetails(tempArr));
      //   formik.resetForm({
      //     values: {
      //       index: null,
      //       product_name: "",
      //       prodDescription: "",
      //       product_image: null,
      //       file_name: "",
      //       price: "",
      //       stock: "",
      //       iGst: null,
      //       Gst_Percentage: null,
      //       attributes: [],
      //       filters: [],
      //       catogoryName: null,
      //     },
      //   });
      // } else {
      //   delete payload.index;
      //   payload.file_name = payload.product_image.name;
      //   // setProductArray((productArray) => [...productArray, payload]);
      //   let t = [...productArray, payload];
      //   dispatch(setProductDetails(t));
      //   formik.resetForm({
      //     values: {
      //       index: null,
      //       product_name: "",
      //       prodDescription: "",
      //       product_image: null,
      //       file_name: "",
      //       price: "",
      //       stock: "",
      //       iGst: null,
      //       Gst_Percentage: null,
      //       attributes: [],
      //       filters: [],
      //       catogoryName: null,
      //     },
      //   });
      // }
    },
  });

  const setFile = (e, elName) => {
    // console.log(e);
    let t = [...imageArray, e.currentTarget.files[0]];
    setImageArray(t);
    // console.log(t);
    // formik.setFieldValue(elName, e.currentTarget.files[0]);
    formik.setFieldValue(elName, t);
  };

  const getCategorybyId = async (newValue) => {
    await axios
      .get("/mylapay/shop/get/product_catogory/" + newValue)
      .then((response) => {
        if (response.data.success === 1) {
          console.log(
            "product category list : " + JSON.stringify(response.data.data)
          );

          setproductlist(response.data.data[0]);
          console.log("Category View");
          if (response.data.data.length > 0) setcategoryDialogview(true);

          // setShopCategories(response.data.data);
          // if (newValue) formik.setFieldValue("catogoryName", newValue);
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
          // console.log(
          //   "product gst list : " + JSON.stringify(response.data.data)
          // );

          setProductgst(response.data.data);

          // setproductlist(response.data.data[0]);
          // console.log("Category View");
          // if (response.data.data.length > 0) setcategoryDialogview(true);

          // setShopCategories(response.data.data);
          // if (newValue) formik.setFieldValue("catogoryName", newValue);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const viewcategory = () => {
    if (iProductcategory != 0) {
      getCategorybyId(iProductcategory);
    }
  };

  const productgstfind = (newValue) => {
    // console.log("Event match intial : " + JSON.stringify(newValue));

    productgst.map((option) => {
      if (option.Gst_Percentage == newValue) {
        // console.log("Event match : " + JSON.stringify(option.iGst));
        // setiProductcategory(option.iGst);
        formik.setFieldValue("gst", JSON.stringify(newValue));
      }
    });
  };

  const categorynamefind = (newValue) => {
    // console.log("Event match intial : " + JSON.stringify(shopCategories));

    shopCategories.map((option) => {
      if (option.CategoryName == newValue) {
        // console.log("Event match : " + JSON.stringify(option.iProductcategory));
        setiProductcategory(option.iProductcategory);
      }
    });

    formik.setFieldValue("catogoryName", newValue);
  };

  const handleChangegst = (event) => {

    console.log("GST change : " + event.target.value)

    productgst.map(async (item) => {

      if(item.iGst == event.target.value)
      {
        setValue(event.target.value);
        formik.setFieldValue("iGst", event.target.value);
        formik.setFieldValue("Gst_Percentage",item.Gst_Percentage);
      }
    });
  };

  

  // Product Search
  useEffect(() => {
    if (!productArray || !productDetails) return;
    let temp = productDetails.filter(
      (p) =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.catogoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setProductArray(temp);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, shopCategories, productgst, dispatch]);

  const handleProductName = () => {
    let r = document.getElementById("add_product_name").value;
    if (!r) return;
    formik.setFieldValue("product_name", r);
    setProductNameDialog(false);
  };

  let handleProductPrice = (e) => {
    // console.log(e.target.value);
    if (parseInt(e.target.value) >= 0 || e.target.value === "") {
      formik.setFieldValue("price", e.target.value);
    }
  };


  let handleProductStock = (e) => {
    // console.log(e.target.value);
    if (parseInt(e.target.value) >= 0 || e.target.value === "") {
      formik.setFieldValue("stock", e.target.value);
    }
  };

  const saveProduct = async (values) => {
    setLoading(true);
    let payload = Object.assign({}, values);
    delete payload.product_image;
    delete payload.filters;
    delete payload.index;
    delete payload.file_name;
    payload.attributes = JSON.stringify(values.attributes);

    // console.log("Filter check : " + JSON.stringify(values.filters));

    if (values.filters != undefined) {
      payload.filters = JSON.stringify(values.filters);
    }
    // else
    // {
    //   payload.iGst = 
    // }

    const formData = new FormData();
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));
    formData.append("iShop", iShop);

    values.product_image.forEach((item, i) =>
      formData.append(`file_${i}`, item)
    );
    if (values.id) formData.append("iProduct", values.id);

    await axios
      .post("mylapay/shop/product_details", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status) {
          toast.success("Product Saved!");
          setImageArray([]);
          getProductList();
          // setValue();
          setValue(0);
          setInputValue("");
          // const ele = autoC.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
          // if (ele) ele.click();

          formik.resetForm({
            values: {
              index: null,
              product_name: "",
              prodDescription: "",
              product_image: null,
              file_name: "",
              price: "",
              stock: "",
              iGst: 0,
              Gst_Percentage: 0,
              attributes: [],
              filters: [],
              catogoryName: null,
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

  const getProductList = async () => {
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
          // console.log("--------------------------", productDetails);
          setProductArray(prodDetails);
          dispatch(setProductDetails(prodDetails));
        } else {
          // console.log(res.data);
          toast.error("Something went wrong while fetching products");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while fetching products");
      });
  };

  const deleteImageFromArray = (i) => {
    let t = imageArray.filter((item) => i !== item);
    setImageArray(t);
  };

  useEffect(() => {
    formik.setFieldValue("product_image", imageArray);
  }, [imageArray]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <form onSubmit={formik.handleSubmit}>
            <Box p={4} style={{ background: "#fff", borderRadius: ".5em" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ProductFileUpload
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
                    style={{ marginBottom: "1em" }}
                  />
                  <Grid style={{ marginTop: "0.25em" }} container spacing={1}>
                    {imageArray.map((item, i) => (
                      <Grid key={i} item xs={12}>
                        <Chip
                          size="small"
                          label={item.name}
                          onClick={() => {
                            setImageDialogObj(item);
                            setImageDialog(true);
                          }}
                          onDelete={() => deleteImageFromArray(item)}
                        />
                      </Grid>
                    ))}
                  </Grid>
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
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Autocomplete
                      style={{ flexGrow: 1 }}
                      options={productNames}
                      freeSolo
                      autoSelect
                      name="product_name"
                      value={formik.values.product_name}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("product_name", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product/Service Name"
                          variant="outlined"
                          fullWidth
                          error={
                            formik.touched.product_name &&
                            Boolean(formik.errors.product_name)
                          }
                          helperText={
                            formik.touched.product_name &&
                            formik.errors.product_name
                          }
                        />
                      )}
                    />
                    <IconButton onClick={() => setProductNameDialog(true)}>
                      <Add />
                    </IconButton>
                    <Dialog open={productNameDialog}>
                      <DialogTitle>Add a new Product/Service name</DialogTitle>
                      <DialogContent style={{ minWidth: "400px" }}>
                        <TextField
                          style={{ marginBottom: "1em" }}
                          fullWidth
                          label="Product/Service Name"
                          variant="outlined"
                          id="add_product_name"
                        />
                        <Box
                          py={2}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Close />}
                            onClick={() => {
                              setProductNameDialog(false);
                            }}
                          >
                            Close
                          </Button>
                          <Button
                            onClick={handleProductName}
                            variant="contained"
                            color="primary"
                            endIcon={<Done size={14} />}
                          >
                            Submit
                          </Button>
                        </Box>
                      </DialogContent>
                    </Dialog>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Product/Service Price"
                    variant="outlined"
                    fullWidth
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onChange={handleProductPrice}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="GST"
                    name="gst"
                    value={formik.values.gst_number}
                    onChange={formik.handleChange}
                    error={formik.touched.gst_number && Boolean(formik.errors.gst_number)}
                    helperText={formik.touched.gst_number && formik.errors.gst_number}
                  />
                </Grid> */}

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    
                      <FormControl
                        variant="outlined"
                        style={{ minWidth: "265px" }}
                      >
                        <InputLabel id="demo-simple-select-helper-label">
                          <em>GST (%)</em>
                        </InputLabel>
                        <Select
                          value={pervalue || ""}
                          defaultValue=""
                          label="GST (%)"
                          onChange={handleChangegst}
                          // onChange={(event, newValue) => {
                          //   console.log("newValue : " + JSON.stringify(event.target.value));
    
                          //   // if (newValue != null) {
                          //   //   setValue(newValue.iGst);
                          //     formik.setFieldValue("iGst", event.target.value);
                          //     formik.setFieldValue("Gst_Percentage",newValue.Gst_Percentage);
                          //   // }
                          // }}
                        >

                          {productgst.map((item) =>
                            <MenuItem value={item.iGst}>{item.Gst_Percentage}</MenuItem>
                          )}

                          {/* <MenuItem value={0}>None</MenuItem>
                          <MenuItem value={1}>1 Day</MenuItem>
                          <MenuItem value={2}>2 Days</MenuItem> */}
                        </Select>
                      </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Stock"
                    type="number"
                    name="stock"
                    value={formik.values.stock}
                    onChange={handleProductStock}
                    error={formik.touched.stock && Boolean(formik.errors.stock)}
                    helperText={formik.touched.stock && formik.errors.stock}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Attributes"
                    inputProps={{ readOnly: true }}
                    InputLabelProps={{
                      shrink:
                        formik.values.attributes &&
                        formik.values.attributes.length > 0,
                    }}
                    onClick={() => {
                      setAttributesDialog(true);
                    }}
                    value={
                      formik.values.attributes &&
                      formik.values.attributes.map(
                        (item) => item.label + ":" + item.value
                      )
                    }
                  />
                </Grid>

                {filterFlag && (
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Size,Color,.."
                      inputProps={{ readOnly: true }}
                      InputLabelProps={{
                        shrink:
                          formik.values.filters &&
                          formik.values.filters.length > 0,
                      }}
                      onClick={() => {
                        setFilterDialog(true);
                      }}
                      value={
                        formik.values.filters &&
                        formik.values.filters.map((item) => item.Filter_Name)
                      }
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Autocomplete
                      style={{ flexGrow: 1 }}
                      options={shopCategories.map(
                        (option) => option.CategoryName
                      )}
                      name="catogoryName"
                      value={formik.values.catogoryName}
                      onChange={(event, newValue) => {
                        categorynamefind(newValue);
                        // console.log("Event change : " + event.target.value)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          variant="outlined"
                          error={
                            formik.touched.catogoryName &&
                            Boolean(formik.errors.catogoryName)
                          }
                          helperText={
                            formik.touched.catogoryName &&
                            formik.errors.catogoryName
                          }
                        />
                      )}
                    />

                    {formik.values.catogoryName != null ? (
                      <IconButton onClick={() => viewcategory()}>
                        <Visibility />
                      </IconButton>
                    ) : null}

                    <IconButton onClick={() => setCategoryDialog(true)}>
                      <Add />
                    </IconButton>

                    <Dialog open={categoryDialog}>
                      <DialogTitle>Add a new Category</DialogTitle>
                      <DialogContent>
                        <AddCategory
                          shopId={shopID}
                          setCategoryDialog={setCategoryDialog}
                          getCategory={getCategory}
                          view={false}
                          editview={false}
                          setcategoryDialogview={setcategoryDialogview}
                          setcategoryDialogedit={setcategoryDialogedit}
                          productlist={productlist}
                          categorynamefind={categorynamefind}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={categoryDialogedit}>
                      <DialogTitle>Edit Category</DialogTitle>
                      <DialogContent>
                        <AddCategory
                          shopId={shopID}
                          setCategoryDialog={setCategoryDialog}
                          getCategory={getCategory}
                          view={true}
                          editview={false}
                          setcategoryDialogview={setcategoryDialogview}
                          setcategoryDialogedit={setcategoryDialogedit}
                          productlist={productlist}
                          categorynamefind={categorynamefind}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={categoryDialogview}>
                      <DialogTitle>View Category</DialogTitle>
                      <DialogContent>
                        <AddCategory
                          setCategoryDialog={setCategoryDialog}
                          getCategory={getCategory}
                          view={true}
                          editview={true}
                          setcategoryDialogview={setcategoryDialogview}
                          setcategoryDialogedit={setcategoryDialogedit}
                          productlist={productlist}
                          categorynamefind={categorynamefind}
                        />
                        {/* <Avatar style={{ height: '100px', width: '100px' }} variant="rounded" src="/images/no-image-icon-23494.png" >
                        </Avatar> */}
                      </DialogContent>
                    </Dialog>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Product/Service Description"
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

                {/* <Grid
                  item
                  xs={6}
                  // style={{ display: "flex", justifyContent: "flex-end" }}
                >

                  <Button
                    variant="contained"
                    color="primary"
                    // disabled={loading}
                    onClick={clearproduct}
                  >
                    Clear
                    </Button>


                  </Grid> */}

                <Grid
                  item
                  xs={6}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={() => {
                      setiProduct(0);
                    }}
                  >
                    {!formik.values.id ? (
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
                </Grid>
              </Grid>
            </Box>
            <AddAttribute
              attributesDialog={attributesDialog}
              setAttributesDialog={setAttributesDialog}
              formik={formik}
              attrArray={formik.values.attributes}
            />
            <ProductFilters
              filterDialog={filterDialog}
              setFilterDialog={setFilterDialog}
              formik={formik}
              filterArray={formik.values.filters}
              iProduct={iProduct}
            />
          </form>
        </Grid>
        <Grid item xs={12} md={8}>
          {productDetails && productDetails.length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={searchNamesList}
                  inputValue={searchTerm}
                  onInputChange={(event, value, reason) => setSearchTerm(value)}
                  freeSolo
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Product/Service"
                      variant="outlined"
                      fullWidth
                      style={{ backgroundColor: "#fff" }}
                    />
                  )}
                />
              </Grid>
              {productArray.map((product, index) => (
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

                    <Box p={2}>
                      <Typography style={{ color: "#9e9e9e" }} variant="body2">
                        {product.catogoryName}
                      </Typography>
                      <Typography variant="h5" style={{ fontWeight: "normal" }}>
                        {product.product_name}
                      </Typography>
                      <Typography variant="body2">
                        {product.attributes &&
                          product.attributes.length > 0 &&
                          product.attributes.map((item, pi) =>
                            pi === product.attributes.length - 1
                              ? item.label + ":" + item.value
                              : item.label + ":" + item.value + ", "
                          )}
                      </Typography>
                      <Typography component="div" variant="body2">
                        <LinesEllipsis
                          text={product.prodDescription}
                          maxLine="2"
                          ellipsis="..."
                          trimRight
                        />
                      </Typography>
                    </Box>
                    <Box
                      width="150px"
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
                      <Typography variant="h5" gutterBottom>
                        ₹{product.gstPrice}
                      </Typography>
                      <Typography variant="body2">
                        <span style={{ color: "#9e9e9e" }}>Stock:</span>
                        <span>{product.stock}</span>
                      </Typography>
                      <Box
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.5em",
                          marginTop: "auto",
                        }}
                      >
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
              <Typography variant="body1">
                No Product/Service added yet...
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
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
          endIcon={<ArrowForward />}
          onClick={() => {
            nextStep();
          }}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
