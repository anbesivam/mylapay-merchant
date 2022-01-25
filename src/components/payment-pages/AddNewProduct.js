import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
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
} from "@material-ui/core";
import {
  Add,
  Visibility,
  ArrowBack,
  ArrowForward,
  Help,
  Close,
  DeleteOutline,
  Done,
  Edit,
} from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import ProductFileUpload from "./ProductFileUpload";
import AddCategory from "./AddCategory";
import AddAttribute from "./AddAttribute";
import ProductFilters from "./ProductFilters";
import styles from "./css/AddNewProduct.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddNewProduct({
  setShowNewPrdDialog,
  getProductList,
  editId,
  setEditId,
  createFileFromUrl,
  shopid,
  filterFlag,
  stepChange,
}) {
  const [shopCategories, setShopCategories] = useState([]);
  const [productgst, setProductgst] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pervalue, setValue] = React.useState();
  const [inputValue, setInputValue] = React.useState("");
  const [iProductcategory, setiProductcategory] = useState(0);
  const [iProduct, setiProduct] = useState(0);
  const [productlist, setproductlist] = useState();

  const [attributesDialog, setAttributesDialog] = useState(false);
  const [shopnullcheck, setshopnullcheck] = useState(false);
  const [shopclosecheck, setshopclosecheck] = useState(false);
  
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
  //const [filterFlag, setFilterFlag] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  const [imageDialogObj, setImageDialogObj] = useState(null);
  const [searchNamesList, setSearchNamesList] = useState([]);
  const dispatch = useDispatch();
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [testString, setTestString] = useState(false);

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
      saveProduct(values);
    },
  });

  const handleDialog = (value) => {
    setShowNewPrdDialog(value);
  };

  const handleclsoeDialog = (value) => {
    setshopclosecheck(value);
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
  

  const setFile = (e, elName) => {
    let t = [...imageArray, e.currentTarget.files[0]];
    setImageArray(t);
    formik.setFieldValue(elName, t);
  };

  useEffect(() => {
    formik.setFieldValue("product_image", imageArray);

    if (shopid == undefined) {
      // setshopnullcheck(true);

      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Kindly save the information",
      // });

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
          handleDialog(false);
        } 
      });
      // stepChange(0);

    }
  }, [imageArray]);

  const saveProduct = async (values) => {
    setLoading(true);
    let payload = Object.assign({}, values);
    delete payload.product_image;
    delete payload.filters;
    delete payload.index;
    delete payload.file_name;
    payload.attributes = JSON.stringify(values.attributes);

    if (values.filters != undefined) {
      payload.filters = JSON.stringify(values.filters);
    }

    const formData = new FormData();
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));
    formData.append("iShop", iShop);

    values.product_image.forEach((item, i) =>
      formData.append(`file_${i}`, item)
    );
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
          setImageArray([]);
          getProductList();

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
          setShowNewPrdDialog(false);
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
        handleDialog(false);
      } 
    });
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
    console.log("iProductcategory : " + iProductcategory);
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
  const getCategory = async (newValue) => {
    await axios
      .get("/mylapay/shop/get/product_catogory")
      .then((response) => {
        if (response.data.success === 1) {
          setShopCategories(response.data.data);

          if (response.data.data) {
            response.data.data.map((option) => {
              if (option.CategoryName == newValue) {
                console.log("iProductcategory : " + option.CategoryName);
                setiProductcategory(option.iProductcategory);
              }
            });
          }

          if (newValue) formik.setFieldValue("catogoryName", newValue);
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
    getCategory();
    getProductNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const prefillProductData = async () => {
    await axios
      .get(`mylapay/merchant/get/products/${editId}?shopId=${iShop}`)
      .then(async (res) => {
        if (res.data.status) {
          setiProductcategory(res.data.data[0].iProductcategory);

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
              catogoryName: res.data.data[0].CategoryName,
            },
          });
          setValue(res.data.data[0].iGst);
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
    if (!iShop) return;
    prefillProductData();
    return () => {
      setEditId(null);
    };
  }, [iShop]);

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
            <Box flexGrow={1}>Add New Product</Box>
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

        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.formWrap}>
              <div className={styles.formLeft}>
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
                      <Box py={2} display="flex" justifyContent="space-between">
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
                    </FormControl>

                  </Grid>

                  <Grid item xs={1}>
                    <IconWithTooltip />

                  </Grid>
                </Grid>

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

                {filterFlag && (
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
                )}

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
                        shopId={iShop}
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
                        shopId={iShop}
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
                    </DialogContent>
                  </Dialog>
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
                  iProduct={editId}
                />
              </div>

              <div className={styles.formLeft}>
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
                    formik.touched.product_image && formik.errors.product_image
                  }
                  style={{ marginBottom: "1em" }}
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

      <Dialog
        open={shopnullcheck}
        fullWidth
        maxWidth="sm"
        onClose={() => {
          setShowNewPrdDialog(false);
        }}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Information</Box>
            <Box>
              <IconButton
                onClick={() => {
                  handleDialog(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          Please Configure your shop to add your products
        </DialogContent>
      </Dialog>

      <Dialog
        open={shopclosecheck}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Warning</Box>
            <Box>
              <IconButton
                onClick={() => {
                  handleclsoeDialog(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent style={{textAlign:"center"}}>

          Kindly save the information

        </DialogContent>

      </Dialog>
    </>
  );
}
