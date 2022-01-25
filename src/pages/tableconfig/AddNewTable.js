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
  Avatar,
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
  SaveAlt,
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
import styles from "./css/AddNewTable.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MUIDataTable from "mui-datatables";

export default function AddNewTable({
  setShowNewPrdDialog,
  editId,
  setEditId,
  createFileFromUrl,
  shopid,
  filterFlag,
  // stepChange,
}) {
  const [productgst, setProductgst] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [selectedproductArray, setselectedProductArray] = useState([]);
  
  const { REACT_APP_SHOP_URL } = process.env;
  const shopDetails = useSelector((state) => state.paymentPage.shopDetails);

  const [pervalue, setValue] = React.useState();
  const [selectedtable, setselectedtable] = React.useState();
  const [iProductcategory, setiProductcategory] = useState(0);

  const [valuecategory, setValueauto] = React.useState([]);

  const [shopclosecheck, setshopclosecheck] = useState(false);

  const userDetails = useSelector((state) => state.auth.userDetails);
  const iShop = useSelector((state) => state.paymentPage.iShop);
  const [productNames, setProductNames] = useState([]);
  const [tablelist, settablelist] = useState([]);
  const [productNameDialog, setProductNameDialog] = useState(false);

  const [tableDialog, settableDialog] = useState(true);

  const [shopCategories, setShopCategories] = useState([]);

  const [rowsSelectedval, setrowsSelectedval] = useState([]);
  const [selecteddelivery, setselecteddelivery] = useState("");
  const [currentRowsSelected, setcurrentrowsSelectedval] = useState([]);
  
  const dispatch = useDispatch();
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const { REACT_APP_SHOPAPI_URL } = process.env;

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


  const getProductList = async () => {
    await axios
      // .get(`mylapay/restaurant/get/dining-tables?iShop=${shopid}`)
      .get(`mylapay/shop/product_details?iShop=${shopid}`)
      .then(async (res) => {
        if (res.data.status) {
          const prodDetails = await Promise.all(
            res.data.data.map(async (item) => {
              let imageFile = await createFileFromUrl(
                `${REACT_APP_SHOPAPI_URL}/uploads/${item.product_image}`,
                item.file_name
              );
              return {
                ...item,
                product_image: imageFile,
              };
            })
          );
          setProductArray(prodDetails);
          setselectedProductArray(prodDetails);
        } else {
          toast.error("Something went wrong while fetching products");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while fetching products");
      });
  };

  const viewproduct = (value) => {
    window.open(
      `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}/${value["rowData"][2]}/${value["rowData"][6]}`,
      "_blank"
    );
  };

  const editProduct = async (id) => {
    setEditId(id);
    setShowNewPrdDialog(true);
  };

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

  

  const handleProductfilter = async () => {
    
    console.log("Selected table : " + JSON.stringify(selectedtable))

    let selected_table_id = "";

      tablelist.filter((item, index) => {
        if(item.dining_name === selectedtable)
        {
          selected_table_id = item.iDining;
        }
      });

      if(selected_table_id!="")
      { 
        console.log("seleted table : " + selected_table_id)
      }
      

    let selected_product_id = [];

    if(rowsSelectedval.length>0)
    {
      selectedproductArray.filter((item, index) => {
        if(index === rowsSelectedval[index])
        {
          selected_product_id.push(item.id)
        }
      });
    }

    if(selected_product_id.length>0)
    {
      console.log("Selected product ids : " + JSON.stringify(selected_product_id))

      await axios
      .post("mylapay/restaurant/dining-table/products-map", {
        iShop:shopid,
        iDining:selected_table_id,
        dining_url:"restaurant/dining-productlist",
        product_id: JSON.stringify(selected_product_id)
      })
      .then((res) => {
        if (res.data.status) {
        }
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again");
        console.log(error);
      });
    }
        


    // let selected_cat = [];

    // valuecategory.map((cat_val) => {
    //   shopCategories.map((option) => {
    //     if (option.CategoryName == cat_val) {
    //       // setiProductcategory(option.iProductcategory);
    //       selected_cat.push(option.iProductcategory)
    //     }
    //   });
    // });

    // if(selected_cat.length>0)
    // {
    //   console.log("Selected category : " + JSON.stringify(selected_cat))

    //   let prod_selec = []

    //   selected_cat.map((cat_val) => {
    //     productArray.filter((item) => {
    //         if(item.iProductcategory === cat_val)
    //         {
    //           prod_selec.push(item)
    //         }
    //     });
    //   });

    //   if(prod_selec.length>0)
    //   {
    //     setProductArray(prod_selec);
    //   }
    // }

    
  };

  const handleProductName = async () => {

    
    let table_name = document.getElementById("add_product_name").value;
    if (!table_name) return;


    if(table_name!="")
    {
  
      await axios
      .post("mylapay/restaurant/dining-tables", {
        iShop:shopid,
        dining_name:table_name,
        dining_url:"restaurant/dining-productlist",
      })
      .then((res) => {
        if (res.data.status) {
        }
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again");
        console.log(error);
      });
    }
    
    // formik.setFieldValue("product_name", r);
    setProductNameDialog(false);
  };

  let handleProductPrice = (e) => {
    if (parseInt(e.target.value) >= 0 || e.target.value === "") {
      formik.setFieldValue("price", e.target.value);
    }
  };

  const categorynamefind = (newValue) => {

    // console.log("Selected ids : " + JSON.stringify(getTagProps));

    shopCategories.map((option) => {
      if (option.CategoryName == newValue) {
        setiProductcategory(option.iProductcategory);
      }
    });

    formik.setFieldValue("catogoryName", newValue);
  };

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
    }
  ];

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: "multiple",
    tableBodyMaxHeight: "calc(100vh - 220px)",
    // textLabels: {
    //   toolbar: {
    //     downloadCsv: "Export to excel",
    //   },
    // },
    onRowSelectionChange: (
      currentRowsSelectedchk,
      allRowsSelected,
      rowsSelected
    ) => {
      setrowsSelectedval(rowsSelected);
      setcurrentrowsSelectedval(currentRowsSelectedchk);
    },
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

  const handleChangegst = (event) => {
    productgst.map(async (item) => {
      if (item.iGst == event.target.value) {
        setValue(event.target.value);
        formik.setFieldValue("iGst", event.target.value);
        formik.setFieldValue("Gst_Percentage", item.Gst_Percentage);
      }
    });
  };

  

  const getProductNames = async () => {
    await axios
      .get(`/mylapay/restaurant/get/dining-tables?iShop=${shopid}`)
      .then((response) => {

        console.log("Dinging response : " + JSON.stringify(response.data))

        if (response.data.status == 1) {
          let temp = response.data.data.map((item) => item.dining_name);
          console.log("Dinging : " + JSON.stringify(temp))
          setProductNames(temp);
          settablelist(response.data.data);
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

  useEffect(() => {
    getproductgst();
    getCategory();
    getProductList();
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
      <Dialog open={true} 
        fullWidth
        maxWidth="md"
        style={{ overflow:"hidden" }}
      >
        <DialogTitle>

        <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Add New Table</Box>
            <Box>
              <IconButton
                onClick={() => {
                  // handleDialog(false);
                  setShowNewPrdDialog(false)
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

        </DialogTitle>
        <DialogContent style={{ minWidth: "400px", overflow:"initial" }}>

          <Grid container spacing={2}>
            <Grid item xs={4}>

              {/* <TextField
                style={{ marginBottom: "1em" }}
                fullWidth
                label="Table Name"
                variant="outlined"
                id="add_product_name"
              /> */}

                <Box py={2} display="flex" alignItems="center">
                <Autocomplete
                    style={{ flexGrow: 1 }}
                    options={productNames}
                    freeSolo
                    autoSelect
                    name="product_name"
                    value={formik.values.product_name}
                    onChange={(event, newValue) => {
                      // formik.setFieldValue("product_name", newValue);
                      setselectedtable(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Table Name"
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
                    <DialogTitle>Add a new Table name</DialogTitle>
                    <DialogContent style={{ minWidth: "400px" }}>
                      <TextField
                        style={{ marginBottom: "1em" }}
                        fullWidth
                        label="Table Name"
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

                <Box py={2} display="flex" alignItems="center">
                  <Autocomplete
                    multiple
                    freeSolo
                    id="tags-filled"
                    style={{ flexGrow: 1 }}
                    options={shopCategories.map(
                      (option) => option.CategoryName
                    )}
                    name="catogoryName"
                    // value={formik.values.catogoryName}
                    // onChange={(event, newValue) => {
                    //   categorynamefind(newValue);
                    // }}
                    onChange={(event, newValue) => {

                      console.log("Selected values : " + newValue)
                      // setValueauto([
                      //   ...newValue.filter((option) => shopCategories.indexOf(option) === -1),
                      // ]);

                      let selected_cat = [];

                      // shopCategories.map((option) => {
                      //   if (option.CategoryName == newValue) {
                      //     // setiProductcategory(option.iProductcategory);
                      //     selected_cat.push(option.iProductcategory)
                      //   }
                      // });

                      newValue.map((cat_val) => {
                        shopCategories.map((option) => {
                          if (option.CategoryName == cat_val) {
                            // setiProductcategory(option.iProductcategory);
                            selected_cat.push(option.iProductcategory)
                          }
                        });
                      });

                      if(selected_cat.length>0)
                      {
                        console.log("Selected category : " + JSON.stringify(selected_cat))

                        let productArray_temp = productArray

                        let selectedproductArray_temp = productArray_temp;

                        let prod_selec = []

                        selected_cat.map((cat_val) => {
                          selectedproductArray_temp.filter((item) => {
                              if(item.iProductcategory === cat_val)
                              {
                                prod_selec.push(item)
                              }
                          });
                        });

                        if(prod_selec.length>0)
                        {
                          setselectedProductArray(prod_selec);
                        }
                      }
                      else{
                        setselectedProductArray(productArray);
                      }
                    }}

                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
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
                </Box>

                <Box py={2} display="flex" justifyContent="space-between">
                  <Button
                    onClick={handleProductfilter}
                    variant="contained"
                    color="primary"
                    endIcon={<Done size={14} />}
                  >
                    Submit
                  </Button>
                </Box>

                <Box py={2} display="flex" alignItems="center">
                  <Typography > Note : Kindly choose product for menu list </Typography>
                </Box>

            </Grid>

            {/* <Grid item xs={6}>

              

            </Grid>

            <Grid item xs={6}>
              <Box py={2} display="flex" justifyContent="space-between">
                <Button
                  onClick={handleProductfilter}
                  variant="contained"
                  color="primary"
                  endIcon={<Done size={14} />}
                >
                  Submit
                </Button>
              </Box>
            </Grid> */}

            <Grid item xs={8} >

            {productArray && (
              <MUIDataTable
                response="scrollFullHeight"
                title="Products for Menu List"
                data={selectedproductArray}
                columns={columns}
                options={options}
                components={{ icons: { DownloadIcon: SaveAlt } }}
              />
            )}

            </Grid>
          </Grid>

        </DialogContent>
      </Dialog>
    </>
  );
}
