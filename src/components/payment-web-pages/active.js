import { Box, Button, Avatar, AppBar, Tab, Tabs } from "@material-ui/core";
import {
  Add,
  Edit,
  DeleteOutline,
  AddAlert,
  DepartureBoard,
} from "@material-ui/icons";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import copy from "copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import AddNewProduct from "./AddNewProduct";
import LinesEllipsis from "react-lines-ellipsis";

// import UserAction from "../../components/transanctions/UserAction";

export default function Active() {
  const [data, setData] = useState([]);
  const [paymentiShop, setPaymentiShop] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const { REACT_APP_SHOP_URL } = process.env;
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const dispatch = useDispatch();
  const webPageDetails = useSelector(
    (state) => state.paymentWebPage.webPageDetails
  );

  const [showNewPrdDialog, setShowNewPrdDialog] = useState(false);
  const [editId, setEditId] = useState(null);

  console.log("webPageDetails : " + JSON.stringify(webPageDetails));

  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
  };

  const viewproduct = (value) => {
    window.open(
      `${REACT_APP_SHOP_URL}/payment-webpage/${webPageDetails["shop_url"]}/${value["rowData"][1]}`,
      "_blank"
    );
  };

  useEffect(() => {
    getData();

    if(localStorage.getItem("addpaymentpage")==1)
    {
      setShowNewPrdDialog(true);
      localStorage.removeItem("addpaymentpage")

    }
    
  }, [userData]);
  const getData = async () => {
    await axios
      .get("/mylapay/shop/payment_page")
      .then(async (res) => {
        // setData(res.data.data);

        if (res.data.data[0].shopID) {
          setPaymentiShop(res.data.data[0].shopID);
          // getProductList();

          await axios
            .get(
              `mylapay/shop/product_details?iShop=${res.data.data[0].shopID}&status=1`
            )
            .then(async (res) => {
              if (res.data.status) {
                setData(res.data.data);
              }
            })
            .catch((err) => {
              console.log(err);
              // toast.error("Something went wrong while fetching products");
            });
        }

        if (res.data.data) {
          // let logoFile = await createFileFromUrl(
          //   `${REACT_APP_SHOPAPI_URL}/uploads${res.data.data[0].shop_logo}`,
          //   "logo"
          // );
          // const webPageDetails = {
          //   shop_name: "",
          //   shop_logo: logoFile,
          //   url_name: "",
          // };
          // dispatch(setWebPageDetails(webPageDetails));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const copyToClipboard = (value) => {
    console.log("Id check : " + value);
    copy(
      `${REACT_APP_SHOP_URL}/payment-webpage/${webPageDetails["shop_url"]}/${value}`
    );
  };

  const editProduct = async (id) => {
    setEditId(id);
    setShowNewPrdDialog(true);
  };

  const deleteWebpage = (webpageId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#20295C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteApiCall(webpageId);
        // await axios
        //   .delete("/mylapay/shop/payment_page", { data: { webpageId } })

        //   .then((response) => {
        //     Swal.fire({
        //       title: "Success!",
        //       text: "Webpage Deleted!",
        //       icon: "success",
        //       confirmButtonText: "OK",
        //       confirmButtonColor: "#20295C",
        //     });

        //     getData();
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      }
    });
  };

  const deleteApiCall = async (iProduct) => {
    if (!iProduct) return;
    await axios
      .delete("/mylapay/shop/product_details", { data: { iProduct } })
      .then((res) => {
        if (res.data.status) {
          // toast.success("Product Deleted Successfully!");
          // getProductList();
          getData();
        }
      })
      .catch((error) => {
        // toast.error("Something went wrong, please try again");
        console.log(error);
      });
  };

  const TableHeader = () => {
    return (
      <Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setShowNewPrdDialog(true);
          }}
        >
          Add new Payment Page
        </Button>
      </Box>
    );
  };

  const options = {
    filter: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: "none",
    download: false,
    sortOrder: {
      name: "iWebpage",
      direction: "desc",
    },

    // customToolbar: () => (
    //   <Button
    //     component={Link}
    //     to="/payment-web-page/new"
    //     style={{ marginLeft: "1em" }}
    //     variant="contained"
    //     color="primary"
    //     endIcon={<Add />}
    //   >
    //     Create New
    //   </Button>
    // ),
  };
  const columns = [
    {
      name: "product_image",
      label: "Product Image",
      options: {
        setCellProps: () => ({
          style: { minWidth: "50px", maxWidth: "50px", width: "50px" },
        }),
        sort: true,
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   return (
        //     <img
        //       src={REACT_APP_SHOPAPI_URL + "/uploads" + value}
        //       alt="payment page logo"
        //       height="80"
        //       width="80"
        //     />
        //   );
        // },

        customBodyRender: (value, tableMeta, updateValue) => {
          if (value != null) {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
                src={`${REACT_APP_SHOPAPI_URL}/uploads${value}`}
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
      name: "id",
      label: "Id",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "product_name",
      label: "Name",
      options: {
        sort: true,
        setCellProps: () => ({
          style: { minWidth: "300px", maxWidth: "300px", width: "300px" },
        }),
        customBodyRender: (value, tableMeta, updateValue) => (
          <a
            className="mp-link"
            href="javascript:void(0)"
            rel="noreferrer"
            onClick={() => {
              viewproduct(tableMeta);
            }}
          >
            <LinesEllipsis text={value} maxLine={3} />
          </a>
        ),
      },
    },
    // {
    //   name: "url_name",
    //   label: "Page Link",
    //   options: {
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => (
    //       <a
    //         href={REACT_APP_SHOP_URL + "/payment-webpage/" + value}
    //         target="_blank"
    //         rel="noreferrer"
    //         className="mp-link"
    //         style={{ pointerEvents: tableMeta.rowData[4] === 0 && "none" }}
    //       >
    //         {REACT_APP_SHOP_URL + "/payment-webpage/" + value}
    //       </a>
    //     ),
    //   },
    // },
    // {
    //   name: "isActive",
    //   label: "isActive",
    //   options: {
    //     sort: false,
    //     display: false,
    //   },
    // },
    {
      name: "prodDescription",
      label: "Description",
      options: {
        sort: false,
        setCellProps: () => ({
          style: { maxWidth: "200px", whiteSpace: "normal" },
        }),
        customBodyRender: (value, tableMeta, updateValue) => (
          <LinesEllipsis text={value} maxLine={3} />
        ),
      },
    },
    {
      name: "price",
      label: "price",
      options: {
        sort: false,
      },
    },
    {
      name: "id",
      label: "User Action",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            <Box>
              {tableMeta.rowData[5] === 0 ? (
                <>
                  <Button
                    style={{
                      marginTop: "auto",
                      backgroundColor: "#f44336",
                      minWidth: "50px",
                    }}
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<FileCopyIcon color="secondary" />}
                    // onClick={copyToClipboard(value)}
                    onClick={() => copyToClipboard(value)}
                    disabled
                  ></Button>

                  <Button
                    component={Link}
                    to={"/payment-web-page/edit?editItem=" + value}
                    style={{
                      color: "#fff",
                      marginRight: "10px",
                      minWidth: "50px",
                    }}
                    variant="contained"
                    color="secondary"
                    size="small"
                    disabled
                    endIcon={<Edit />}
                  ></Button>
                  <Button
                    style={{
                      marginTop: "auto",
                      backgroundColor: "#f44336",
                      minWidth: "50px",
                    }}
                    size="small"
                    variant="contained"
                    endIcon={<DeleteOutline />}
                    disabled
                    onClick={() => deleteWebpage(value)}
                  ></Button>
                </>
              ) : (
                <>
                  <Button
                    style={{
                      color: "#fff",
                      marginRight: "10px",
                      minWidth: "50px",
                    }}
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<FileCopyIcon />}
                    // onClick={copyToClipboard(value)}
                    onClick={() => copyToClipboard(value)}
                  ></Button>

                  <Button
                    component={Link}
                    to={"/payment-web-page/edit?editItem=" + value}
                    style={{
                      color: "#fff",
                      marginRight: "10px",
                      minWidth: "50px",
                    }}
                    variant="contained"
                    color="secondary"
                    size="small"
                    endIcon={<Edit />}
                    onClick={() => editProduct(value)}
                  ></Button>
                  <Button
                    style={{
                      marginTop: "auto",
                      backgroundColor: "#f44336",
                      color: "#fff",
                      minWidth: "50px",
                    }}
                    size="small"
                    variant="contained"
                    endIcon={<DeleteOutline />}
                    onClick={() => deleteWebpage(value)}
                  ></Button>
                </>
              )}
            </Box>
          </>
        ),
      },
    },
  ];

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<Add />}
        disableElevation
        onClick={() => {
          setShowNewPrdDialog(true);
        }}
        style={{
          marginTop: "-4em",
          float: "right",
          marginRight: "1em",
          color: "#fff",
        }}
      >
        Add new Payment Page
      </Button>

      <Box m={2}>
        <MUIDataTable
          response="scrollFullHeight"
          data={data}
          disabled="true"
          title="Payment Webpages"
          // title={<TableHeader />}
          columns={columns}
          options={options}
        />
      </Box>

      {showNewPrdDialog ? (
        <AddNewProduct
          setShowNewPrdDialog={setShowNewPrdDialog}
          getProductList={getData}
          editId={editId}
          paymentiShop={paymentiShop}
          setEditId={setEditId}
          createFileFromUrl={createFileFromUrl}
        />
      ) : null}
    </>
  );
}
