import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Collapse,
  Avatar,
  TextField,
} from "@material-ui/core";
import { Close, Done } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useFormik, useFormikContext } from "formik";
import * as yup from "yup";
import { Alert } from "@material-ui/lab";
import { AttachFile } from "@material-ui/icons";
import axios from "axios";
import CategoryFileUpload from "./CategoryFileUpload";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const { REACT_APP_SHOPAPI_URL } = process.env;

export default function AddCategory({
  shopId,
  setCategoryDialog,
  getCategory,
  view,
  editview,
  setcategoryDialogview,
  setcategoryDialogedit,
  productlist,
  categorynamefind,
}) {
  // console.log("Product list : " + JSON.stringify(productlist));

  // const [productlist_edit, setproductlist_edit] = useState([]);

  const productlist_edit = useSelector((state) => productlist) || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");

  const [editfile, seteditfile] = useState([]);

  const setFile = (e, elName) => {
    formik.setFieldValue(elName, e.currentTarget.files[0]);
  };

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const setFileedit = (e, elName) => {
    // console.log(
    //   "images uploaded : " + JSON.stringify(e.currentTarget.files[0])
    // );
    formikedit.setFieldValue(elName, e.currentTarget.files[0]);
  };

  const validationSchema = yup.object({
    categoryImage: yup
      .mixed()
      .nullable()
      .required("Please select a category image"),
    CategoryName: yup
      .string("Enter a category name")
      .required("Enter a category name"),
    description: yup
      .string("Enter a description")
      .required("Enter a description"),
  });

  const formik = useFormik({
    initialValues: {
      categoryImage: null,
      CategoryName: "",
      description: "",
    },
    validationSchema: validationSchema,
    // enableReinitialize: true,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      handleSubmit(values);
    },
  });

  const formikedit = useFormik({
    initialValues: {
      categoryImage: null,
      CategoryName: productlist_edit.CategoryName,
      description: productlist_edit.description,
    },
    validationSchema: validationSchema,
    // enableReinitialize: true,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      // handleSubmitedit(values);
      handleSubmitEdit(values);
    },
  });

  // useEffect(() => {
  //   // if (productlist == null || productlist.length < 1) return;
  //   // setproductlist_edit(productlist)

  //   if(productlist!=undefined)
  //   {
  //     setproductlist_edit(productlist)
  //   }
  // }, []);

  const editchange = (e) => {
    // console.log("Changed event : " + e.target.value);
    // productlist_edit.CategoryName = e.target.value;
    // setproductlist_edit({... productlist_edit, e.target.value})
  };

  const editcategory = () => {
    // console.log("Image url name : " + productlist_edit.Category_Image)

    view = true;
    editview = false;
    setcategoryDialogview(false);
    setCategoryDialog(false);
    setcategoryDialogedit(true);
  };

  const handleSubmitEdit = async (values) => {
    if (editfile) {
      // console.log("Submitted values : " + JSON.stringify(editfile));
    }

    // console.log("Submitted values : " + JSON.stringify(formik));
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      // console.log("Image file : " + img);

      setSelectedFile(img);

      // seteditfile({ selectedFile: event.target.files[0] });

      // this.setState({
      //   image: URL.createObjectURL(img)
      // });
    }
  };

  const changeHandler = (event) => {
    // console.log("Image file : " + JSON.stringify(event.target.files));

    setSelectedFile(event.target.files[0]);
  };

  const saveedit = async () => {
    const formData = new FormData();

    formData.append("categoryImage", selectedFile);
    shopId ? formData.append("shopId", shopId) : formData.append("shopId", 0);
    formData.append("productCategoryId", productlist_edit.iProductcategory);
    formData.append("categoryName", formikedit.values.CategoryName);
    formData.append("description", formikedit.values.description);

    // console.log("Submitted shopId : " + shopId);
    // console.log("Submitted values : " + formData);

    axios
      .put("/mylapay/shop/product_catogory", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.success === 1) {
          // setLoading(false);
          // getCategory(productlist_edit.CategoryName);
          // setcategoryDialogedit(false);
          setcategoryDialogedit(false);

          // Swal.fire({
          //   title: "Success!",
          //   text: "Category Updated Successfully!",
          //   icon: "success",
          //   confirmButtonText: "OK",
          //   confirmButtonColor: "#20295C",
          // });
          toast.success("Category Updated Successfully!");
        } else {
          setError(true);
          setErrorMsg(res.data.message);
        }
      })
      .catch((error) => {});
  };

  const handleSubmit = async (values) => {
    // console.log("Submitted values : " + values);

    setLoading(true);
    const formData = new FormData();

    shopId ? formData.append("shopId", shopId) : formData.append("shopId", 0);

    Object.keys(values).forEach((key) => formData.append(key, values[key]));

    await axios
      .post("/mylapay/shop/add/product_catogory", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.success === 1) {
          setLoading(false);
          getCategory(values.CategoryName);
          categorynamefind(values.CategoryName);
          setCategoryDialog(false);

          // Swal.fire({
          //   title: "Success!",
          //   text: "Category Added Successfully!",
          //   icon: "success",
          //   confirmButtonText: "OK",
          //   confirmButtonColor: "#20295C",
          // });
          toast.success("Category Added Successfully!");
        } else {
          setError(true);
          setErrorMsg(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(true);
          setErrorMsg(error.response.data.message);
        } else if (error.request) {
          setError(true);
          setErrorMsg(error.request.message);
        } else {
          setError(true);
          setErrorMsg(error.message);
        }
      });
    setLoading(false);
  };

  return (
    <>
      {view == false ? (
        <>
          <form onSubmit={formik.handleSubmit}>
            <CategoryFileUpload
              id="categoryImage"
              name="categoryImage"
              value={formik.values.categoryImage}
              setfile={setFile}
              error={
                formik.touched.categoryImage &&
                Boolean(formik.errors.categoryImage)
              }
              helperText={
                formik.touched.categoryImage && formik.errors.categoryImage
              }
            />

            <TextField
              style={{ marginTop: "1em" }}
              fullWidth
              label="Name"
              variant="outlined"
              id="CategoryName"
              name="CategoryName"
              value={formik.values.CategoryName}
              onChange={formik.handleChange}
              error={
                formik.touched.CategoryName &&
                Boolean(formik.errors.CategoryName)
              }
              helperText={
                formik.touched.CategoryName && formik.errors.CategoryName
              }
            />

            <TextField
              style={{ marginTop: "1em" }}
              fullWidth
              label="Description"
              variant="outlined"
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              multiline
              rows={3}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
            <Collapse in={error}>
              <Box mt={2}>
                <Alert severity="error">{errorMsg}</Alert>
              </Box>
            </Collapse>

            <Box py={2} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Close />}
                onClick={() => {
                  setCategoryDialog(false);
                }}
                disabled={loading}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={loading ? <CircularProgress size={14} /> : <Done />}
                disabled={loading}
              >
                Submit
              </Button>
            </Box>
          </form>
        </>
      ) : editview == false ? (
        <>
          <form onSubmit={formikedit.handleSubmit}>
            {/* <CategoryFileUpload
                id="categoryImage"
                name="categoryImage"
                value={formikedit.values.categoryImage}
                setfile={setFileedit}
                error={
                  formikedit.touched.categoryImage && Boolean(formikedit.errors.categoryImage)
                }
                helperText={
                  formikedit.touched.categoryImage && formikedit.errors.categoryImage
                }
              /> */}

            <input
              type="file"
              id="categoryImage"
              name="categoryImage"
              accept="image/png, image/jpeg, image/jpg"
              className="fileupload"
              onChange={onImageChange}

              // onChange={changeHandler}
              // onChange={(e) => setSelectedFile(e.target.files[0])}
            />

            <label
              className="fileupload-label"
              htmlFor="categoryImage"
              style={{ overflow: "visible" }}
            >
              <Typography
                variant="body2"
                style={{
                  position: "absolute",
                  left: "6px",
                  top: "-0.8em",
                  background: "#fff",
                  display: "inline-flex",
                  padding: "0 5px",
                  fontSize: "12px",
                  color: "#757575",
                }}
              >
                Category Image
              </Typography>
              <span>Choose a file</span>

              <AttachFile className="fileupload-label-icon" />
            </label>

            {/* <input
                  id="file"
                  name="categoryImage"
                  type="file"
                  onChange={(event) => {
                    const files = event.target.files;
                    let myFiles =Array.from(files);

                    console.log("Files : " + JSON.stringify(files));
                    formikedit.setFieldValue("categoryImage", myFiles);
                  }}
                /> */}

            <TextField
              style={{ marginTop: "1em" }}
              fullWidth
              label="Name edit"
              variant="outlined"
              id="CategoryName"
              name="CategoryName"
              value={formikedit.values.CategoryName}
              onChange={formikedit.handleChange}
              // disabled
              // onChange={editchange()}
              // onChange={(e) => editchange(e)}
              error={
                formikedit.touched.CategoryName &&
                Boolean(formikedit.errors.CategoryName)
              }
              helperText={
                formikedit.touched.CategoryName &&
                formikedit.errors.CategoryName
              }
            />

            <TextField
              style={{ marginTop: "1em" }}
              fullWidth
              label="Description"
              variant="outlined"
              id="description"
              name="description"
              value={formikedit.values.description}
              onChange={formikedit.handleChange}
              multiline
              // disabled
              rows={3}
              error={
                formikedit.touched.description &&
                Boolean(formikedit.errors.description)
              }
              helperText={
                formikedit.touched.description && formikedit.errors.description
              }
            />
            <Collapse in={error}>
              <Box mt={2}>
                <Alert severity="error">{errorMsg}</Alert>
              </Box>
            </Collapse>

            <Box py={2} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Close />}
                onClick={() => {
                  setcategoryDialogedit(false);
                }}
                disabled={loading}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={loading ? <CircularProgress size={14} /> : <Done />}
                disabled={loading}
                onClick={() => {
                  saveedit();
                }}
              >
                Submit
              </Button>
            </Box>
          </form>
        </>
      ) : (
        <>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1} style={{ width: "350px" }}>
              <Grid item xs={6}>
                {productlist.Category_Image != null ? (
                  <img
                    src={`${REACT_APP_SHOPAPI_URL}/uploads${productlist.Category_Image}`}
                    // src={URL.createObjectURL(productlist.Category_Image)}
                    alt={productlist.CategoryName}
                    height="120px"
                    width="120px"
                  />
                ) : (
                  <Avatar
                    style={{ height: "120px", width: "120px" }}
                    variant="rounded"
                    src="/images/no-image-icon-23494.png"
                  ></Avatar>
                )}
              </Grid>

              <Grid item xs={6}>
                <Box>
                  <Typography
                    style={{ color: "#9e9e9e", fontWeight: "bold" }}
                    variant="body2"
                  >
                    Category Name :
                  </Typography>

                  {productlist.CategoryName}
                </Box>

                <Box mt={2}>
                  <Typography
                    style={{ color: "#9e9e9e", fontWeight: "bold" }}
                    variant="body2"
                  >
                    Description :
                  </Typography>

                  {productlist.description}
                </Box>
              </Grid>
            </Grid>

            <Box py={2} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Close />}
                onClick={() => {
                  setcategoryDialogview(false);
                }}
                disabled={loading}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                // endIcon={loading ? <CircularProgress size={14} /> : <Done />}
                disabled={loading}
                onClick={() => {
                  editcategory();
                }}
              >
                Edit
              </Button>
            </Box>
          </form>
        </>
      )}
    </>
  );
}
