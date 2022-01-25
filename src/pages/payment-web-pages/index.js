import {
  Box,
  Button,
  Avatar,
  AppBar,
  Tab,
  Tabs 
} from "@material-ui/core";
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
import { setWebPageDetails } from "../../redux/paymentWebPageSlice";
import Swal from "sweetalert2";

import Active from "./active";
import InActive from "./inactive";


export default function PaymentWebPage() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const { REACT_APP_SHOP_URL } = process.env;
  const { REACT_APP_SHOPAPI_URL } = process.env;
  const dispatch = useDispatch();
  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
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


  useEffect(() => {
    getData();
  }, [userData]);
  const getData = async () => {
    await axios
      .get("/mylapay/shop/payment_page")
      .then(async (res) => {
        setData(res.data.data);

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
        await axios
          .delete("/mylapay/shop/payment_page", { data: { webpageId } })

          .then((response) => {
            Swal.fire({
              title: "Success!",
              text: "Webpage Deleted!",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#20295C",
            });

            getData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
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

    customToolbar: () => (
      <Button
        component={Link}
        to="/payment-web-page/new"
        style={{ marginLeft: "1em" }}
        variant="contained"
        color="primary"
        endIcon={<Add />}
      >
        Create New
      </Button>
    ),
  };
  const columns = [
    {
      name: "shop_logo",
      label: "Product Image",
      options: {
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
                // onClick={() => {
                //   viewproduct(tableMeta);
                // }}
                src={`${REACT_APP_SHOPAPI_URL}/uploads${value}`}
              ></Avatar>
            );
          } else {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                // onClick={() => {
                //   viewproduct(tableMeta);
                // }}
                src="/images/no-image-icon-23494.png"
              ></Avatar>
            );
          }
        },
      },
    },
    {
      name: "shopID",
      label: "Id",
      options: {
        sort: true,
        display:false,
      },
    },
    {
      name: "shop_name",
      label: "Name",
      options: {
        sort: true,
      },
    },
    {
      name: "url_name",
      label: "Page Link",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <a
            href={REACT_APP_SHOP_URL + "/payment-webpage/" + value}
            target="_blank"
            rel="noreferrer"
            className="mp-link"
            style={{ pointerEvents: tableMeta.rowData[4] === 0 && "none" }}
          >
            {REACT_APP_SHOP_URL + "/payment-webpage/" + value}
          </a>
        ),
      },
    },
    {
      name: "isActive",
      label: "isActive",
      options: {
        sort: false,
        display: false,
      },
    },
    {
      name: "shopID",
      label: "User Action",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            <Box>
              {tableMeta.rowData[4] === 0 ? (
                <>
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
                  >
                  </Button>
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
                  >
                  </Button>
                </>
              ) : (
                <>
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
                  >
                  
                  </Button>
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
                  >
                  
                  </Button>
                </>
              )}
            </Box>
          </>
        ),
      },
    },
  ];
  return (

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
    // <Box m={2}>
    //   <MUIDataTable
    //     response="scrollFullHeight"
    //     data={data}
    //     disabled="true"
    //     title="Payment Webpages"
    //     columns={columns}
    //     options={options}
    //   />
    // </Box>
  );
}
