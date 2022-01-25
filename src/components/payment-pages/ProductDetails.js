import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  Avatar,
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
  SaveAlt,
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
import MUIDataTable from "mui-datatables";
import styles from "./css/ProductDetails.module.css";
import stylesone from "./css/StepOne.module.css";
import AddNewProduct from "./AddNewProduct";
import CloseIcon from "@material-ui/icons/Close";

export default function ProductDetails({ shopID, stepChange }) {
  const [shopCategories, setShopCategories] = useState([]);
  const [productgst, setProductgst] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [category, setCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const autoC = useRef(null);
  const { REACT_APP_SHOP_URL } = process.env;
  const [previewurl, setpreviewurl] = useState("");

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
  const shopDetails = useSelector((state) => state.paymentPage.shopDetails);
  const [dialogOpen, setDialogOpen] = React.useState(false);

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
  const [showNewPrdDialog, setShowNewPrdDialog] = useState(false);
  const [editId, setEditId] = useState(null);

  const [shopnullcheck, setshopnullcheck] = useState(false);

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

    if (localStorage.getItem("addprodcut") == 1) {
      setShowNewPrdDialog(true);
      localStorage.removeItem("addprodcut");
    }
  }, [productDetails]);

  const handlePreviewClick = async (e) => {
    setLoading(true);
    await axios;
    let url = `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}`;

    setpreviewurl("<iframe src=" + url + " style='width:130%; height:450px'/>");
    setDialogOpen(true);
  };

  const viewproduct = (value) => {
    window.open(
      `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}/${value["rowData"][2]}/${value["rowData"][6]}`,
      "_blank"
    );
  };

  const handlefullscreen = () => {
    window.open(
      `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}`
    );
  };

  const handleDialogClose = (value) => {
    handleDialog(false);
  };

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  const handleDialoginfo = (value) => {
    setShowNewPrdDialog(value);
  };

  useEffect(() => {
    let MCC_Code = localStorage.getItem("MCC_Code");

    if (shopDetails) {
      if (shopDetails["Template_Name"] == "APPAREL") {
        setFilterFlag(true);
      }
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

  const editProduct = async (id) => {
    setEditId(id);
    setShowNewPrdDialog(true);
    // let curProduct = Object.assign({}, productArray[editIndex]);
    // curProduct.index = editIndex;

    // console.log("Edit product- : ", curProduct.iGst);
    // setValue(curProduct.iGst);

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

    // setiProductcategory(curProduct.iProductcategory);
    // setiProduct(curProduct.id);

    // let ia = await Promise.all(
    //   curProduct.product_images.map(async (item) => {
    //     let imageFile = await createFileFromUrl(
    //       `${REACT_APP_SHOPAPI_URL}/uploads${item.product_image}`,
    //       item.file_name
    //     );
    //     return imageFile;
    //   })
    // );
    // setImageArray(ia);
    // curProduct.product_image = ia;
    // formik.resetForm({ values: curProduct });
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

  // Filter by Category
  useEffect(() => {
    if (!category) return setProductArray(productDetails);
    let t = productDetails.filter(
      (item) => item.CategoryName === category.CategoryName
    );
    setProductArray(t);
  }, [category]);

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

  useEffect(() => {
    if (!isAuthenticated) return;
    getProductList();
  }, [isAuthenticated]);

  useEffect(() => {
    getCategory();
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
      saveProduct(values);
    },
  });

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
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Product Search
  useEffect(() => {
    if (!productArray || !productDetails) return;
    let temp = productDetails.filter(
      (p) =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setProductArray(temp);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, shopCategories, productgst, dispatch]);

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
          setValue(0);
          setInputValue("");

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
          setProductArray(prodDetails);
          dispatch(setProductDetails(prodDetails));
        } else {
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
    if (shopID == undefined) {
      // setshopnullcheck(true);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Configure your shop to add your products",
      });

      stepChange(0);
    }
  }, [imageArray]);

  const columns = [
    {
      name: "product_image",
      label: "Products",
      options: {
        sort: false,
        // customBodyRender: (value, tableMeta, updateValue) => (
        //   <div style={{ lineHeight: "0" }}>
        //     <img
        //       className={styles.prdImg}
        //       src={URL.createObjectURL(value)}
        //       alt="Image"
        //       width="75"
        //       height="75"
        //     />
        //   </div>
        // ),
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log("Value product image : " + URL.createObjectURL(value));
          if (URL.createObjectURL(value) != null) {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
                src={URL.createObjectURL(value)}
              ></Avatar>
            );
          } else {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
                src="/images/no-image-icon-23494.png"
              ></Avatar>
            );
          }
        },
      },
    },
    {
      name: "product_name",
      label: "Product Name",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <a
            className="mp-link"
            href="javascript:void(0)"
            rel="noreferrer"
            onClick={() => {
              viewproduct(tableMeta);
            }}
          >
            {value}
          </a>
        ),
      },
    },
    {
      name: "iProductcategory",
      label: "ProductID",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "CategoryName",
      label: "Category",
      options: {
        sort: true,
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        sort: true,
      },
    },
    {
      name: "stock",
      label: "Quantity",
      options: {
        sort: true,
      },
    },
    {
      name: "id",
      label: " ",
      options: {
        sort: true,
        setCellProps: () => ({
          align: "right",
        }),
        customBodyRender: (value, tableMeta, updateValue) => (
          <Box className={styles.actionWrap}>
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
                onClick={() => editProduct(value)}
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
                onClick={() => deleteProduct(value)}
              >
                <DeleteOutline fontSize="small" />
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    },
  ];

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: "none",
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
    },
  };

  const TableHeader = () => {
    return (
      <Box display="flex">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setShowNewPrdDialog(true);
          }}
        >
          Add new product
        </Button>

        <Autocomplete
          options={shopCategories}
          getOptionLabel={(option) => option.CategoryName}
          value={category}
          onChange={(event, newValue) => {
            setCategory(newValue);
          }}
          style={{ whiteSpace: "nowrap", minWidth: "180px", marginLeft: "1em" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by Category"
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>
    );
  };

  return (
    <>
      <div className={stylesone.stepCtaWrap}>
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          style={{ color: "#fff" }}
          onClick={handlePreviewClick}
        >
          Preview
        </Button>
      </div>
      {productArray && (
        <MUIDataTable
          response="scrollFullHeight"
          title={<TableHeader />}
          data={productArray}
          columns={columns}
          options={options}
          components={{ icons: { DownloadIcon: SaveAlt } }}
        />
      )}

      {/* <Box mt={2} style={{ display: "flex", justifyContent: "space-between" }}>
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
      </Box> */}

      {showNewPrdDialog ? (
        <AddNewProduct
          setShowNewPrdDialog={setShowNewPrdDialog}
          getProductList={getProductList}
          editId={editId}
          setEditId={setEditId}
          createFileFromUrl={createFileFromUrl}
          shopid={shopID}
          filterFlag={filterFlag}
          stepChange={stepChange}
        />
      ) : null}

      <Dialog
        style={{ width: "103%", margin: "auto" }}
        fullWidth
        maxWidth="100%"
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle id="id" style={{}}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Shop Preview</Box>

            <Box>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "99px", width: "160px" }}
                onClick={handlefullscreen}
              >
                Full Screen
              </Button>
            </Box>

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

        <DialogContent>
          <div
            style={{ width: "75%", height: "450px" }}
            dangerouslySetInnerHTML={{ __html: previewurl }}
          />
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
                  setshopnullcheck(false);
                  stepChange(0);
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
    </>
  );
}
